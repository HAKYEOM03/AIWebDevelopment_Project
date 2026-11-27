using Microsoft.EntityFrameworkCore;

namespace ExamServer.Data;

/// <summary>
/// 풀이 기록 한 줄 = "한 번의 풀이(시도)에서 한 파트·세트" 묶음.
/// 기존 구글 시트의 한 행과 같은 모양이라, 시트 데이터를 그대로 옮겨 올 수도 있다.
/// 학번은 저장하지 않고 학번을 일방향 암호화한 학우ID(StudentKey)만 남긴다.
/// </summary>
public sealed class PracticeRecord
{
    public long Id { get; set; }

    /// <summary>기록 시각 (UTC)</summary>
    public DateTime RecordedAt { get; set; }

    /// <summary>한국 시간 기준 연도 — 연도별 통계 조회용</summary>
    public int Year { get; set; }

    public string ExamId { get; set; } = "";
    public int Part { get; set; }
    public int SetNo { get; set; }

    /// <summary>SET(세트 연습) / TEST(랜덤 테스트) / EXAM(전체)</summary>
    public string Mode { get; set; } = "";

    public string StudentKey { get; set; } = "";
    public string AttemptId { get; set; } = "";
    public int AskedCount { get; set; }
    public int WrongCount { get; set; }

    /// <summary>푼 문제 번호 목록 "1,2,3"</summary>
    public string AskedList { get; set; } = "";

    /// <summary>틀린 문제 번호 목록 "2"</summary>
    public string WrongList { get; set; } = "";
}

/// <summary>관리자 설정 (시험 잠금, D-DAY 잠금, 시험 날짜, 소개 내용) — 키 하나에 JSON 하나</summary>
public sealed class SiteSetting
{
    public string Key { get; set; } = "";
    public string ValueJson { get; set; } = "";
    public DateTime UpdatedAt { get; set; }
}

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<PracticeRecord> PracticeRecords => Set<PracticeRecord>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PracticeRecord>(e =>
        {
            e.ToTable("practice_records");
            e.HasKey(x => x.Id);
            e.Property(x => x.ExamId).HasMaxLength(20);
            e.Property(x => x.Mode).HasMaxLength(8);
            e.Property(x => x.StudentKey).HasMaxLength(16);
            e.Property(x => x.AttemptId).HasMaxLength(16);
            e.HasIndex(x => new { x.Year, x.ExamId });
            e.HasIndex(x => new { x.StudentKey, x.Year });
            e.HasIndex(x => x.RecordedAt);
        });

        modelBuilder.Entity<SiteSetting>(e =>
        {
            e.ToTable("site_settings");
            e.HasKey(x => x.Key);
            e.Property(x => x.Key).HasMaxLength(40);
        });
    }
}

public static class DatabaseSetup
{
    /// <summary>appsettings의 Database:Provider와 ConnectionStrings:Default로 DB를 고른다.</summary>
    public static void Configure(DbContextOptionsBuilder options, IConfiguration config)
    {
        var provider = (config["Database:Provider"] ?? "Sqlite").Trim();
        var connection = config.GetConnectionString("Default");

        switch (provider.ToLowerInvariant())
        {
            case "sqlite":
                options.UseSqlite(string.IsNullOrWhiteSpace(connection) ? "Data Source=exam.db" : connection);
                break;
            case "sqlserver":
                options.UseSqlServer(Require(connection, provider));
                break;
            case "postgresql":
            case "postgres":
                options.UseNpgsql(Require(connection, provider));
                break;
            default:
                throw new InvalidOperationException(
                    $"Database:Provider 값 '{provider}'는 지원하지 않습니다. Sqlite, SqlServer, PostgreSQL 중 하나를 쓰세요.");
        }
    }

    private static string Require(string? connection, string provider) =>
        string.IsNullOrWhiteSpace(connection)
            ? throw new InvalidOperationException($"{provider}를 쓰려면 ConnectionStrings:Default를 설정해야 합니다.")
            : connection;
}
