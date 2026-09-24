<template>
  <div class="flex flex-col gap-[22px]">
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">Scans Log</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">System-wide mushroom scan history</p>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
        <div class="relative">
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#94a3b8]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" @input="debouncedFetch" class="py-2 pr-3 pl-8 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none w-full sm:w-[200px] transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="Search scans…" />
        </div>
        <select v-model="clsFilter" @change="fetchScans()" class="py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans bg-white cursor-pointer outline-none">
          <option value="">All Classifications</option>
          <option value="edible">Edible</option>
          <option value="poisonous">Poisonous</option>
          <option value="unknown">Unknown</option>
        </select>
        <select v-model="dateFilter" @change="fetchScans()" class="py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans bg-white cursor-pointer outline-none">
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <button class="py-2 px-4 rounded-lg bg-[#0f172a] text-white border-none text-[13px] font-semibold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-85" @click="exportCSV">⬇ Export CSV</button>
      </div>
    </div>

    <!-- Stats Strip -->
    <div class="flex gap-3.5 flex-wrap">
      <div class="bg-white border border-[#e2e8f0] rounded-xl py-3.5 px-5 flex-1 min-w-[100px] flex flex-col items-center gap-1">
        <span class="text-[22px] font-bold text-[#0f172a]">{{ pagination.total }}</span>
        <span class="text-[12px] text-[#64748b]">Total Scans</span>
      </div>
      <div class="bg-white border border-[#e2e8f0] rounded-xl py-3.5 px-5 flex-1 min-w-[100px] flex flex-col items-center gap-1">
        <span class="text-[22px] font-bold text-[#10b981]">{{ edibleCount }}</span>
        <span class="text-[12px] text-[#64748b]">Edible</span>
      </div>
      <div class="bg-white border border-[#e2e8f0] rounded-xl py-3.5 px-5 flex-1 min-w-[100px] flex flex-col items-center gap-1">
        <span class="text-[22px] font-bold text-[#ef4444]">{{ poisonousCount }}</span>
        <span class="text-[12px] text-[#64748b]">Poisonous</span>
      </div>
      <div class="bg-white border border-[#e2e8f0] rounded-xl py-3.5 px-5 flex-1 min-w-[100px] flex flex-col items-center gap-1">
        <span class="text-[22px] font-bold text-[#f59e0b]">{{ unknownCount }}</span>
        <span class="text-[12px] text-[#64748b]">Unknown</span>
      </div>
      <div class="bg-white border border-[#e2e8f0] rounded-xl py-3.5 px-5 flex-1 min-w-[100px] flex flex-col items-center gap-1">
        <span class="text-[22px] font-bold text-[#0f172a]">{{ avgConfidence }}%</span>
        <span class="text-[12px] text-[#64748b]">Avg. Confidence</span>
      </div>
    </div>

    <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">#</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">User</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Species Identified</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Classification</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Confidence</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Location</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Date & Time</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="animate-pulse">
            <td colspan="8" class="py-8 text-center text-[#94a3b8] text-[13.5px]">Loading scans...</td>
          </tr>
          <tr v-else-if="scans.length === 0">
            <td colspan="8" class="py-8 text-center text-[#94a3b8] text-[14px]">No scans found.</td>
          </tr>
          <tr v-else v-for="scan in scans" :key="scan.id" class="hover:bg-[#f8fafc] group">
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle font-mono text-[#94a3b8] text-[12px] group-last:border-none">{{ scan.id }}</td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <div class="flex items-center gap-2 whitespace-nowrap">
                <div class="w-[26px] h-[26px] rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 bg-gradient-to-br from-[#10b981] to-[#059669]">{{ getInitials(scan.user?.name) }}</div>
                {{ scan.user?.name || 'Unknown' }}
              </div>
            </td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle italic group-last:border-none">{{ scan.species?.name || scan.result_name || 'Unknown' }}</td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <span class="py-[3px] px-2.5 rounded-[20px] text-[11.5px] font-semibold capitalize" :class="clsBadge(scan.result_classification)">{{ scan.result_classification || 'unknown' }}</span>
            </td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <div class="flex items-center gap-[7px]">
                <div class="h-1.5 rounded-[10px] min-w-[4px] w-[60px]"><div class="h-full rounded-[10px]" :style="{ width: (scan.confidence_level || 0) + '%', background: confColor(scan.confidence_level || 0) }"></div></div>
                <span class="text-[12px] text-[#475569]">{{ Math.round(scan.confidence_level || 0) }}%</span>
              </div>
            </td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle text-[12.5px] text-[#64748b] group-last:border-none">
              {{ scan.latitude && scan.longitude ? `📍 ${Number(scan.latitude).toFixed(2)}, ${Number(scan.longitude).toFixed(2)}` : '—' }}
            </td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle text-[12.5px] text-[#94a3b8] whitespace-nowrap group-last:border-none">{{ formatDate(scan.created_at) }}</td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <button class="py-[5px] px-[14px] rounded-[7px] border border-[#e2e8f0] bg-[#f8fafc] text-[12.5px] font-semibold cursor-pointer font-sans text-[#0f172a] transition-colors duration-[0.18s] hover:bg-[#f1f5f9]" @click="openScan(scan)">View</button>
            </td>
          </tr>
        </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between py-3 px-4 border-t border-[#f1f5f9]">
        <span class="text-[12.5px] text-[#64748b]">Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total }} scans</span>
        <div class="flex items-center gap-2.5">
          <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white" :disabled="pagination.current_page <= 1" @click="fetchScans(pagination.current_page - 1)">‹</button>
          <span class="text-[12.5px] text-[#475569]">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
          <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white" :disabled="pagination.current_page >= pagination.last_page" @click="fetchScans(pagination.current_page + 1)">›</button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedScan" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-[2px]" @click.self="selectedScan = null">
      <div class="bg-white rounded-2xl w-[460px] max-w-[90vw] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <div class="flex items-center justify-between py-[18px] px-[22px] border-b border-[#f1f5f9]">
          <p class="text-[15px] font-bold text-[#0f172a]">Scan Detail — #{{ selectedScan.id }}</p>
          <button class="bg-transparent border-none cursor-pointer text-[16px] text-[#94a3b8] hover:text-[#ef4444]" @click="selectedScan = null">✕</button>
        </div>
        <div class="p-[22px]">
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">User</p><p class="text-[14px] font-semibold text-[#0f172a]">{{ selectedScan.user?.name || 'Unknown' }}</p></div>
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">Date</p><p class="text-[14px] font-semibold text-[#0f172a]">{{ formatDate(selectedScan.created_at) }}</p></div>
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">Species</p><p class="text-[14px] font-semibold text-[#0f172a] italic">{{ selectedScan.species?.name || selectedScan.result_name || 'Unknown' }}</p></div>
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">Classification</p>
              <span class="py-[3px] px-2.5 rounded-[20px] text-[11.5px] font-semibold capitalize" :class="clsBadge(selectedScan.result_classification)">{{ selectedScan.result_classification || 'unknown' }}</span>
            </div>
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">Confidence</p><p class="text-[14px] font-semibold text-[#0f172a]">{{ Math.round(selectedScan.confidence_level || 0) }}%</p></div>
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">Location</p><p class="text-[14px] font-semibold text-[#0f172a]">{{ selectedScan.latitude && selectedScan.longitude ? `${Number(selectedScan.latitude).toFixed(4)}, ${Number(selectedScan.longitude).toFixed(4)}` : 'N/A' }}</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const loading = ref(true)
const searchQuery = ref('')
const clsFilter   = ref('')
const dateFilter  = ref('')
const selectedScan = ref<any>(null)

const scans = ref<any[]>([])
const pagination = reactive({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 })

// Local stats computed from current page data (approximate)
const edibleCount    = computed(() => scans.value.filter(s => s.result_classification === 'edible').length)
const poisonousCount = computed(() => scans.value.filter(s => s.result_classification === 'poisonous').length)
const unknownCount   = computed(() => scans.value.filter(s => !s.result_classification || s.result_classification === 'unknown').length)
const avgConfidence  = computed(() => {
  if (scans.value.length === 0) return 0
  return Math.round(scans.value.reduce((a, s) => a + (s.confidence_level || 0), 0) / scans.value.length)
})

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

let debounceTimer: any = null
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchScans(), 300)
}

async function fetchScans(page = 1) {
  loading.value = true
  try {
    const params: any = { page: page.toString() }
    if (searchQuery.value) params.search = searchQuery.value
    if (clsFilter.value) params.classification = clsFilter.value
    if (dateFilter.value) params.date_filter = dateFilter.value

    const query = new URLSearchParams(params).toString()

    const res = await $fetch<any>(`${config.public.apiBase}/admin/scans?${query}`, {
      headers: getHeaders(),
    })

    scans.value = res.data
    pagination.current_page = res.current_page
    pagination.last_page = res.last_page
    pagination.total = res.total
    pagination.from = res.from
    pagination.to = res.to
  } catch (error) {
    console.error('Failed to fetch scans:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => { fetchScans() })

function getInitials(name: string | undefined) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function clsBadge(cls: string) {
  if (cls === 'edible') return 'bg-[#d1fae5] text-[#065f46]'
  if (cls === 'poisonous') return 'bg-[#fee2e2] text-[#991b1b]'
  return 'bg-[#fef3c7] text-[#92400e]'
}

function confColor(v: number) { return v >= 80 ? '#10b981' : v >= 60 ? '#f59e0b' : '#ef4444' }

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function openScan(scan: any) { selectedScan.value = scan }

function exportCSV() {
  // Build CSV from current scan data
  const headers = ['ID', 'User', 'Species', 'Classification', 'Confidence', 'Latitude', 'Longitude', 'Date']
  const rows = scans.value.map(s => [
    s.id,
    s.user?.name || 'Unknown',
    s.species?.name || s.result_name || 'Unknown',
    s.result_classification || 'unknown',
    Math.round(s.confidence_level || 0),
    s.latitude || '',
    s.longitude || '',
    s.created_at,
  ])
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `scans_export_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
