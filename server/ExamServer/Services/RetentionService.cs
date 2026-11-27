using ExamServer.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ExamServer.Services;

/// <summary>
/// 보관 기간(Retention:Days, 기본 2년)이 지난 풀이 기록을 자동으로 지운다.
/// 서버가 켜질 때 한 번, 그 뒤로 24시간마다 실행된다.
/// 관리자 통계도 남아 있는 기록으로 계산하므로 자동으로 최근 2년치만 반영된다.
/// </summary>
public sealed class RetentionService(
    IServiceScopeFactory scopes,
    IOptions<RetentionSettings> settings,
    ILogger<RetentionService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await PurgeSafelyAsync(stoppingToken);

        using var timer = new PeriodicTimer(TimeSpan.FromHours(24));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await PurgeSafelyAsync(stoppingToken);
        }
    }

    /// <summary>오래된 기록을 지우고 지운 줄 수를 돌려준다.</summary>
    public static async Task<int> PurgeAsync(AppDbContext db, int days, CancellationToken ct)
    {
        var cutoff = DateTime.UtcNow.AddDays(-Math.Max(1, days));
        return await db.PracticeRecords.Where(r => r.RecordedAt < cutoff).ExecuteDeleteAsync(ct);
    }

    private async Task PurgeSafelyAsync(CancellationToken ct)
    {
        try
        {
            using var scope = scopes.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var deleted = await PurgeAsync(db, settings.Value.Days, ct);
            logger.LogInformation("보관 기간({Days}일)이 지난 풀이 기록 {Count}줄을 삭제했습니다.", settings.Value.Days, deleted);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            // 서버 종료 중
        }
        catch (Exception ex)
        {
            // 삭제가 실패해도 서버는 계속 돈다. 다음 실행 때 다시 시도한다.
            logger.LogError(ex, "오래된 풀이 기록 삭제에 실패했습니다.");
        }
    }
}
