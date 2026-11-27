using System.Collections.Concurrent;

namespace ExamServer.Services;

/// <summary>
/// 계정별 로그인 실패 횟수 제한 — 비밀번호를 계속 바꿔 넣어 보는 공격을 늦춘다.
/// IP 단위로 막지 않는 이유: 학교 강의실 학생들은 같은 IP로 나가서, 한 반 전체가 같이 막힐 수 있다.
/// 서버를 다시 시작하면 기록이 초기화된다(메모리에만 보관).
/// </summary>
public sealed class LoginThrottle
{
    private const int MaxFailures = 10;
    private const int MaxTrackedKeys = 10_000;
    private static readonly TimeSpan Window = TimeSpan.FromMinutes(15);

    private readonly ConcurrentDictionary<string, (int Count, DateTime Since)> _failures = new();

    public bool IsBlocked(string key) =>
        _failures.TryGetValue(key, out var entry) &&
        entry.Count >= MaxFailures &&
        DateTime.UtcNow - entry.Since < Window;

    public void RecordFailure(string key)
    {
        if (_failures.Count > MaxTrackedKeys) PruneExpired();

        var now = DateTime.UtcNow;
        _failures.AddOrUpdate(
            key,
            _ => (1, now),
            (_, entry) => now - entry.Since >= Window ? (1, now) : (entry.Count + 1, entry.Since));
    }

    public void Reset(string key) => _failures.TryRemove(key, out _);

    private void PruneExpired()
    {
        var now = DateTime.UtcNow;
        foreach (var (key, entry) in _failures)
        {
            if (now - entry.Since >= Window) _failures.TryRemove(key, out _);
        }
    }
}
