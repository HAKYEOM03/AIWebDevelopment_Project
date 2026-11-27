using System.Text.Json;
using ExamServer.Services;

namespace ExamServer.Endpoints;

/// <summary>
/// 연습문제 통계 API — 기존 api/stats-record.js, api/stats.js, api/my-stats.js와 같은 주소·응답.
/// </summary>
public static class StatsEndpoints
{
    public const string RecordRateLimit = "stats-record";

    public static void MapStatsEndpoints(this IEndpointRouteBuilder app)
    {
        // 학생이 한 번 풀고 제출한 결과를 저장한다 (로그인한 학생만).
        app.MapPost("/api/stats-record", async (
            JsonElement body, HttpRequest request, SessionService session, StatsService stats,
            IHostEnvironment env, ILoggerFactory loggerFactory, CancellationToken ct) =>
        {
            var studentNum = session.GetStudentNum(request);
            if (studentNum is null)
                return AuthEndpoints.Error(StatusCodes.Status401Unauthorized, "로그인이 필요합니다.");

            if (body.ValueKind != JsonValueKind.Object || !body.TryGetProperty("results", out var results))
                return AuthEndpoints.Error(StatusCodes.Status400BadRequest, "기록할 결과 개수가 올바르지 않습니다.");

            try
            {
                var (error, count) = await stats.RecordAsync(results, studentNum, ct);
                return error is not null
                    ? AuthEndpoints.Error(StatusCodes.Status400BadRequest, error)
                    : Results.Ok(new { ok = true, count });
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                loggerFactory.CreateLogger("ExamServer.Stats").LogError(ex, "풀이 기록 저장 실패");
                return Failure("통계 기록 중 오류가 발생했습니다.", ex, env);
            }
        }).RequireRateLimiting(RecordRateLimit);

        // [관리자] 모든 학우의 기록을 종합한 통계. 서버가 발급한 관리자 쿠키가 없으면 한 줄도 나가지 않는다.
        app.MapGet("/api/stats", async (
            string? year, HttpRequest request, SessionService session, StatsService stats,
            IHostEnvironment env, ILoggerFactory loggerFactory, CancellationToken ct) =>
        {
            if (!session.IsAdmin(request))
                return AuthEndpoints.Error(StatusCodes.Status401Unauthorized, "관리자 로그인이 필요합니다.");

            try
            {
                return Results.Ok(await stats.GetAdminStatsAsync(StatsService.ResolveYear(year), ct));
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                loggerFactory.CreateLogger("ExamServer.Stats").LogError(ex, "관리자 통계 조회 실패");
                return Failure("통계를 불러오는 중 오류가 발생했습니다.", ex, env);
            }
        });

        // [학생] 로그인한 본인의 통계. 누구 것을 볼지는 요청이 아니라 로그인 세션으로만 정한다.
        app.MapGet("/api/my-stats", async (
            string? year, HttpRequest request, SessionService session, StatsService stats,
            IHostEnvironment env, ILoggerFactory loggerFactory, CancellationToken ct) =>
        {
            var studentNum = session.GetStudentNum(request);
            if (studentNum is null)
                return AuthEndpoints.Error(StatusCodes.Status401Unauthorized, "로그인이 필요합니다.");

            try
            {
                return Results.Ok(await stats.GetMyStatsAsync(StatsService.ResolveYear(year), studentNum, ct));
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                loggerFactory.CreateLogger("ExamServer.Stats").LogError(ex, "내 통계 조회 실패");
                return Failure("내 통계를 불러오는 중 오류가 발생했습니다.", ex, env);
            }
        });
    }

    private static IResult Failure(string message, Exception ex, IHostEnvironment env) =>
        Results.Json(
            new { ok = false, error = message, debug = env.IsDevelopment() ? ex.Message : null },
            statusCode: StatusCodes.Status502BadGateway);
}
