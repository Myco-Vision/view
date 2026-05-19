<template>
  <div class="scans-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Scans Log</h1>
        <p class="page-sub">System-wide mushroom scan history</p>
      </div>
      <div class="header-actions">
        <div class="search-wrap">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" class="search-input" placeholder="Search scans…" />
        </div>
        <select v-model="clsFilter" class="filter-select">
          <option value="">All Classifications</option>
          <option value="edible">Edible</option>
          <option value="poisonous">Poisonous</option>
          <option value="unknown">Unknown</option>
        </select>
        <select v-model="dateFilter" class="filter-select">
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <button class="export-btn" @click="exportCSV">⬇ Export CSV</button>
      </div>
    </div>

    <!-- Stats Strip -->
    <div class="stats-strip">
      <div class="strip-item">
        <span class="strip-val">{{ scans.length }}</span>
        <span class="strip-label">Total Scans</span>
      </div>
      <div class="strip-item">
        <span class="strip-val" style="color:#10b981">{{ edibleCount }}</span>
        <span class="strip-label">Edible</span>
      </div>
      <div class="strip-item">
        <span class="strip-val" style="color:#ef4444">{{ poisonousCount }}</span>
        <span class="strip-label">Poisonous</span>
      </div>
      <div class="strip-item">
        <span class="strip-val" style="color:#f59e0b">{{ unknownCount }}</span>
        <span class="strip-label">Unknown</span>
      </div>
      <div class="strip-item">
        <span class="strip-val">{{ avgConfidence }}%</span>
        <span class="strip-label">Avg. Confidence</span>
      </div>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Species Identified</th>
            <th>Classification</th>
            <th>Confidence</th>
            <th>Location</th>
            <th>Date & Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="scan in filteredScans" :key="scan.id">
            <td class="td-id">{{ scan.id }}</td>
            <td class="td-user">
              <div class="mini-avatar" :style="{ background: scan.avatarColor }">{{ scan.initials }}</div>
              {{ scan.user }}
            </td>
            <td class="td-species">{{ scan.species }}</td>
            <td><span class="class-chip" :class="`class-chip--${scan.cls}`">{{ scan.cls }}</span></td>
            <td>
              <div class="conf-wrap">
                <div class="conf-bar" :style="{ width: scan.confidence + '%', background: confColor(scan.confidence) }"/>
                <span class="conf-label">{{ scan.confidence }}%</span>
              </div>
            </td>
            <td class="td-loc">📍 {{ scan.location }}</td>
            <td class="td-date">{{ scan.date }}</td>
            <td>
              <button class="view-btn" @click="openScan(scan)">View</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="table-footer">
        <span class="table-count">Showing {{ filteredScans.length }} of {{ scans.length }} scans</span>
        <div class="pagination">
          <button class="page-btn" :disabled="page <= 1" @click="page--">‹</button>
          <span class="page-info">Page {{ page }} of {{ totalPages }}</span>
          <button class="page-btn" :disabled="page >= totalPages" @click="page++">›</button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedScan" class="modal-overlay" @click.self="selectedScan = null">
      <div class="modal">
        <div class="modal-header">
          <p class="modal-title">Scan Detail — #{{ selectedScan.id }}</p>
          <button class="modal-close" @click="selectedScan = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item"><p class="detail-label">User</p><p class="detail-val">{{ selectedScan.user }}</p></div>
            <div class="detail-item"><p class="detail-label">Date</p><p class="detail-val">{{ selectedScan.date }}</p></div>
            <div class="detail-item"><p class="detail-label">Species</p><p class="detail-val td-species">{{ selectedScan.species }}</p></div>
            <div class="detail-item"><p class="detail-label">Classification</p>
              <span class="class-chip" :class="`class-chip--${selectedScan.cls}`">{{ selectedScan.cls }}</span>
            </div>
            <div class="detail-item"><p class="detail-label">Confidence</p><p class="detail-val">{{ selectedScan.confidence }}%</p></div>
            <div class="detail-item"><p class="detail-label">Location</p><p class="detail-val">{{ selectedScan.location }}</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const searchQuery = ref('')
const clsFilter   = ref('')
const dateFilter  = ref('')
const page        = ref(1)
const perPage     = 10
const selectedScan = ref<any>(null)

const scans = ref([
  { id: 'SC-0128', user: 'Maria S.',  initials: 'MS', avatarColor: '#10b981', species: 'Volvariella volvacea',   cls: 'edible',    confidence: 94, location: 'Los Baños, Laguna',  date: 'May 7, 2026 — 09:12 AM' },
  { id: 'SC-0127', user: 'Juan D.',   initials: 'JD', avatarColor: '#3b82f6', species: 'Amanita phalloides',     cls: 'poisonous', confidence: 88, location: 'Baguio City',         date: 'May 7, 2026 — 08:55 AM' },
  { id: 'SC-0126', user: 'Ana R.',    initials: 'AR', avatarColor: '#8b5cf6', species: 'Pleurotus ostreatus',    cls: 'edible',    confidence: 97, location: 'Davao City',          date: 'May 7, 2026 — 08:40 AM' },
  { id: 'SC-0125', user: 'Carlo M.',  initials: 'CM', avatarColor: '#f59e0b', species: 'Unknown species',        cls: 'unknown',   confidence: 42, location: 'Cebu City',           date: 'May 7, 2026 — 08:21 AM' },
  { id: 'SC-0124', user: 'Lisa T.',   initials: 'LT', avatarColor: '#ef4444', species: 'Lentinula edodes',       cls: 'edible',    confidence: 91, location: 'Tagaytay, Cavite',   date: 'May 6, 2026 — 04:15 PM' },
  { id: 'SC-0123', user: 'Ben S.',    initials: 'BS', avatarColor: '#06b6d4', species: 'Ganoderma lucidum',      cls: 'edible',    confidence: 86, location: 'Iloilo City',         date: 'May 6, 2026 — 03:50 PM' },
  { id: 'SC-0122', user: 'Grace L.',  initials: 'GL', avatarColor: '#ec4899', species: 'Cortinarius rubellus',   cls: 'poisonous', confidence: 79, location: 'Bukidnon',            date: 'May 6, 2026 — 02:10 PM' },
  { id: 'SC-0121', user: 'Ramon F.',  initials: 'RF', avatarColor: '#f97316', species: 'Auricularia auricula',   cls: 'edible',    confidence: 93, location: 'Cagayan de Oro',     date: 'May 5, 2026 — 11:30 AM' },
  { id: 'SC-0120', user: 'Joy C.',    initials: 'JC', avatarColor: '#14b8a6', species: 'Unknown species',        cls: 'unknown',   confidence: 35, location: 'Antipolo, Rizal',    date: 'May 5, 2026 — 10:05 AM' },
  { id: 'SC-0119', user: 'Mark B.',   initials: 'MB', avatarColor: '#6366f1', species: 'Trametes versicolor',    cls: 'edible',    confidence: 89, location: 'Quezon City',         date: 'May 4, 2026 — 03:22 PM' },
])

const edibleCount    = computed(() => scans.value.filter(s => s.cls === 'edible').length)
const poisonousCount = computed(() => scans.value.filter(s => s.cls === 'poisonous').length)
const unknownCount   = computed(() => scans.value.filter(s => s.cls === 'unknown').length)
const avgConfidence  = computed(() => Math.round(scans.value.reduce((a, s) => a + s.confidence, 0) / scans.value.length))

const filteredScans = computed(() => scans.value.filter(s => {
  const q = searchQuery.value.toLowerCase()
  const matchQ = !q || s.user.toLowerCase().includes(q) || s.species.toLowerCase().includes(q)
  const matchC = !clsFilter.value || s.cls === clsFilter.value
  return matchQ && matchC
}))

const totalPages = computed(() => Math.max(1, Math.ceil(filteredScans.value.length / perPage)))

function confColor(v: number) { return v >= 80 ? '#10b981' : v >= 60 ? '#f59e0b' : '#ef4444' }
function openScan(scan: any)  { selectedScan.value = scan }
function exportCSV()          { alert('Exporting scan log as CSV…') }
</script>

<style scoped>
.scans-page { display: flex; flex-direction: column; gap: 22px; }
.page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.page-title  { font-size: 22px; font-weight: 700; color: #0f172a; }
.page-sub    { font-size: 13.5px; color: #64748b; margin-top: 3px; }
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.search-wrap { position: relative; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: #94a3b8; }
.search-input { padding: 8px 12px 8px 32px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13.5px; font-family: inherit; color: #0f172a; background: #fff; outline: none; width: 200px; transition: border-color .18s; }
.search-input:focus { border-color: #10b981; }
.filter-select { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13.5px; font-family: inherit; background: #fff; cursor: pointer; outline: none; }
.export-btn   { padding: 8px 16px; border-radius: 8px; background: #0f172a; color: #fff; border: none; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; transition: opacity .18s; }
.export-btn:hover { opacity: .85; }

.stats-strip { display: flex; gap: 14px; }
.strip-item  { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 20px; flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.strip-val   { font-size: 22px; font-weight: 700; color: #0f172a; }
.strip-label { font-size: 12px; color: #64748b; }

.table-card  { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
.data-table  { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; font-size: 11.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; padding: 12px 14px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
.data-table td { padding: 11px 14px; font-size: 13px; color: #334155; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #f8fafc; }
.td-id      { font-family: monospace; font-size: 12px; color: #94a3b8; }
.td-user    { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
.td-species { font-style: italic; }
.td-loc     { font-size: 12.5px; color: #64748b; }
.td-date    { font-size: 12.5px; color: #94a3b8; white-space: nowrap; }
.mini-avatar { width: 26px; height: 26px; border-radius: 50%; color: #fff; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.class-chip  { padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; text-transform: capitalize; }
.class-chip--edible    { background: #d1fae5; color: #065f46; }
.class-chip--poisonous { background: #fee2e2; color: #991b1b; }
.class-chip--unknown   { background: #fef3c7; color: #92400e; }
.conf-wrap   { display: flex; align-items: center; gap: 7px; }
.conf-bar    { height: 6px; border-radius: 10px; min-width: 4px; width: 60px; }
.conf-label  { font-size: 12px; color: #475569; }
.view-btn    { padding: 5px 14px; border-radius: 7px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit; color: #0f172a; transition: background .18s; }
.view-btn:hover { background: #f1f5f9; }

.table-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid #f1f5f9; }
.table-count  { font-size: 12.5px; color: #64748b; }
.pagination   { display: flex; align-items: center; gap: 10px; }
.page-btn     { width: 30px; height: 30px; border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; font-size: 14px; color: #475569; transition: background .18s; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-btn:not(:disabled):hover { background: #f1f5f9; }
.page-info    { font-size: 12.5px; color: #475569; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(2px); }
.modal  { background: #fff; border-radius: 16px; width: 460px; max-width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,.2); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #f1f5f9; }
.modal-title  { font-size: 15px; font-weight: 700; color: #0f172a; }
.modal-close  { background: transparent; border: none; cursor: pointer; font-size: 16px; color: #94a3b8; }
.modal-close:hover { color: #ef4444; }
.modal-body   { padding: 22px; }
.detail-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.detail-item  { background: #f8fafc; border-radius: 10px; padding: 12px 14px; }
.detail-label { font-size: 11.5px; color: #94a3b8; margin-bottom: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: .4px; }
.detail-val   { font-size: 14px; font-weight: 600; color: #0f172a; }
</style>
