using System.Security.Cryptography;
using System.Text;
using ExamServer.Services;
using Microsoft.Extensions.Options;

namespace ExamServer.Endpoints;

public sealed record SpaceRequest(string? Subject, string? StudentId, string? Password);

public sealed record AdminLoginRequest(string? Id, string? Password);

/// <summary>
/// 로그인 관련 API — 기존 api/space.js, api/me.js, api/logout.js, api/admin-login.js와 같은 주소·응답.
/// </summary>
public static class AuthEndpoints
{
    private const string AdminThrottleKey = "admin";

    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/space", SpaceAsync);

        app.MapGet("/api/me", (HttpRequest request, SessionService session) =>
            session.GetStudentNum(request) is { } studentNum
                ? Results.Ok(new { ok = true, studentNum })
                : Results.Json(new { ok = false }, statusCode: StatusCodes.Status401Unauthorized));

        app.MapPost("/api/logout", (HttpContext context, SessionService session) =>
        {
            session.SignOutAll(context);
            return Results.Ok(new { ok = true });
        });

        app.MapPost("/api/admin-login", AdminLoginAsync);
    }

    /// <summary>
    /// POST /api/space — subject "user"(학번 로그인) 또는 "gradExam"(내 졸업시험 기록).
    /// 학교 API로 보내는 값은 브라우저 값을 그대로 넘기지 않고 하나씩 직접 조립한다.
    /// </summary>
    private static async Task<IResult> SpaceAsync(
        SpaceRequest body,
        HttpContext context,
        BibleApiClient bible,
        SessionService session,
        LoginThrottle throttle,
        IHostEnvironment env,
        ILoggerFactory loggerFactory,
        CancellationToken ct)
    {
        if (body.Subject is not ("user" or "gradExam"))
            return Error(StatusCodes.Status400BadRequest, "지원하지 않는 요청입니다.");

        try
        {
            if (body.Subject == "user")
            {
                if (string.IsNullOrWhiteSpace(body.StudentId) || string.IsNullOrEmpty(body.Password))
                    return Error(StatusCodes.Status400BadRequest, "학번과 비밀번호를 입력하세요.");

                var throttleKey = $"student:{body.StudentId.Trim()}";
                if (throttle.IsBlocked(throttleKey))
                    return Error(StatusCodes.Status429TooManyRequests, "로그인 실패가 너무 많습니다. 15분 뒤에 다시 시도하세요.");

                var result = await bible.VerifyStudentAsync(body.StudentId.Trim(), body.Password, ct);
                if (!result.Success || result.UserNum is null)
                {
                    throttle.RecordFailure(throttleKey);
                    return Error(StatusCodes.Status401Unauthorized, "학번 또는 비밀번호가 올바르지 않습니다.");
                }

                throttle.Reset(throttleKey);
                session.SignInStudent(context, result.UserNum);
                return Results.Ok(new { ok = true, studentNum = result.UserNum, userStatus = result.UserStatus });
            }

            // subject == "gradExam": 학번은 절대 요청에서 받지 않고, 로그인 세션에서 검증된 값만 쓴다.
            var studentNum = session.GetStudentNum(context.Request);
            if (studentNum is null)
                return Error(StatusCodes.Status401Unauthorized, "로그인이 필요합니다.");

            var data = await bible.FetchGradExamAsync(studentNum, ct);
            return Results.Ok(new { ok = true, data });
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            loggerFactory.CreateLogger("ExamServer.Space").LogError(ex, "학교 API 호출 실패");
            // 개발 환경에서만 실제 원인을 같이 내려준다 (운영에서는 숨김).
            return Results.Json(
                new { ok = false, error = "학교 API 호출 중 오류가 발생했습니다.", debug = env.IsDevelopment() ? ex.Message : null },
                statusCode: StatusCodes.Status502BadGateway);
        }
    }

    /// <summary>
    /// POST /api/admin-login — 관리자 아이디/비밀번호를 서버 설정(Admin:Id, Admin:Password)과 비교한다.
    /// 로그인 화면은 학생도 같은 입력칸을 써서 모든 로그인이 먼저 여기를 거친다.
    /// 그래서 관리자 아이디가 맞을 때만 실패 횟수를 센다 (학생 로그인 때문에 관리자가 잠기지 않게).
    /// </summary>
    private static async Task<IResult> AdminLoginAsync(
        AdminLoginRequest body,
        HttpContext context,
        IOptions<AdminSettings> admin,
        SessionService session,
        LoginThrottle throttle,
        ILoggerFactory loggerFactory)
    {
        var adminId = admin.Value.Id;
        var adminPassword = admin.Value.Password;
        if (string.IsNullOrEmpty(adminId) || string.IsNullOrEmpty(adminPassword))
            return Error(StatusCodes.Status503ServiceUnavailable, "관리자 계정이 서버에 설정되지 않았습니다.");

        // 아이디와 비밀번호를 항상 둘 다 비교해서, 어느 쪽이 틀렸는지 시간 차이로 알 수 없게 한다.
        var idMatches = SafeEqual(body.Id ?? "", adminId);
        var passwordMatches = SafeEqual(body.Password ?? "", adminPassword);
        var blocked = idMatches && throttle.IsBlocked(AdminThrottleKey);

        if (!idMatches || !passwordMatches || blocked)
        {
            if (idMatches && !blocked) throttle.RecordFailure(AdminThrottleKey);
            if (blocked) loggerFactory.CreateLogger("ExamServer.Admin").LogWarning("관리자 로그인 실패가 많아 15분 동안 막혀 있습니다.");
            await Task.Delay(300); // 무차별 대입 속도를 늦춘다
            return Results.Json(new { ok = false }, statusCode: StatusCodes.Status401Unauthorized);
        }

        throttle.Reset(AdminThrottleKey);
        session.SignInAdmin(context);
        return Results.Ok(new { ok = true });
    }

    private static bool SafeEqual(string a, string b) =>
        CryptographicOperations.FixedTimeEquals(
            SHA256.HashData(Encoding.UTF8.GetBytes(a)),
            SHA256.HashData(Encoding.UTF8.GetBytes(b)));

    internal static IResult Error(int status, string message) =>
        Results.Json(new { ok = false, error = message }, statusCode: status);
}
