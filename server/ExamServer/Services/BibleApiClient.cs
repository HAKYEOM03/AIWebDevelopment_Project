using System.Text.Json;
using Microsoft.Extensions.Options;

namespace ExamServer.Services;

public sealed record StudentLoginResult(bool Success, string? UserNum, string? UserStatus);

/// <summary>
/// 학교 학사 API(joshua.bible.ac.kr/api/Space) 호출 전용.
/// API 키를 다루는 코드는 이 파일에만 있고, 브라우저에는 절대 나가지 않는다.
/// 요청 항목 이름은 학교 API 설명서(/Help/Api/POST-api-Space)의 SpaceModel을 따른다.
/// </summary>
public sealed class BibleApiClient(HttpClient http, IOptions<BibleApiSettings> settings, IHostEnvironment env)
{
    private bool UseMock => settings.Value.Mock && env.IsDevelopment();

    /// <summary>
    /// 학번/비밀번호 확인. 학교 API는 로그인 실패에도 HTTP 200을 주고
    /// userNum을 "000000000"으로 보내므로 그 값으로 성공 여부를 판단한다.
    /// </summary>
    public async Task<StudentLoginResult> VerifyStudentAsync(string studentId, string password, CancellationToken ct)
    {
        using var doc = await CallAsync(new Dictionary<string, string>
        {
            ["keyA"] = studentId,
            ["keyB"] = password,
            ["subject"] = "user",
        }, ct);

        var record = FirstDataItem(doc.RootElement);
        var userNum = GetString(record, "userNum");
        var userStatus = GetString(record, "userStatus");
        var success = !string.IsNullOrEmpty(userNum) && userNum != "000000000";
        return new StudentLoginResult(success, userNum, userStatus);
    }

    /// <summary>
    /// 졸업시험 신청·결과 조회. studentNum은 반드시 로그인 세션에서 검증된 값만 넘겨야 한다
    /// (요청으로 받은 학번을 넘기면 남의 정보를 볼 수 있게 된다).
    /// </summary>
    public async Task<JsonElement> FetchGradExamAsync(string studentNum, CancellationToken ct)
    {
        using var doc = await CallAsync(new Dictionary<string, string>
        {
            ["studentNum"] = studentNum,
            ["subject"] = "gradExam",
        }, ct);

        return TryGetProperty(doc.RootElement, "data", out var data) && data.ValueKind == JsonValueKind.Array
            ? data.Clone()
            : JsonDocument.Parse("[]").RootElement.Clone();
    }

    private async Task<JsonDocument> CallAsync(Dictionary<string, string> body, CancellationToken ct)
    {
        if (UseMock) return MockBibleApi.Handle(body);

        var key = settings.Value.Key;
        if (string.IsNullOrEmpty(key))
            throw new InvalidOperationException("BibleApi:Key 설정이 없습니다.");

        using var request = new HttpRequestMessage(HttpMethod.Post, settings.Value.Url)
        {
            Content = JsonContent.Create(body),
        };
        request.Headers.Add("X-BIBLE-APIGW-API-KEY", key);

        using var response = await http.SendAsync(request, ct);
        if (!response.IsSuccessStatusCode)
            throw new HttpRequestException($"학교 API 응답 오류: HTTP {(int)response.StatusCode}");

        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        return await JsonDocument.ParseAsync(stream, cancellationToken: ct);
    }

    private static JsonElement? FirstDataItem(JsonElement root) =>
        TryGetProperty(root, "data", out var data) && data.ValueKind == JsonValueKind.Array && data.GetArrayLength() > 0
            ? data[0]
            : null;

    private static string? GetString(JsonElement? element, string name)
    {
        if (element is not { ValueKind: JsonValueKind.Object } obj || !TryGetProperty(obj, name, out var value))
            return null;
        return value.ValueKind switch
        {
            JsonValueKind.String => value.GetString(),
            JsonValueKind.Number => value.GetRawText(),
            _ => null,
        };
    }

    /// <summary>학교 API 응답의 대소문자(data/Data 등)가 달라도 찾을 수 있게 대소문자를 무시하고 찾는다.</summary>
    private static bool TryGetProperty(JsonElement obj, string name, out JsonElement value)
    {
        if (obj.ValueKind == JsonValueKind.Object)
        {
            foreach (var property in obj.EnumerateObject())
            {
                if (string.Equals(property.Name, name, StringComparison.OrdinalIgnoreCase))
                {
                    value = property.Value;
                    return true;
                }
            }
        }
        value = default;
        return false;
    }
}

/// <summary>
/// 개발용 가짜 학교 API (BibleApi:Mock=true + Development 환경에서만).
/// 테스트 계정: 202200001/test1234 (신청 이력 4건), 202300002/test1234 (이력 없음), user123/user123 (이력 4건)
/// 그 외에는 실제 API처럼 userNum "000000000"(로그인 실패)으로 응답한다.
/// </summary>
internal static class MockBibleApi
{
    private const string DefaultPassword = "test1234";

    private const string History = """
        [
          { "semester": "20261", "testItem": "0", "applicationDate": "2026-03-31 오전 9:08:37", "passingDate": "2026-04-11 오전 12:00:00", "passFail": "1", "score": "68", "examDate": "2026-04-11", "attendance": "응시", "remark": "" },
          { "semester": "20252", "testItem": "1", "applicationDate": "2025-10-30 오전 12:20:09", "passingDate": "2025-11-15 오전 12:00:00", "passFail": "1", "score": "63", "examDate": "2025-11-15", "attendance": "응시", "remark": "" },
          { "semester": "20251", "testItem": "1", "applicationDate": "2025-05-07 오후 10:24:04", "passingDate": "2025-05-31 오전 12:00:00", "passFail": "0", "score": "42", "examDate": "2025-05-31", "attendance": "응시", "remark": "" },
          { "semester": "20231", "testItem": "2", "applicationDate": "2023-03-17 오전 12:00:00", "passingDate": "2023-03-14 오전 12:00:00", "passFail": "1", "score": "0", "examDate": "2023-03-14", "attendance": "응시", "remark": "LPIC" }
        ]
        """;

    private static readonly Dictionary<string, string> Students = new()
    {
        ["202200001"] = History,
        ["202300002"] = "[]",
        ["user123"] = History,
    };

    private static readonly Dictionary<string, string> Passwords = new() { ["user123"] = "user123" };

    public static JsonDocument Handle(Dictionary<string, string> body)
    {
        body.TryGetValue("subject", out var subject);

        if (subject == "user")
        {
            body.TryGetValue("keyA", out var id);
            body.TryGetValue("keyB", out var password);
            var expected = id is not null && Passwords.TryGetValue(id, out var p) ? p : DefaultPassword;
            var ok = id is not null && Students.ContainsKey(id) && password == expected;
            var record = ok
                ? new { userNum = id, userStatus = "10" }
                : new { userNum = (string?)"000000000", userStatus = "00" };
            return JsonSerializer.SerializeToDocument(new { description = "requestUserInfo", data = new[] { record } });
        }

        if (subject == "gradExam")
        {
            body.TryGetValue("studentNum", out var studentNum);
            var records = studentNum is not null && Students.TryGetValue(studentNum, out var json) ? json : "[]";
            return JsonDocument.Parse($$"""{ "description": "graduationExamInfo", "data": {{records}} }""");
        }

        return JsonDocument.Parse("""{ "data": [] }""");
    }
}
