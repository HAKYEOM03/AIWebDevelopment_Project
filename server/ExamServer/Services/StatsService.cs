using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using ExamServer.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ExamServer.Services;

/* ---------- 응답 모양 (기존 api/stats.js, api/my-stats.js와 같은 필드 이름) ---------- */

public sealed record SetStatDto(int Part, int Set, int Students, int Attempts, double AvgAttempts, int Answers, int Wrong, double Rate);

public sealed record QuestionStatDto(
    int Part, int Set, int Qid, int Students, int WrongStudents, double StudentRate, int Answers, int Wrong, double Rate);

public sealed record AdminStatsResponse(
    bool Ok, string Year, string[] Years, bool Mock,
    int Participants, int TotalAttempts, int TotalAnswers, int TotalWrong, double TotalRate,
    IReadOnlyList<SetStatDto> BySet, IReadOnlyList<QuestionStatDto> Questions);

public sealed record MySetStatDto(int Part, int Set, int Attempts, int Answers, int Wrong, double Rate);

public sealed record MyQuestionStatDto(int Part, int Set, int Qid, int Answers, int Wrong, double Rate);

public sealed record MyStatsResponse(
    bool Ok, string Year, string[] Years, bool Mock,
    int TotalAttempts, int TotalAnswers, int TotalWrong, double TotalRate,
    IReadOnlyList<MySetStatDto> BySet, IReadOnlyList<MyQuestionStatDto> Questions);

/// <summary>
/// 연습문제 풀이 기록 저장 + 통계 계산. (기존 api/_lib/statsStore.js를 그대로 옮긴 것, 저장소만 구글 시트 → DB)
/// 학번·이름은 저장하지 않는다. "학우ID"는 학번을 서버 비밀키로 일방향 암호화한 값이라
/// DB만 봐서는 누구인지 알 수 없고, 같은 학우의 기록끼리만 묶을 수 있다.
/// </summary>
public sealed class StatsService(AppDbContext db, IOptions<StatsSettings> stats, IOptions<SessionSettings> session)
{
    public const string DefaultExam = "english";

    private static readonly string[] Modes = ["SET", "TEST", "EXAM"];
    private const int MaxResultsPerRequest = 300;

    /// <summary>지금 통계를 받는 시험 — 성경·컴퓨터는 문제 확정 전이라 받지 않는다.</summary>
    private static readonly Dictionary<string, (int[] Parts, int[] Sets)> RecordableExams = new()
    {
        ["english"] = ([1, 2, 3, 4, 5, 6, 7], [1, 2, 3]),
    };

    /* ---------------- 학우ID ---------------- */

    /// <summary>학번 → 같은 학번이면 항상 같고 되돌릴 수 없는 16자리 값 (기존 JS와 같은 계산이라 기존 기록과 이어진다)</summary>
    public string StudentKey(string studentNum)
    {
        var secret = !string.IsNullOrEmpty(stats.Value.IdSecret) ? stats.Value.IdSecret : session.Value.Secret;
        if (string.IsNullOrEmpty(secret))
            throw new InvalidOperationException("Stats:IdSecret 또는 Session:Secret 설정이 필요합니다.");

        var hash = HMACSHA256.HashData(Encoding.UTF8.GetBytes(secret), Encoding.UTF8.GetBytes($"stats-student:{studentNum}"));
        return Convert.ToHexStringLower(hash)[..16];
    }

    /* ---------------- 기록 저장 ---------------- */

    /// <summary>
    /// 브라우저가 보낸 "문제별 결과" 목록을 검사해서 파트·세트별로 한 줄씩 묶어 저장한다.
    /// 서버는 브라우저를 믿지 않고, 허용된 시험·파트·세트·모드와 숫자 범위만 받는다.
    /// 성공하면 null, 입력이 잘못됐으면 오류 문장을 돌려준다.
    /// </summary>
    public async Task<(string? Error, int Count)> RecordAsync(JsonElement results, string studentNum, CancellationToken ct)
    {
        if (results.ValueKind != JsonValueKind.Array || results.GetArrayLength() is 0 or > MaxResultsPerRequest)
            return ("기록할 결과 개수가 올바르지 않습니다.", 0);

        var groups = new Dictionary<(string Exam, int Part, int Set), (SortedSet<int> Asked, SortedSet<int> Wrong)>();
        string? mode = null;

        foreach (var item in results.EnumerateArray())
        {
            if (item.ValueKind != JsonValueKind.Object ||
                !TryGetString(item, "examId", out var examId) ||
                !RecordableExams.TryGetValue(examId, out var exam) ||
                !TryGetInt(item, "part", out var part) || !exam.Parts.Contains(part) ||
                !TryGetInt(item, "set", out var set) || !exam.Sets.Contains(set) ||
                !TryGetInt(item, "qid", out var qid) || qid < 1 || qid > 2000 ||
                !item.TryGetProperty("correct", out var correct) ||
                correct.ValueKind is not (JsonValueKind.True or JsonValueKind.False) ||
                !TryGetString(item, "mode", out var itemMode) || !Modes.Contains(itemMode))
            {
                return ("올바르지 않은 결과 값이 들어있습니다.", 0);
            }

            mode ??= itemMode;
            if (itemMode != mode) return ("한 번의 풀이에는 하나의 모드만 담을 수 있습니다.", 0);

            var key = (examId, part, set);
            if (!groups.TryGetValue(key, out var group))
            {
                group = (new SortedSet<int>(), new SortedSet<int>());
                groups[key] = group;
            }
            group.Asked.Add(qid);
            // 같은 문제가 섞여 들어와도 한 번이라도 틀렸으면 오답
            if (correct.ValueKind == JsonValueKind.False) group.Wrong.Add(qid);
        }

        var now = DateTime.UtcNow;
        var year = Kst.YearOf(now);
        var studentKey = StudentKey(studentNum);
        var attemptId = Convert.ToHexStringLower(RandomNumberGenerator.GetBytes(5));

        foreach (var ((examId, part, set), (asked, wrong)) in groups)
        {
            db.PracticeRecords.Add(new PracticeRecord
            {
                RecordedAt = now,
                Year = year,
                ExamId = examId,
                Part = part,
                SetNo = set,
                Mode = mode!,
                StudentKey = studentKey,
                AttemptId = attemptId,
                AskedCount = asked.Count,
                WrongCount = wrong.Count,
                AskedList = string.Join(",", asked),
                WrongList = string.Join(",", wrong),
            });
        }

        await db.SaveChangesAsync(ct);
        return (null, groups.Count);
    }

    /* ---------------- 조회 ---------------- */

    /// <summary>"2026" 같은 4자리 연도면 그 값, 아니면 올해(한국 시간)</summary>
    public static int ResolveYear(string? requested) =>
        requested is { Length: 4 } && int.TryParse(requested, out var y) ? y : Kst.YearOf(DateTime.UtcNow);

    /// <summary>기록이 있는 연도 목록 (최신순). 올해는 아직 기록이 없어도 항상 포함한다.</summary>
    public async Task<string[]> ListYearsAsync(CancellationToken ct)
    {
        var years = await db.PracticeRecords.Select(r => r.Year).Distinct().ToListAsync(ct);
        years.Add(Kst.YearOf(DateTime.UtcNow));
        return years.Distinct().OrderDescending().Select(y => y.ToString()).ToArray();
    }

    /// <summary>[관리자용] 모든 학우의 기록을 파트·세트별, 문제별로 종합한다.</summary>
    public async Task<AdminStatsResponse> GetAdminStatsAsync(int year, CancellationToken ct)
    {
        var rows = await LoadRowsAsync(db.PracticeRecords.Where(r => r.Year == year && r.ExamId == DefaultExam), ct);
        var years = await ListYearsAsync(ct);

        var everyone = new HashSet<string>();
        var attempts = new HashSet<string>();
        var sets = new SortedDictionary<(int Part, int Set), AdminSetAcc>();
        var questions = new SortedDictionary<(int Part, int Set, int Qid), AdminQuestionAcc>();
        int totalAnswers = 0, totalWrong = 0;

        foreach (var row in rows)
        {
            everyone.Add(row.StudentKey);
            attempts.Add(row.AttemptId);
            totalAnswers += row.Asked.Count;
            totalWrong += row.Wrong.Count;

            var setStat = GetOrAdd(sets, (row.Part, row.Set));
            setStat.Answers += row.Asked.Count;
            setStat.Wrong += row.Wrong.Count;
            // 푼 인원·평균 푼 횟수는 "세트 연습"으로 푼 기록만 센다.
            if (row.Mode == "SET")
            {
                setStat.Students.Add(row.StudentKey);
                setStat.Attempts += 1;
            }

            foreach (var qid in row.Asked)
            {
                var q = GetOrAdd(questions, (row.Part, row.Set, qid));
                q.Students.Add(row.StudentKey);
                q.Answers += 1;
                if (row.Wrong.Contains(qid))
                {
                    q.Wrong += 1;
                    q.WrongStudents.Add(row.StudentKey);
                }
            }
        }

        return new AdminStatsResponse(
            Ok: true, Year: year.ToString(), Years: years, Mock: false,
            Participants: everyone.Count,
            TotalAttempts: attempts.Count,
            TotalAnswers: totalAnswers,
            TotalWrong: totalWrong,
            TotalRate: Ratio(totalWrong, totalAnswers),
            BySet: sets.Select(s => new SetStatDto(
                s.Key.Part, s.Key.Set, s.Value.Students.Count, s.Value.Attempts,
                Ratio(s.Value.Attempts, s.Value.Students.Count),
                s.Value.Answers, s.Value.Wrong, Ratio(s.Value.Wrong, s.Value.Answers))).ToList(),
            Questions: questions.Select(q => new QuestionStatDto(
                q.Key.Part, q.Key.Set, q.Key.Qid, q.Value.Students.Count, q.Value.WrongStudents.Count,
                Ratio(q.Value.WrongStudents.Count, q.Value.Students.Count),
                q.Value.Answers, q.Value.Wrong, Ratio(q.Value.Wrong, q.Value.Answers))).ToList());
    }

    /// <summary>[학생용] 로그인한 학우 본인의 기록만으로 개인 통계를 만든다. 다른 학우의 기록은 읽지도 않는다.</summary>
    public async Task<MyStatsResponse> GetMyStatsAsync(int year, string studentNum, CancellationToken ct)
    {
        var key = StudentKey(studentNum);
        var rows = await LoadRowsAsync(
            db.PracticeRecords.Where(r => r.StudentKey == key && r.Year == year && r.ExamId == DefaultExam), ct);
        var years = await ListYearsAsync(ct);

        var attempts = new HashSet<string>();
        var sets = new SortedDictionary<(int Part, int Set), MyAcc>();
        var questions = new SortedDictionary<(int Part, int Set, int Qid), MyAcc>();
        int totalAnswers = 0, totalWrong = 0;

        foreach (var row in rows)
        {
            attempts.Add(row.AttemptId);
            totalAnswers += row.Asked.Count;
            totalWrong += row.Wrong.Count;

            var setStat = GetOrAdd(sets, (row.Part, row.Set));
            setStat.Answers += row.Asked.Count;
            setStat.Wrong += row.Wrong.Count;
            if (row.Mode == "SET") setStat.Attempts += 1;

            foreach (var qid in row.Asked)
            {
                var q = GetOrAdd(questions, (row.Part, row.Set, qid));
                q.Answers += 1;
                if (row.Wrong.Contains(qid)) q.Wrong += 1;
            }
        }

        return new MyStatsResponse(
            Ok: true, Year: year.ToString(), Years: years, Mock: false,
            TotalAttempts: attempts.Count,
            TotalAnswers: totalAnswers,
            TotalWrong: totalWrong,
            TotalRate: Ratio(totalWrong, totalAnswers),
            BySet: sets.Select(s => new MySetStatDto(
                s.Key.Part, s.Key.Set, s.Value.Attempts, s.Value.Answers, s.Value.Wrong,
                Ratio(s.Value.Wrong, s.Value.Answers))).ToList(),
            Questions: questions.Select(q => new MyQuestionStatDto(
                q.Key.Part, q.Key.Set, q.Key.Qid, q.Value.Answers, q.Value.Wrong,
                Ratio(q.Value.Wrong, q.Value.Answers))).ToList());
    }

    /* ---------------- 내부 도우미 ---------------- */

    private sealed record Row(string StudentKey, string AttemptId, int Part, int Set, string Mode, List<int> Asked, HashSet<int> Wrong);

    private sealed class AdminSetAcc
    {
        public HashSet<string> Students { get; } = [];
        public int Attempts { get; set; }
        public int Answers { get; set; }
        public int Wrong { get; set; }
    }

    private sealed class AdminQuestionAcc
    {
        public HashSet<string> Students { get; } = [];
        public HashSet<string> WrongStudents { get; } = [];
        public int Answers { get; set; }
        public int Wrong { get; set; }
    }

    private sealed class MyAcc
    {
        public int Attempts { get; set; }
        public int Answers { get; set; }
        public int Wrong { get; set; }
    }

    private static TValue GetOrAdd<TKey, TValue>(SortedDictionary<TKey, TValue> map, TKey key)
        where TKey : notnull
        where TValue : new()
    {
        if (!map.TryGetValue(key, out var value))
        {
            value = new TValue();
            map[key] = value;
        }
        return value;
    }

    /// <summary>필요한 열만 읽고, 형식이 이상한 줄(푼 문제가 없는 줄)은 건너뛴다.</summary>
    private static async Task<List<Row>> LoadRowsAsync(IQueryable<PracticeRecord> query, CancellationToken ct)
    {
        var raw = await query
            .AsNoTracking()
            .Select(r => new { r.StudentKey, r.AttemptId, r.Part, r.SetNo, r.Mode, r.AskedList, r.WrongList })
            .ToListAsync(ct);

        var rows = new List<Row>(raw.Count);
        foreach (var r in raw)
        {
            var asked = ParseList(r.AskedList);
            if (asked.Count == 0) continue;
            var askedSet = asked.ToHashSet();
            var wrong = ParseList(r.WrongList).Where(askedSet.Contains).ToHashSet();
            rows.Add(new Row(r.StudentKey, r.AttemptId, r.Part, r.SetNo, r.Mode, asked, wrong));
        }
        return rows;
    }

    private static List<int> ParseList(string? value) =>
        (value ?? "")
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(s => int.TryParse(s, out var n) ? n : 0)
            .Where(n => n > 0)
            .ToList();

    private static double Ratio(int part, int whole) => whole == 0 ? 0 : (double)part / whole;

    private static bool TryGetString(JsonElement obj, string name, out string value)
    {
        if (obj.TryGetProperty(name, out var element) && element.ValueKind == JsonValueKind.String)
        {
            value = element.GetString()!;
            return true;
        }
        value = "";
        return false;
    }

    /// <summary>숫자 1 또는 문자열 "1" 모두 받는다 (기존 JS의 Number(...)와 같게).</summary>
    private static bool TryGetInt(JsonElement obj, string name, out int value)
    {
        value = 0;
        if (!obj.TryGetProperty(name, out var element)) return false;
        return element.ValueKind switch
        {
            JsonValueKind.Number => element.TryGetInt32(out value),
            JsonValueKind.String => int.TryParse(element.GetString(), out value),
            _ => false,
        };
    }
}

/// <summary>한국 시간(UTC+9, 서머타임 없음) 도우미</summary>
public static class Kst
{
    public static int YearOf(DateTime utc) => utc.AddHours(9).Year;
}
