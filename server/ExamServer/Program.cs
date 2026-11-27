using System.Threading.RateLimiting;
using ExamServer;
using ExamServer.Data;
using ExamServer.Endpoints;
using ExamServer.Services;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

/* ---------------- 설정 ---------------- */
builder.Services.Configure<BibleApiSettings>(config.GetSection("BibleApi"));
builder.Services.Configure<SessionSettings>(config.GetSection("Session"));
builder.Services.Configure<AdminSettings>(config.GetSection("Admin"));
builder.Services.Configure<StatsSettings>(config.GetSection("Stats"));
builder.Services.Configure<RetentionSettings>(config.GetSection("Retention"));

/* ---------------- 서비스 ---------------- */
builder.Services.AddDbContext<AppDbContext>(options => DatabaseSetup.Configure(options, config));
builder.Services.AddSingleton<SessionService>();
builder.Services.AddSingleton<LoginThrottle>();
builder.Services.AddScoped<StatsService>();
builder.Services.AddHttpClient<BibleApiClient>(client => client.Timeout = TimeSpan.FromSeconds(15));
builder.Services.AddHostedService<RetentionService>();

// 풀이 기록 저장 요청은 로그인 세션(없으면 IP)마다 1분에 30번까지만 받는다.
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy(StatsEndpoints.RecordRateLimit, context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Request.Cookies[SessionService.StudentCookie]
                ?? context.Connection.RemoteIpAddress?.ToString()
                ?? "unknown",
            _ => new FixedWindowRateLimiterOptions { PermitLimit = 30, Window = TimeSpan.FromMinutes(1) }));
    options.OnRejected = async (rejected, ct) =>
        await rejected.HttpContext.Response.WriteAsJsonAsync(
            new { ok = false, error = "요청이 너무 많습니다. 잠시 후 다시 시도하세요." }, ct);
});

var app = builder.Build();

CheckRequiredSettings(app);

// 표가 없으면 만든다. (구조를 바꾸는 2단계부터는 EF Core 마이그레이션으로 바꿀 예정)
using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreated();
}

// wwwroot에 React 빌드 결과(npm run build:server)가 있으면 같은 서버에서 화면도 함께 제공한다.
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseRateLimiter();

app.MapAuthEndpoints();
app.MapStatsEndpoints();
app.MapSettingsEndpoints();

// 없는 API 주소는 화면(index.html) 대신 JSON 404로 답한다.
app.Map("/api/{**path}", () =>
    Results.Json(new { ok = false, error = "없는 API 주소입니다." }, statusCode: StatusCodes.Status404NotFound));
app.MapFallbackToFile("index.html");

app.Run();

/// <summary>운영 환경에서 꼭 필요한 설정이 빠졌으면 서버를 켜지 않고 이유를 알려준다.</summary>
static void CheckRequiredSettings(WebApplication app)
{
    var config = app.Configuration;
    if (app.Environment.IsDevelopment()) return;

    var problems = new List<string>();
    if ((config["Session:Secret"] ?? "").Length < 32)
        problems.Add("Session:Secret (32자 이상의 무작위 문자열)");
    if (string.IsNullOrEmpty(config["BibleApi:Key"]))
        problems.Add("BibleApi:Key (학교 API 키)");
    if (string.Equals(config["Database:Provider"] ?? "Sqlite", "Sqlite", StringComparison.OrdinalIgnoreCase))
        app.Logger.LogWarning("운영 환경에서 SQLite를 쓰고 있습니다. 학교 DB(SqlServer 또는 PostgreSQL) 사용을 권장합니다.");
    if (config.GetValue<bool>("BibleApi:Mock"))
        app.Logger.LogWarning("BibleApi:Mock은 개발 환경에서만 동작하므로 운영에서는 무시됩니다.");

    if (problems.Count > 0)
        throw new InvalidOperationException("다음 설정이 필요합니다: " + string.Join(", ", problems));
}
