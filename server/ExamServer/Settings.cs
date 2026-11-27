namespace ExamServer;

/// <summary>학교 학사 API(joshua) 연결 설정 — appsettings.json의 "BibleApi" 항목</summary>
public sealed class BibleApiSettings
{
    public string Url { get; set; } = "https://joshua.bible.ac.kr/api/Space";

    /// <summary>X-BIBLE-APIGW-API-KEY 값. 비밀값이라 appsettings.json에 적지 말고 환경 변수(BibleApi__Key)로 넣는다.</summary>
    public string? Key { get; set; }

    /// <summary>true면 학교 API 대신 가짜 응답을 쓴다. 개발(Development) 환경에서만 동작한다.</summary>
    public bool Mock { get; set; }
}

/// <summary>로그인 쿠키 서명용 비밀키 — "Session" 항목</summary>
public sealed class SessionSettings
{
    public string? Secret { get; set; }
}

/// <summary>관리자 계정 — "Admin" 항목. 비어 있으면 아무도 관리자로 로그인할 수 없다.</summary>
public sealed class AdminSettings
{
    public string? Id { get; set; }
    public string? Password { get; set; }
}

/// <summary>통계 — "Stats" 항목</summary>
public sealed class StatsSettings
{
    /// <summary>학번을 학우ID로 바꾸는 비밀키. 비우면 Session:Secret을 쓴다. 한 번 정하면 바꾸지 말 것.</summary>
    public string? IdSecret { get; set; }
}

/// <summary>풀이 기록 보관 기간 — "Retention" 항목</summary>
public sealed class RetentionSettings
{
    /// <summary>이 일수보다 오래된 풀이 기록은 자동으로 삭제된다. 기본 730일(2년).</summary>
    public int Days { get; set; } = 730;
}
