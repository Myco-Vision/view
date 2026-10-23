<template>
  <div class="flex flex-col gap-[22px]">
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">Reports & Analytics</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">Platform performance and scan data insights</p>
      </div>
      <div class="flex items-center gap-2.5">
        <select v-model="period" @change="fetchReports" class="py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans bg-white cursor-pointer outline-none">
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
        <button class="py-2 px-4 rounded-lg bg-[#0f172a] text-white border-none text-[13px] font-semibold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-85" @click="exportReport">⬇ Export CSV</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="w-8 h-8 border-[3px] border-[#e2e8f0] border-t-[#10b981] rounded-full animate-spin"></div>
    </div>

    <template v-else>
    <!-- Summary Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div v-for="s in summaryStats" :key="s.label" class="bg-white border border-[#e2e8f0] rounded-[14px] py-[18px] px-5 text-center transition-shadow duration-[0.18s] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <p class="text-[26px] font-bold leading-tight" :style="{ color: s.color }">{{ s.val }}</p>
        <p class="text-[13px] font-semibold text-[#0f172a] mt-1">{{ s.label }}</p>
        <p class="text-[11.5px] text-[#94a3b8] mt-0.5">{{ s.sub }}</p>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="flex gap-3.5 flex-wrap items-start">
      <!-- Line Chart: Scan Volume -->
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] py-5 px-[22px] flex-[2] min-w-0">
        <div class="flex items-center justify-between mb-4">
          <p class="text-[14px] font-semibold text-[#0f172a]">Scan Volume Over Time</p>
          <div class="flex gap-3.5">
            <span class="flex items-center gap-1.5 text-[12px] text-[#64748b]"><span class="w-2 h-2 rounded-full bg-[#10b981]"></span>Scans</span>
          </div>
        </div>
        <svg viewBox="0 0 600 160" class="w-full h-[160px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <line v-for="y in gridYs" :key="y" x1="0" :y1="y" x2="600" :y2="y" stroke="#f1f5f9" stroke-width="1"/>
          <path :d="lineAreaPath" fill="url(#lineGrad)"/>
          <polyline :points="linePoints" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle v-for="(p,i) in lineDots" :key="i" :cx="p.x" :cy="p.y" r="4" fill="#10b981" stroke="#fff" stroke-width="2"/>
        </svg>
        <div class="flex justify-between px-0.5 pt-1.5">
          <span v-for="d in lineLabels" :key="d" class="text-[11px] text-[#94a3b8]">{{ d }}</span>
        </div>
      </div>

      <!-- Bar Chart: Top Species -->
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] py-5 px-[22px] flex-1 min-w-[200px] min-w-0">
        <div class="flex items-center justify-between mb-4"><p class="text-[14px] font-semibold text-[#0f172a]">Top 5 Identified Species</p></div>
        <div v-if="topSpecies.length === 0" class="text-center py-4 text-[#94a3b8] text-[13px]">No data available</div>
        <div v-else class="flex flex-col gap-3">
          <div v-for="(sp, i) in topSpecies" :key="sp.result_name" class="flex items-center gap-2.5">
            <span class="text-[12px] font-italic text-[#334155] w-[90px] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap">{{ sp.result_name }}</span>
            <div class="flex-1 h-2 bg-[#f1f5f9] rounded-[10px] overflow-hidden">
              <div class="h-full rounded-[10px] transition-all duration-400" :style="{ width: (sp.count / topSpecies[0].count * 100) + '%', background: speciesColors[i] || '#10b981' }"></div>
            </div>
            <span class="text-[12px] font-semibold text-[#0f172a] w-8 text-right">{{ sp.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="flex gap-3.5 flex-wrap items-start">
      <!-- Donut: Classification -->
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] py-5 px-[22px] flex-1 min-w-0">
        <div class="flex items-center justify-between mb-4"><p class="text-[14px] font-semibold text-[#0f172a]">Classification Breakdown</p></div>
        <div class="flex flex-col items-center gap-4">
          <svg viewBox="0 0 140 140" class="w-[140px] h-[140px]">
            <circle cx="70" cy="70" r="52" fill="none" stroke="#f1f5f9" stroke-width="22"/>
            <circle cx="70" cy="70" r="52" fill="none" stroke="#10b981" stroke-width="22"
                    :stroke-dasharray="`${d_edible} ${d_total}`" stroke-dashoffset="0"
                    transform="rotate(-90 70 70)"/>
            <circle cx="70" cy="70" r="52" fill="none" stroke="#ef4444" stroke-width="22"
                    :stroke-dasharray="`${d_poison} ${d_total}`" :stroke-dashoffset="`-${d_edible}`"
                    transform="rotate(-90 70 70)"/>
            <circle cx="70" cy="70" r="52" fill="none" stroke="#f59e0b" stroke-width="22"
                    :stroke-dasharray="`${d_unknown} ${d_total}`" :stroke-dashoffset="`-${d_edible + d_poison}`"
                    transform="rotate(-90 70 70)"/>
            <text x="70" y="65" text-anchor="middle" font-size="16" font-weight="700" fill="#0f172a">{{ reportData.total_scans }}</text>
            <text x="70" y="82" text-anchor="middle" font-size="9" fill="#64748b">total scans</text>
          </svg>
          <div class="flex flex-col gap-2 w-full">
            <div class="flex items-center gap-2 text-[12.5px] text-[#475569]"><span class="w-2.5 h-2.5 rounded-full shrink-0 bg-[#10b981]"></span><span>Edible</span><strong class="ml-auto text-[#0f172a]">{{ reportData.edible_pct }}%</strong></div>
            <div class="flex items-center gap-2 text-[12.5px] text-[#475569]"><span class="w-2.5 h-2.5 rounded-full shrink-0 bg-[#ef4444]"></span><span>Poisonous</span><strong class="ml-auto text-[#0f172a]">{{ reportData.poisonous_pct }}%</strong></div>
            <div class="flex items-center gap-2 text-[12.5px] text-[#475569]"><span class="w-2.5 h-2.5 rounded-full shrink-0 bg-[#f59e0b]"></span><span>Unknown</span><strong class="ml-auto text-[#0f172a]">{{ reportData.unknown_pct }}%</strong></div>
          </div>
        </div>
      </div>

      <!-- Confidence Distribution -->
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] py-5 px-[22px] flex-1 min-w-0">
        <div class="flex items-center justify-between mb-4"><p class="text-[14px] font-semibold text-[#0f172a]">Confidence Distribution</p></div>
        <div class="flex items-end gap-3 h-[140px] pb-1">
          <div v-for="bucket in confBuckets" :key="bucket.label" class="flex flex-col items-center gap-1 flex-1">
            <div class="h-[100px] flex items-end w-full justify-center">
              <div class="w-7 rounded-t-md min-h-[4px] transition-all duration-400" :style="{ height: (bucket.pct) + '%', background: bucket.color }"></div>
            </div>
            <span class="text-[12px] font-bold text-[#0f172a]">{{ bucket.pct }}%</span>
            <span class="text-[10.5px] text-[#94a3b8] text-center whitespace-nowrap">{{ bucket.label }}</span>
          </div>
        </div>
      </div>

      <!-- Most Active Users -->
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] py-5 px-[22px] flex-1 min-w-0">
        <div class="flex items-center justify-between mb-4"><p class="text-[14px] font-semibold text-[#0f172a]">Most Active Users</p></div>
        <div v-if="topUsers.length === 0" class="text-center py-4 text-[#94a3b8] text-[13px]">No active users</div>
        <div v-else class="flex flex-col gap-2.5">
          <div v-for="(u, i) in topUsers" :key="u.name" class="flex items-center gap-2.5">
            <span class="text-[12px] font-bold w-[22px]" :class="i < 3 ? 'text-[#f59e0b]' : 'text-[#94a3b8]'">#{{ i + 1 }}</span>
            <div class="w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0" :style="{ background: userColors[i] || '#10b981' }">{{ u.initials }}</div>
            <div class="min-w-[80px]">
              <p class="text-[12.5px] font-semibold text-[#0f172a]">{{ u.name }}</p>
              <p class="text-[11px] text-[#94a3b8]">{{ u.scans }} scans</p>
            </div>
            <div class="flex-1 h-1.5 bg-[#f1f5f9] rounded-[10px] overflow-hidden">
              <div class="h-full rounded-[10px] transition-all duration-400" :style="{ width: (u.scans / topUsers[0].scans * 100) + '%', background: '#10b981' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const loading = ref(true)
const period = ref('30')

const reportData = ref<any>({
  total_scans: 0, avg_confidence: 0, active_users: 0, species_count: 0,
  edible_pct: 0, poisonous_pct: 0, unknown_pct: 0,
  scan_volume: [], top_species: [], conf_buckets: [], top_users: [],
})

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

async function fetchReports() {
  loading.value = true
  try {
    const res = await $fetch<any>(`${config.public.apiBase}/admin/reports?period=${period.value}`, {
      headers: getHeaders(),
    })
    reportData.value = res
  } catch (error) {
    console.error('Failed to load reports:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => { fetchReports() })

// Summary stats
const summaryStats = computed(() => {
  const d = reportData.value
  return [
    { val: d.total_scans?.toLocaleString() || '0', label: 'Total Scans',     sub: `Last ${period.value} days`, color: '#0f172a' },
    { val: (d.avg_confidence || 0) + '%',           label: 'Avg. Confidence', sub: 'All scans in period',       color: '#10b981' },
    { val: d.active_users?.toLocaleString() || '0', label: 'Active Users',    sub: 'Users with scans',         color: '#3b82f6' },
    { val: d.species_count?.toLocaleString() || '0',label: 'Species in DB',   sub: 'Total on record',          color: '#8b5cf6' },
  ]
})

// Line chart
const lineLabels = computed(() => (reportData.value.scan_volume || []).map((v: any) => v.label))
const lineValues = computed(() => {
  const vols = (reportData.value.scan_volume || []).map((v: any) => v.count)
  return vols.length > 0 ? vols : [0]
})

const W = 600; const H = 160; const pad = 18
const gridYs = [20, 55, 90, 125, 155]

const lineDots = computed(() => {
  const vals = lineValues.value
  const maxLV = Math.max(...vals, 1)
  return vals.map((v: number, i: number) => ({
    x: pad + (i / Math.max(vals.length - 1, 1)) * (W - pad * 2),
    y: H - pad - (v / maxLV) * (H - pad * 2),
  }))
})
const linePoints = computed(() => lineDots.value.map((p: any) => `${p.x},${p.y}`).join(' '))
const lineAreaPath = computed(() => {
  const dots = lineDots.value
  if (dots.length < 2) return ''
  return `M${dots[0].x},${dots[0].y} ` +
    dots.slice(1).map((p: any) => `L${p.x},${p.y}`).join(' ') +
    ` L${dots[dots.length-1].x},${H} L${dots[0].x},${H} Z`
})

// Top species
const topSpecies = computed(() => reportData.value.top_species || [])
const speciesColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4']

// Donut
const d_total = 2 * Math.PI * 52
const d_edible = computed(() => ((reportData.value.edible_pct || 0) / 100) * d_total)
const d_poison = computed(() => ((reportData.value.poisonous_pct || 0) / 100) * d_total)
const d_unknown = computed(() => ((reportData.value.unknown_pct || 0) / 100) * d_total)

// Confidence buckets
const confBuckets = computed(() => reportData.value.conf_buckets || [])

// Top users
const topUsers = computed(() => reportData.value.top_users || [])
const userColors = ['#8b5cf6', '#6366f1', '#10b981', '#ef4444', '#06b6d4']

function exportReport() {
  const d = reportData.value
  const lines = [
    `MycoVision Report — Last ${period.value} Days`,
    `Generated: ${new Date().toISOString()}`,
    '',
    `Total Scans,${d.total_scans}`,
    `Avg Confidence,${d.avg_confidence}%`,
    `Active Users,${d.active_users}`,
    `Species Count,${d.species_count}`,
    `Edible %,${d.edible_pct}`,
    `Poisonous %,${d.poisonous_pct}`,
    `Unknown %,${d.unknown_pct}`,
    '',
    'Top Species,Count',
    ...(d.top_species || []).map((s: any) => `${s.result_name},${s.count}`),
    '',
    'Top Users,Scans',
    ...(d.top_users || []).map((u: any) => `${u.name},${u.scans}`),
  ]
  const csv = lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mycovision_report_${period.value}d_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
