import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Circle,
  Crown,
  Eye,
  Heart,
  Link2,
  UserRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OverviewPanelProps = {
  user: any;
  profile: any;
  viewAnalytics: {
    days: { date: string; count: number }[];
    devices: { category: "desktop" | "mobile" | "tablet" | "unknown"; count: number }[];
  };
  userLikes: { likes: number } | undefined;
  userLinks: any[] | undefined;
  onOpenTab: (tab: string) => void;
};

function formatDay(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

export default function OverviewPanel({
  user,
  profile,
  viewAnalytics = { days: [], devices: [] },
  userLikes,
  userLinks = [],
  onOpenTab,
}: OverviewPanelProps) {
  const viewsHistory = viewAnalytics.days;
  const deviceLabels = {
    desktop: "Desktop",
    mobile: "Mobile",
    tablet: "Tablet",
    unknown: "Unknown",
  } as const;
  const deviceBreakdown = viewAnalytics.devices.map(({ category, count }) => ({
    category: deviceLabels[category],
    count: Number(count),
  }));
  const hasDeviceData = deviceBreakdown.some(({ count }) => count > 0);
  const activeLinks = userLinks.filter((link) => link.enabled);
  const completedProfileItems = [
    Boolean(profile?.avatarUrl),
    Boolean(profile?.bio?.trim()),
    Boolean(profile?.bannerUrl),
    activeLinks.length > 0,
  ].filter(Boolean).length;
  const completionPercent = Math.round((completedProfileItems / 4) * 100);
  const nextTab = !profile?.avatarUrl || !profile?.bio?.trim() || !profile?.bannerUrl
    ? "profile"
    : "links";

  const stats = [
    { label: "User ID", value: user.id ? `#${user.id}` : "—", icon: UserRound },
    { label: "Total views", value: (user.views ?? 0).toLocaleString(), icon: Eye },
    { label: "Username", value: user.username, icon: Activity },
    { label: "Plan", value: user.isPremium ? "Premium" : "Free", icon: Crown },
  ];

  return (
    <div className="space-y-5">
      <header className="pt-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400">Hexed / Overview</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Welcome back, {profile?.displayName || user.username}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Here’s an overview of your profile.</p>
      </header>

      <section aria-label="Account statistics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="dashboard-panel flex min-w-0 items-center gap-3 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/[0.08] text-orange-400">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-500">{label}</p>
              <p className="mt-1 truncate text-sm font-medium text-zinc-100">{value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-panel p-4 sm:p-5" aria-label="Profile completion">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="rounded-full border border-orange-500/20 bg-orange-500/[0.08] px-2.5 py-1 text-[10px] font-semibold text-orange-300">
              {completedProfileItems}/4
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-100">Profile completion</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {completionPercent === 100
                  ? "Your profile is ready to share."
                  : `${4 - completedProfileItems} step${completedProfileItems === 3 ? "" : "s"} left to complete your profile`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenTab(nextTab)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-orange-500/30 hover:text-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
          >
            {completionPercent === 100 ? "Edit profile" : "Continue setup"}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
          role="progressbar"
          aria-label="Profile completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completionPercent}
        >
          <div
            className="h-full rounded-full bg-orange-500 transition-[width] duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
          {[
            { label: "Avatar", complete: Boolean(profile?.avatarUrl) },
            { label: "Bio", complete: Boolean(profile?.bio?.trim()) },
            { label: "Banner", complete: Boolean(profile?.bannerUrl) },
            { label: "First link", complete: activeLinks.length > 0 },
          ].map(({ label, complete }) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              {complete
                ? <Check className="h-3.5 w-3.5 text-orange-400" />
                : <Circle className="h-3.5 w-3.5 text-zinc-600" />}
              <span className={complete ? "text-zinc-300" : "text-zinc-500"}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.9fr)]">
        <div className="dashboard-panel min-w-0 p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-zinc-100">Profile views</h2>
                <span className="rounded-full bg-orange-500/[0.09] px-2 py-0.5 text-[10px] font-medium text-orange-300">
                  {viewsHistory.reduce((total, day) => total + Number(day.count || 0), 0)} in 30 days
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">Daily visits to your Hexed page</p>
            </div>
            <span className="rounded-lg border border-white/[0.07] px-2.5 py-1 text-[10px] text-zinc-400">30 days</span>
          </div>
          {viewsHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={viewsHistory} margin={{ top: 10, right: 5, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="hexed-views-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDay}
                  tick={{ fontSize: 10, fill: "#71717a" }}
                  axisLine={false}
                  tickLine={false}
                  interval={Math.max(0, Math.floor((viewsHistory.length - 1) / 6))}
                />
                <YAxis
                  allowDecimals={false}
                  width={30}
                  tick={{ fontSize: 10, fill: "#71717a" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#111111",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    color: "#f4f4f5",
                    fontSize: 12,
                  }}
                  labelFormatter={(label) => new Date(`${label}T00:00:00`).toLocaleDateString()}
                  formatter={(value) => [Number(value).toLocaleString(), "Views"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#hexed-views-fill)"
                  activeDot={{ r: 4, fill: "#f97316", stroke: "#18181b", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-center">
              <Eye className="h-5 w-5 text-zinc-600" />
              <p className="text-sm text-zinc-400">Your view history will appear here.</p>
              <p className="text-xs text-zinc-600">Share your profile to start building an audience.</p>
            </div>
          )}
        </div>

        <div className="dashboard-panel flex flex-col p-4 sm:p-5">
          <div>
            <h2 className="text-sm font-medium text-zinc-100">Viewer devices</h2>
            <p className="mt-1 text-xs text-zinc-500">Profile visits by device · last 30 days</p>
          </div>
          {hasDeviceData ? (
            <div
              className="mt-3"
              role="img"
              aria-label="Profile visits by desktop, mobile, tablet, and unknown device"
            >
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={deviceBreakdown}
                  layout="vertical"
                  margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis
                    type="category"
                    dataKey="category"
                    width={66}
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#111111",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10,
                      color: "#f4f4f5",
                      fontSize: 12,
                    }}
                    formatter={(value) => [Number(value).toLocaleString(), "Visits"]}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[160px] items-center justify-center text-center">
              <p className="max-w-[220px] text-xs leading-5 text-zinc-500">
                Device breakdown will appear after your profile receives visits.
              </p>
            </div>
          )}
          <div className="mt-4 border-t border-white/[0.05] pt-4">
            <h3 className="text-sm font-medium text-zinc-100">Profile snapshot</h3>
            <p className="mt-1 text-xs text-zinc-500">Your page at a glance</p>
          </div>
          <div className="mt-5 divide-y divide-white/[0.05]">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <span className="flex items-center gap-2 text-xs text-zinc-400"><Link2 className="h-3.5 w-3.5" /> Active links</span>
              <span className="text-sm font-medium text-zinc-200">{activeLinks.length}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="flex items-center gap-2 text-xs text-zinc-400"><Heart className="h-3.5 w-3.5" /> Likes</span>
              <span className="text-sm font-medium text-zinc-200">{(userLikes?.likes ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="flex items-center gap-2 text-xs text-zinc-400"><BadgeCheck className="h-3.5 w-3.5" /> Earned badges</span>
              <span className="text-sm font-medium text-zinc-200">{Array.isArray(user.badges) ? user.badges.length : 0}</span>
            </div>
          </div>
          <a
            href={`/${user.username}`}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/[0.06] px-3 py-2.5 text-xs font-medium text-orange-300 transition-colors hover:border-orange-500/40 hover:bg-orange-500/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
          >
            View public profile <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}
