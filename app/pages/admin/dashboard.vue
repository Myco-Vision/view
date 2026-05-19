<template>
  <div class="dashboard">
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-sub">Welcome back, Admin. Here's what's happening today.</p>
      </div>
      <div class="header-actions">
        <span class="date-badge">{{ todayDate }}</span>
        <NuxtLink to="/admin/reports" class="btn-primary">View Reports →</NuxtLink>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div v-for="stat in stats" :key="stat.label" class="kpi-card">
        <div class="kpi-icon" :style="{ background: stat.iconBg }">
          <span v-html="stat.icon" />
        </div>
        <div class="kpi-body">
          <p class="kpi-value">{{ stat.value }}</p>
          <p class="kpi-label">{{ stat.label }}</p>
        </div>
        <span class="kpi-badge badge--up">▲ {{ stat.change }}</span>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="mid-row">
      <div class="chart-card">
        <div class="card-header">
          <p class="card-title">Scan Volume — Last 7 Days</p>
          <span class="card-tag">Live</span>
        </div>
        <svg viewBox="0 0 420 120" class="sparkline" preserveAspectRatio="none">
          <defs>
            <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <line v-for="y in [20,50,80,110]" :key="y" :x1="0" :y1="y" :x2="420" :y2="y" stroke="#e2e8f0" stroke-width="1"/>
          <path :d="scanAreaPath" fill="url(#scanGrad)"/>
          <polyline :points="scanPoints" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle v-for="(p,i) in scanDots" :key="i" :cx="p.x" :cy="p.y" r="4" fill="#10b981" stroke="#fff" stroke-width="2"/>
        </svg>
        <div class="chart-labels">
          <span v-for="d in chartDays" :key="d" class="chart-day">{{ d }}</span>
        </div>
      </div>

      <div class="chart-card chart-card--small">
        <div class="card-header"><p class="card-title">Classification Split</p></div>
        <div class="donut-wrap">
          <svg viewBox="0 0 120 120" class="donut-svg">
            <circle cx="60" cy="60" r="44" fill="none" stroke="#f1f5f9" stroke-width="18"/>
            <circle cx="60" cy="60" r="44" fill="none" stroke="#10b981" stroke-width="18"
                    :stroke-dasharray="`${edibleDash} ${circumference}`" stroke-dashoffset="0"
                    transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="44" fill="none" stroke="#ef4444" stroke-width="18"
                    :stroke-dasharray="`${poisonDash} ${circumference}`" :stroke-dashoffset="`-${edibleDash}`"
                    transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="44" fill="none" stroke="#f59e0b" stroke-width="18"
                    :stroke-dasharray="`${unknownDash} ${circumference}`" :stroke-dashoffset="`-${edibleDash + poisonDash}`"
                    transform="rotate(-90 60 60)"/>
            <text x="60" y="56" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">186</text>
            <text x="60" y="70" text-anchor="middle" font-size="8" fill="#64748b">Species</text>
          </svg>
          <div class="donut-legend">
            <div class="legend-item"><span class="legend-dot" style="background:#10b981"></span>Edible (58%)</div>
            <div class="legend-item"><span class="legend-dot" style="background:#ef4444"></span>Poisonous (28%)</div>
            <div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>Unknown (14%)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="bottom-row">
      <div class="activity-card">
        <div class="card-header">
          <p class="card-title">Recent Scans</p>
          <NuxtLink to="/admin/scans" class="card-link">View all →</NuxtLink>
        </div>
        <table class="activity-table">
          <thead>
            <tr><th>User</th><th>Species</th><th>Classification</th><th>Confidence</th><th>Time</th></tr>
          </thead>
          <tbody>
            <tr v-for="scan in recentScans" :key="scan.id">
              <td class="td-user">
                <div class="mini-avatar">{{ scan.userInitials }}</div>{{ scan.user }}
              </td>
              <td class="td-species">{{ scan.species }}</td>
              <td><span class="class-chip" :class="`class-chip--${scan.cls}`">{{ scan.cls }}</span></td>
              <td>
                <div class="conf-bar-wrap">
                  <div class="conf-bar" :style="{ width: scan.confidence + '%', background: confColor(scan.confidence) }"/>
                  <span class="conf-label">{{ scan.confidence }}%</span>
                </div>
              </td>
              <td class="td-time">{{ scan.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="quick-actions-card">
        <p class="card-title" style="margin-bottom:14px;">Quick Actions</p>
        <div class="qa-list">
          <NuxtLink to="/admin/species" class="qa-btn"><span class="qa-icon" style="background:#d1fae5;color:#059669">🌿</span><span>Add New Species</span></NuxtLink>
          <NuxtLink to="/admin/users"   class="qa-btn"><span class="qa-icon" style="background:#dbeafe;color:#2563eb">👥</span><span>Manage Users</span></NuxtLink>
          <NuxtLink to="/admin/reports" class="qa-btn"><span class="qa-icon" style="background:#fef3c7;color:#d97706">📊</span><span>Export Reports</span></NuxtLink>
          <NuxtLink to="/admin/settings" class="qa-btn"><span class="qa-icon" style="background:#f3e8ff;color:#7c3aed">⚙️</span><span>System Settings</span></NuxtLink>
        </div>
        <p class="card-title" style="margin:18px 0 12px;">System Health</p>
        <div class="health-list">
          <div v-for="h in healthItems" :key="h.label" class="health-row">
            <span class="health-label">{{ h.label }}</span>
            <div class="health-bar-wrap"><div class="health-bar" :style="{ width: h.val + '%', background: h.color }"/></div>
            <span class="health-pct">{{ h.val }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const stats = [
  { label: 'Total Users',     value: '1,248', change: '12% this month', iconBg: '#dbeafe', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { label: 'Scans Today',     value: '342',   change: '8% vs yesterday', iconBg: '#d1fae5', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="1.8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' },
  { label: 'Avg. Confidence', value: '91.4%', change: '2.1% this week',  iconBg: '#fef3c7', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
  { label: 'Species in DB',   value: '186',   change: '3 added this week', iconBg: '#f3e8ff', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>' },
]

const chartDays  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const scanValues = [48, 72, 55, 91, 63, 110, 88]
const maxV = Math.max(...scanValues)
const W = 420; const H = 120; const pad = 14
const scanDots = scanValues.map((v, i) => ({
  x: pad + (i / (scanValues.length - 1)) * (W - pad * 2),
  y: H - pad - (v / maxV) * (H - pad * 2),
}))
const scanPoints  = scanDots.map(p => `${p.x},${p.y}`).join(' ')
const scanAreaPath = `M${scanDots[0].x},${scanDots[0].y} ` +
  scanDots.slice(1).map(p => `L${p.x},${p.y}`).join(' ') +
  ` L${scanDots[scanDots.length-1].x},${H} L${scanDots[0].x},${H} Z`

const circumference = 2 * Math.PI * 44
const edibleDash  = (58 / 100) * circumference
const poisonDash  = (28 / 100) * circumference
const unknownDash = (14 / 100) * circumference

const recentScans = [
  { id: 1, user: 'Maria S.',  userInitials: 'MS', species: 'Volvariella volvacea', cls: 'edible',    confidence: 94, time: '2 min ago' },
  { id: 2, user: 'Juan D.',   userInitials: 'JD', species: 'Amanita phalloides',   cls: 'poisonous', confidence: 88, time: '7 min ago' },
  { id: 3, user: 'Ana R.',    userInitials: 'AR', species: 'Pleurotus ostreatus',  cls: 'edible',    confidence: 97, time: '15 min ago' },
  { id: 4, user: 'Carlo M.',  userInitials: 'CM', species: 'Unknown species',      cls: 'unknown',   confidence: 42, time: '21 min ago' },
  { id: 5, user: 'Lisa T.',   userInitials: 'LT', species: 'Lentinula edodes',     cls: 'edible',    confidence: 91, time: '33 min ago' },
]
function confColor(val: number) {
  return val >= 80 ? '#10b981' : val >= 60 ? '#f59e0b' : '#ef4444'
}

const healthItems = [
  { label: 'CPU Usage',    val: 38, color: '#10b981' },
  { label: 'Memory',       val: 61, color: '#f59e0b' },
  { label: 'Storage',      val: 45, color: '#3b82f6' },
  { label: 'Model Uptime', val: 99, color: '#10b981' },
]
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 22px; }

.page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.page-title  { font-size: 22px; font-weight: 700; color: #0f172a; }
.page-sub    { font-size: 13.5px; color: #64748b; margin-top: 3px; }
.header-actions { display: flex; align-items: center; gap: 10px; }
.date-badge { font-size: 12.5px; color: #64748b; background: #fff; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 8px; }
.btn-primary { padding: 8px 18px; border-radius: 8px; background: linear-gradient(135deg,#10b981,#059669); color: #fff; font-size: 13.5px; font-weight: 600; text-decoration: none; transition: opacity .18s; }
.btn-primary:hover { opacity: .88; }

.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.kpi-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 20px; display: flex; align-items: center; gap: 14px; position: relative; transition: box-shadow .18s; }
.kpi-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.07); }
.kpi-icon  { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kpi-value { font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.2; }
.kpi-label { font-size: 12.5px; color: #64748b; margin-top: 2px; }
.kpi-badge { position: absolute; top: 14px; right: 14px; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
.badge--up { background: #d1fae5; color: #065f46; }

.mid-row { display: grid; grid-template-columns: 1fr 280px; gap: 14px; }
.chart-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 22px; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.card-title  { font-size: 14px; font-weight: 600; color: #0f172a; }
.card-tag    { font-size: 11px; font-weight: 600; background: #d1fae5; color: #065f46; padding: 3px 8px; border-radius: 20px; }
.card-link   { font-size: 13px; color: #10b981; text-decoration: none; font-weight: 500; }
.card-link:hover { text-decoration: underline; }
.sparkline   { width: 100%; height: 120px; }
.chart-labels { display: flex; justify-content: space-between; padding: 0 4px; }
.chart-day  { font-size: 11px; color: #94a3b8; }
.donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.donut-svg  { width: 120px; height: 120px; }
.donut-legend { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #475569; }
.legend-dot  { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

.bottom-row { display: grid; grid-template-columns: 1fr 280px; gap: 14px; }
.activity-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 22px; }
.activity-table { width: 100%; border-collapse: collapse; margin-top: 4px; }
.activity-table th { text-align: left; font-size: 11.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
.activity-table td { padding: 10px; font-size: 13px; color: #334155; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.activity-table tr:last-child td { border-bottom: none; }
.activity-table tr:hover td { background: #f8fafc; }
.td-user    { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
.td-species { font-style: italic; color: #1e293b; }
.td-time    { color: #94a3b8; white-space: nowrap; }
.mini-avatar { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg,#10b981,#059669); color: #fff; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.class-chip { padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; text-transform: capitalize; }
.class-chip--edible    { background: #d1fae5; color: #065f46; }
.class-chip--poisonous { background: #fee2e2; color: #991b1b; }
.class-chip--unknown   { background: #fef3c7; color: #92400e; }
.conf-bar-wrap { display: flex; align-items: center; gap: 7px; }
.conf-bar  { height: 6px; border-radius: 10px; min-width: 4px; }
.conf-label { font-size: 12px; color: #475569; white-space: nowrap; }

.quick-actions-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; }
.qa-list { display: flex; flex-direction: column; gap: 8px; }
.qa-btn { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; border: 1px solid #f1f5f9; background: #f8fafc; text-decoration: none; color: #0f172a; font-size: 13.5px; font-weight: 500; transition: background .18s; }
.qa-btn:hover { background: #f1f5f9; }
.qa-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.health-list { display: flex; flex-direction: column; gap: 10px; }
.health-row  { display: grid; grid-template-columns: 90px 1fr 38px; align-items: center; gap: 10px; }
.health-label    { font-size: 12px; color: #64748b; }
.health-bar-wrap { height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
.health-bar  { height: 100%; border-radius: 10px; }
.health-pct  { font-size: 12px; font-weight: 600; color: #334155; text-align: right; }
</style>
