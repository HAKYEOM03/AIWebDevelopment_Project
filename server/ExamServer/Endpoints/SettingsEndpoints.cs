using System.Text.Json;
using ExamServer.Data;
using ExamServer.Services;
using Microsoft.EntityFrameworkCore;

namespace ExamServer.Endpoints;

/// <summary>
/// 관리자 설정 API — 시험 잠금, D-DAY 잠금, 시험 날짜, 소개 내용.
/// 지금까지는 관리자 브라우저(localStorage)에만 저장돼서 학생에게 적용되지 않았는데,
/// 이제 DB에 저장해서 모든 학생에게 똑같이 적용된다.
/// </summary>
public static class SettingsEndpoints
{
    private static readonly string[] ExamIds = ["english", "bible", "computer"];
    private static readonly string[] Keys = ["examLocks", "ddayLocks", "examDates", "introContent"];
    private const int MaxValueLength = 100_000;

    public static void MapSettingsEndpoints(this IEndpointRouteBuilder app)
    {
        // 누구나 읽을 수 있다 — 화면을 그리는 데 필요한 공개 정보(잠금 여부, 날짜, 소개)만 들어 있다.
        app.MapGet("/api/settings", async (AppDbContext db, CancellationToken ct) =>
        {
            var rows = await db.SiteSettings.AsNoTracking().ToListAsync(ct);
            var settings = new Dictionary<string, JsonElement>();
            foreach (var row in rows)
            {
                try
                {
                    settings[row.Key] = JsonDocument.Parse(row.ValueJson).RootElement.Clone();
                }
                catch (JsonException)
                {
                    // 깨진 값은 건너뛴다 — 화면은 기본값을 쓴다.
                }
            }
            return Results.Ok(new { ok = true, settings });
        });

        // 관리자만 바꿀 수 있다. 키 하나의 값 전체를 통째로 바꾼다.
        app.MapPut("/api/settings/{key}", async (
            string key, JsonElement value, HttpRequest request, SessionService session,
            AppDbContext db, CancellationToken ct) =>
        {
            if (!session.IsAdmin(request))
                return AuthEndpoints.Error(StatusCodes.Status401Unauthorized, "관리자 로그인이 필요합니다.");

            if (!Keys.Contains(key))
                return AuthEndpoints.Error(StatusCodes.Status400BadRequest, "지원하지 않는 설정입니다.");

            var json = value.GetRawText();
            if (json.Length > MaxValueLength)
                return AuthEndpoints.Error(StatusCodes.Status400BadRequest, "설정 값이 너무 큽니다.");

            if (Validate(key, value) is { } error)
                return AuthEndpoints.Error(StatusCodes.Status400BadRequest, error);

            var row = await db.SiteSettings.FindAsync([key], ct);
            if (row is null)
            {
                db.SiteSettings.Add(new SiteSetting { Key = key, ValueJson = json, UpdatedAt = DateTime.UtcNow });
            }
            else
            {
                row.ValueJson = json;
                row.UpdatedAt = DateTime.UtcNow;
            }

            try
            {
                await db.SaveChangesAsync(ct);
            }
            catch (DbUpdateException) when (row is null)
            {
                // 다른 관리자가 같은 순간에 처음 저장한 경우 — 이미 생긴 줄을 덮어쓴다.
                db.ChangeTracker.Clear();
                var existing = await db.SiteSettings.FirstAsync(s => s.Key == key, ct);
                existing.ValueJson = json;
                existing.UpdatedAt = DateTime.UtcNow;
                await db.SaveChangesAsync(ct);
            }

            return Results.Ok(new { ok = true });
        });
    }

    /// <summary>설정 종류별로 모양을 검사한다. 문제가 없으면 null.</summary>
    private static string? Validate(string key, JsonElement value)
    {
        if (value.ValueKind != JsonValueKind.Object) return "설정 값의 형식이 올바르지 않습니다.";

        foreach (var property in value.EnumerateObject())
        {
            if (!ExamIds.Contains(property.Name)) return $"알 수 없는 시험입니다: {property.Name}";

            var ok = key switch
            {
                "examLocks" or "ddayLocks" => property.Value.ValueKind is JsonValueKind.True or JsonValueKind.False,
                "examDates" => property.Value.ValueKind == JsonValueKind.String &&
                               DateTimeOffset.TryParse(property.Value.GetString(), out _),
                "introContent" => property.Value.ValueKind == JsonValueKind.Object,
                _ => false,
            };
            if (!ok) return $"{property.Name}의 값이 올바르지 않습니다.";
        }
        return null;
    }
}
