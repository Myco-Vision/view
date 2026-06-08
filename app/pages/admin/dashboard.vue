<template>
  <div class="flex flex-col gap-[22px]">
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">Dashboard</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">Welcome back, Admin. Here's what's happening today.</p>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
        <span class="text-[12.5px] text-[#64748b] bg-white border border-[#e2e8f0] py-1.5 px-3 rounded-lg hidden sm:inline">{{ todayDate }}</span>
        <NuxtLink to="/admin/reports" class="py-2 px-[18px] rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] text-white text-[13.5px] font-semibold no-underline transition-opacity duration-[0.18s] hover:opacity-90">View Reports →</NuxtLink>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div v-for="stat in stats" :key="stat.label" class="bg-white border border-[#e2e8f0] rounded-[14px] p-[18px] px-5 flex items-center gap-3.5 relative transition-shadow duration-[0.18s] hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" :style="{ background: stat.iconBg }">
          <span v-html="stat.icon" />
        </div>
        <div>
          <p class="text-[22px] font-bold text-[#0f172a] leading-[1.2]">{{ stat.value }}</p>
          <p class="text-[12.5px] text-[#64748b] mt-0.5">{{ stat.label }}</p>
        </div>
        <span class="absolute top-3.5 right-3.5 text-[11px] font-semibold py-[3px] px-2 rounded-full bg-[#d1fae5] text-[#065f46]">▲ {{ stat.change }}</span>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3.5">
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 px-[22px]">
        <div class="flex items-center justify-between mb-4">
          <p class="text-[14px] font-semibold text-[#0f172a]">Scan Volume — Last 7 Days</p>
          <span class="text-[11px] font-semibold bg-[#d1fae5] text-[#065f46] py-[3px] px-2 rounded-full">Live</span>
        </div>
        <svg viewBox="0 0 420 120" class="w-full h-[120px]" preserveAspectRatio="none">
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
        <div class="flex justify-between px-1 mt-1">
          <span v-for="d in chartDays" :key="d" class="text-[11px] text-[#94a3b8]">{{ d }}</span>
        </div>
      </div>

      <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 px-[22px]">
        <div class="flex items-center justify-between mb-4"><p class="text-[14px] font-semibold text-[#0f172a]">Classification Split</p></div>
        <div class="flex flex-col items-center gap-4">
          <svg viewBox="0 0 120 120" class="w-[120px] h-[120px]">
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
          <div class="flex flex-col gap-2 w-full">
            <div class="flex items-center gap-2 text-[12.5px] text-[#475569]"><span class="w-2.5 h-2.5 rounded-full shrink-0 bg-[#10b981]"></span>Edible (58%)</div>
            <div class="flex items-center gap-2 text-[12.5px] text-[#475569]"><span class="w-2.5 h-2.5 rounded-full shrink-0 bg-[#ef4444]"></span>Poisonous (28%)</div>
            <div class="flex items-center gap-2 text-[12.5px] text-[#475569]"><span class="w-2.5 h-2.5 rounded-full shrink-0 bg-[#f59e0b]"></span>Unknown (14%)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3.5">
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 px-[22px]">
        <div class="flex items-center justify-between mb-4">
          <p class="text-[14px] font-semibold text-[#0f172a]">Recent Scans</p>
          <NuxtLink to="/admin/scans" class="text-[13px] text-[#10b981] no-underline font-medium hover:underline">View all →</NuxtLink>
        </div>
        <table class="w-full border-collapse mt-1">
          <thead>
            <tr>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-2 px-2.5 border-b border-[#f1f5f9]">User</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-2 px-2.5 border-b border-[#f1f5f9]">Species</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-2 px-2.5 border-b border-[#f1f5f9]">Classification</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-2 px-2.5 border-b border-[#f1f5f9]">Confidence</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-2 px-2.5 border-b border-[#f1f5f9]">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="scan in recentScans" :key="scan.id" class="hover:bg-[#f8fafc]">
              <td class="py-2.5 px-2.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle flex items-center gap-2 whitespace-nowrap">
                <div class="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{{ scan.userInitials }}</div>{{ scan.user }}
              </td>
              <td class="py-2.5 px-2.5 text-[13px] text-[#1e293b] border-b border-[#f8fafc] align-middle italic">{{ scan.species }}</td>
              <td class="py-2.5 px-2.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle">
                <span class="py-[3px] px-2.5 rounded-[20px] text-[11.5px] font-semibold capitalize" :class="scan.cls === 'edible' ? 'bg-[#d1fae5] text-[#065f46]' : (scan.cls === 'poisonous' ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#fef3c7] text-[#92400e]')">{{ scan.cls }}</span>
              </td>
              <td class="py-2.5 px-2.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle">
                <div class="flex items-center gap-[7px]">
                  <div class="h-1.5 rounded-[10px] min-w-[4px]" :style="{ width: scan.confidence + '%', background: confColor(scan.confidence) }"></div>
                  <span class="text-[12px] text-[#475569] whitespace-nowrap">{{ scan.confidence }}%</span>
                </div>
              </td>
              <td class="py-2.5 px-2.5 text-[13px] text-[#94a3b8] border-b border-[#f8fafc] align-middle whitespace-nowrap">{{ scan.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5">
        <p class="text-[14px] font-semibold text-[#0f172a] mb-3.5">Quick Actions</p>
        <div class="flex flex-col gap-2">
          <NuxtLink to="/admin/species" class="flex items-center gap-3 py-2.5 px-3 rounded-[10px] border border-[#f1f5f9] bg-[#f8fafc] no-underline text-[#0f172a] text-[13.5px] font-medium transition-colors duration-[0.18s] hover:bg-[#f1f5f9]"><span class="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] shrink-0 bg-[#d1fae5] text-[#059669]">🌿</span><span>Add New Species</span></NuxtLink>
          <NuxtLink to="/admin/users"   class="flex items-center gap-3 py-2.5 px-3 rounded-[10px] border border-[#f1f5f9] bg-[#f8fafc] no-underline text-[#0f172a] text-[13.5px] font-medium transition-colors duration-[0.18s] hover:bg-[#f1f5f9]"><span class="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] shrink-0 bg-[#dbeafe] text-[#2563eb]">👥</span><span>Manage Users</span></NuxtLink>
          <NuxtLink to="/admin/reports" class="flex items-center gap-3 py-2.5 px-3 rounded-[10px] border border-[#f1f5f9] bg-[#f8fafc] no-underline text-[#0f172a] text-[13.5px] font-medium transition-colors duration-[0.18s] hover:bg-[#f1f5f9]"><span class="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] shrink-0 bg-[#fef3c7] text-[#d97706]">📊</span><span>Export Reports</span></NuxtLink>
          <NuxtLink to="/admin/settings" class="flex items-center gap-3 py-2.5 px-3 rounded-[10px] border border-[#f1f5f9] bg-[#f8fafc] no-underline text-[#0f172a] text-[13.5px] font-medium transition-colors duration-[0.18s] hover:bg-[#f1f5f9]"><span class="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] shrink-0 bg-[#f3e8ff] text-[#7c3aed]">⚙️</span><span>System Settings</span></NuxtLink>
        </div>
        <p class="text-[14px] font-semibold text-[#0f172a] mt-[18px] mb-3">System Health</p>
        <div class="flex flex-col gap-2.5">
          <div v-for="h in healthItems" :key="h.label" class="grid grid-cols-[90px_1fr_38px] items-center gap-2.5">
            <span class="text-[12px] text-[#64748b]">{{ h.label }}</span>
            <div class="h-1.5 bg-[#f1f5f9] rounded-[10px] overflow-hidden"><div class="h-full rounded-[10px]" :style="{ width: h.val + '%', background: h.color }"></div></div>
            <span class="text-[12px] font-semibold text-[#334155] text-right">{{ h.val }}%</span>
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

const recentScans: any[] = []
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
