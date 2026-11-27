using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;

namespace ExamServer.Services;

/// <summary>
/// 로그인 세션(쿠키) 발급/검증 — 학생 세션과 관리자 세션 두 종류.
/// 쿠키 안에는 누구인지(학번 또는 관리자 표시)와 만료 시각만 들어 있고,
/// Session:Secret으로 서명되어 있어 브라우저에서 값을 바꾸면 통과하지 못한다.
/// (기존 api/_lib/session.js와 같은 형식)
/// </summary>
public sealed class SessionService(IOptions<SessionSettings> settings)
{
    public const string StudentCookie = "kbu_student_session";
    public const string AdminCookie = "kbu_admin_session";

    private static readonly TimeSpan StudentTtl = TimeSpan.FromHours(1);
    private static readonly TimeSpan AdminTtl = TimeSpan.FromHours(4);
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    private sealed record Payload(string Purpose, string? StudentNum, long Exp);

    private byte[] Secret
    {
        get
        {
            var secret = settings.Value.Secret;
            if (string.IsNullOrEmpty(secret))
                throw new InvalidOperationException("Session:Secret 설정이 없습니다.");
            return Encoding.UTF8.GetBytes(secret);
        }
    }

    public void SignInStudent(HttpContext context, string studentNum) =>
        Write(context, StudentCookie, CreateToken(new Payload("student", studentNum, ExpiresAt(StudentTtl))), StudentTtl);

    public void SignInAdmin(HttpContext context) =>
        Write(context, AdminCookie, CreateToken(new Payload("admin", null, ExpiresAt(AdminTtl))), AdminTtl);

    /// <summary>학생·관리자 쿠키를 모두 지운다.</summary>
    public void SignOutAll(HttpContext context)
    {
        foreach (var name in new[] { StudentCookie, AdminCookie })
            context.Response.Cookies.Delete(name, CookieOptionsFor(context, null));
    }

    /// <summary>쿠키에서 검증된 학번을 꺼낸다. 서명이 틀렸거나 만료됐으면 null.</summary>
    public string? GetStudentNum(HttpRequest request) =>
        ReadToken(request, StudentCookie) is { Purpose: "student", StudentNum: { Length: > 0 } studentNum }
            ? studentNum
            : null;

    public bool IsAdmin(HttpRequest request) => ReadToken(request, AdminCookie) is { Purpose: "admin" };

    private static long ExpiresAt(TimeSpan ttl) => DateTimeOffset.UtcNow.Add(ttl).ToUnixTimeMilliseconds();

    private string Sign(string payloadBase64) =>
        WebEncoders.Base64UrlEncode(HMACSHA256.HashData(Secret, Encoding.UTF8.GetBytes(payloadBase64)));

    private string CreateToken(Payload payload)
    {
        var payloadBase64 = WebEncoders.Base64UrlEncode(JsonSerializer.SerializeToUtf8Bytes(payload, Json));
        return $"{payloadBase64}.{Sign(payloadBase64)}";
    }

    private Payload? ReadToken(HttpRequest request, string cookieName)
    {
        if (!request.Cookies.TryGetValue(cookieName, out var token) || string.IsNullOrEmpty(token))
            return null;

        var parts = token.Split('.');
        if (parts.Length != 2) return null;

        // 길이가 달라도 false를 돌려주고, 같은 길이면 걸리는 시간이 일정하게 비교한다.
        var expected = Encoding.ASCII.GetBytes(Sign(parts[0]));
        var actual = Encoding.ASCII.GetBytes(parts[1]);
        if (!CryptographicOperations.FixedTimeEquals(expected, actual)) return null;

        try
        {
            var payload = JsonSerializer.Deserialize<Payload>(WebEncoders.Base64UrlDecode(parts[0]), Json);
            if (payload is null || DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() > payload.Exp) return null;
            return payload;
        }
        catch (Exception ex) when (ex is FormatException or JsonException)
        {
            return null;
        }
    }

    private static void Write(HttpContext context, string name, string value, TimeSpan ttl) =>
        context.Response.Cookies.Append(name, value, CookieOptionsFor(context, ttl));

    private static CookieOptions CookieOptionsFor(HttpContext context, TimeSpan? ttl) => new()
    {
        HttpOnly = true,
        // https일 때만 Secure — 로컬 http 개발 환경에서는 Secure를 붙이면 쿠키가 저장되지 않는다.
        Secure = context.Request.IsHttps,
        SameSite = SameSiteMode.Strict,
        Path = "/",
        MaxAge = ttl,
        IsEssential = true,
    };
}
