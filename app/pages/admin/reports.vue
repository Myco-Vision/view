<template>
  <div class="reports-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Reports & Analytics</h1>
        <p class="page-sub">Platform performance and scan data insights</p>
      </div>
      <div class="header-actions">
        <select v-model="period" class="filter-select">
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
        <button class="export-btn" @click="exportReport">⬇ Export CSV</button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div v-for="s in summaryStats" :key="s.label" class="summary-card">
        <p class="sum-val" :style="{ color: s.color }">{{ s.val }}</p>
        <p class="sum-label">{{ s.label }}</p>
        <p class="sum-sub">{{ s.sub }}</p>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="charts-row">
      <!-- Line Chart: Scan Volume -->
      <div class="chart-card chart-card--wide">
        <div class="card-header">
          <p class="card-title">Scan Volume Over Time</p>
          <div class="legend-row">
            <span class="leg-item"><span class="leg-dot" style="background:#10b981"></span>Scans</span>
          </div>
        </div>
        <svg viewBox="0 0 600 160" class="line-chart" preserveAspectRatio="none">
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
        <div class="chart-x-labels">
          <span v-for="d in lineLabels" :key="d" class="x-label">{{ d }}</span>
        </div>
      </div>

      <!-- Bar Chart: Top Species -->
      <div class="chart-card">
        <div class="card-header"><p class="card-title">Top 5 Identified Species</p></div>
        <div class="bar-chart">
          <div v-for="sp in topSpecies" :key="sp.name" class="bar-row">
            <span class="bar-name">{{ sp.name }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: (sp.count / topSpecies[0].count * 100) + '%', background: sp.color }"/>
            </div>
            <span class="bar-count">{{ sp.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="charts-row">
      <!-- Donut: Classification -->
      <div class="chart-card chart-card--sq">
        <div class="card-header"><p class="card-title">Classification Breakdown</p></div>
        <div class="donut-wrap">
          <svg viewBox="0 0 140 140" class="donut-svg">
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
            <text x="70" y="65" text-anchor="middle" font-size="16" font-weight="700" fill="#0f172a">{{ totalScans }}</text>
            <text x="70" y="82" text-anchor="middle" font-size="9" fill="#64748b">total scans</text>
          </svg>
          <div class="donut-legend">
            <div class="leg-item2"><span class="leg-dot" style="background:#10b981"></span><span>Edible</span><strong>{{ ediblePct }}%</strong></div>
            <div class="leg-item2"><span class="leg-dot" style="background:#ef4444"></span><span>Poisonous</span><strong>{{ poisonPct }}%</strong></div>
            <div class="leg-item2"><span class="leg-dot" style="background:#f59e0b"></span><span>Unknown</span><strong>{{ unknownPct }}%</strong></div>
          </div>
        </div>
      </div>

      <!-- Confidence Distribution -->
      <div class="chart-card chart-card--sq">
        <div class="card-header"><p class="card-title">Confidence Distribution</p></div>
        <div class="conf-dist">
          <div v-for="bucket in confBuckets" :key="bucket.label" class="conf-bucket">
            <div class="bucket-bar-wrap">
              <div class="bucket-bar" :style="{ height: (bucket.pct) + '%', background: bucket.color }"/>
            </div>
            <span class="bucket-pct">{{ bucket.pct }}%</span>
            <span class="bucket-label">{{ bucket.label }}</span>
          </div>
        </div>
      </div>

      <!-- Most Active Users -->
      <div class="chart-card chart-card--sq">
        <div class="card-header"><p class="card-title">Most Active Users</p></div>
        <div class="user-rank-list">
          <div v-for="(u, i) in topUsers" :key="u.name" class="rank-row">
            <span class="rank-num" :class="i < 3 ? 'rank-num--top' : ''">#{{ i + 1 }}</span>
            <div class="rank-avatar" :style="{ background: u.color }">{{ u.initials }}</div>
            <div class="rank-info">
              <p class="rank-name">{{ u.name }}</p>
              <p class="rank-sub">{{ u.scans }} scans</p>
            </div>
            <div class="rank-bar-wrap">
              <div class="rank-bar" :style="{ width: (u.scans / topUsers[0].scans * 100) + '%', background: '#10b981' }"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const period = ref('30')

const summaryStats = [
  { val: '3,842', label: 'Total Scans',    sub: 'All time',           color: '#0f172a' },
  { val: '91.4%', label: 'Avg. Confidence',sub: '+2.1% vs last month', color: '#10b981' },
  { val: '1,248', label: 'Active Users',   sub: '+12% this month',    color: '#3b82f6' },
  { val: '186',   label: 'Species in DB',  sub: '3 added this week',  color: '#8b5cf6' },
]

// Line chart data
const lineLabels = ['Apr 11', 'Apr 15', 'Apr 19', 'Apr 23', 'Apr 27', 'May 1', 'May 5']
const lineValues = [120, 158, 134, 210, 175, 248, 220]
const W = 600; const H = 160; const pad = 18
const maxLV = Math.max(...lineValues)
const gridYs = [20, 55, 90, 125, 155]
const lineDots = lineValues.map((v, i) => ({
  x: pad + (i / (lineValues.length - 1)) * (W - pad * 2),
  y: H - pad - (v / maxLV) * (H - pad * 2),
}))
const linePoints   = lineDots.map(p => `${p.x},${p.y}`).join(' ')
const lineAreaPath = `M${lineDots[0].x},${lineDots[0].y} ` +
  lineDots.slice(1).map(p => `L${p.x},${p.y}`).join(' ') +
  ` L${lineDots[lineDots.length-1].x},${H} L${lineDots[0].x},${H} Z`

// Bar chart
const topSpecies = [
  { name: 'V. volvacea',   count: 412, color: '#10b981' },
  { name: 'P. ostreatus',  count: 328, color: '#3b82f6' },
  { name: 'L. edodes',     count: 275, color: '#8b5cf6' },
  { name: 'G. lucidum',    count: 198, color: '#f59e0b' },
  { name: 'A. auricula',   count: 163, color: '#06b6d4' },
]

// Donut
const totalScans = 3842
const ediblePct  = 58; const poisonPct = 28; const unknownPct = 14
const d_total    = 2 * Math.PI * 52
const d_edible   = (ediblePct  / 100) * d_total
const d_poison   = (poisonPct  / 100) * d_total
const d_unknown  = (unknownPct / 100) * d_total

// Confidence buckets
const confBuckets = [
  { label: '90-100%', pct: 45, color: '#10b981' },
  { label: '70-89%',  pct: 32, color: '#3b82f6' },
  { label: '50-69%',  pct: 15, color: '#f59e0b' },
  { label: '<50%',    pct: 8,  color: '#ef4444' },
]

// Top users
const topUsers = [
  { name: 'Ana Reyes',    initials: 'AR', scans: 112, color: '#8b5cf6' },
  { name: 'Mark Bautista',initials: 'MB', scans: 98,  color: '#6366f1' },
  { name: 'Maria Salem',  initials: 'MS', scans: 87,  color: '#10b981' },
  { name: 'Lisa Torres',  initials: 'LT', scans: 65,  color: '#ef4444' },
  { name: 'Ben Santos',   initials: 'BS', scans: 53,  color: '#06b6d4' },
]

function exportReport() { alert('Exporting analytics report as CSV…') }
</script>

<style scoped>
.reports-page { display: flex; flex-direction: column; gap: 22px; }
.page-header  { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.page-title   { font-size: 22px; font-weight: 700; color: #0f172a; }
.page-sub     { font-size: 13.5px; color: #64748b; margin-top: 3px; }
.header-actions { display: flex; align-items: center; gap: 10px; }
.filter-select { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13.5px; font-family: inherit; background: #fff; cursor: pointer; outline: none; }
.export-btn   { padding: 8px 16px; border-radius: 8px; background: #0f172a; color: #fff; border: none; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
.export-btn:hover { opacity: .85; }

.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.summary-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 20px; text-align: center; transition: box-shadow .18s; }
.summary-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.06); }
.sum-val   { font-size: 26px; font-weight: 700; }
.sum-label { font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 4px; }
.sum-sub   { font-size: 11.5px; color: #94a3b8; margin-top: 2px; }

.charts-row { display: flex; gap: 14px; align-items: flex-start; }
.chart-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 22px; flex: 1; min-width: 0; }
.chart-card--wide { flex: 2; }
.chart-card--sq   { flex: 1; min-width: 0; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.card-title  { font-size: 14px; font-weight: 600; color: #0f172a; }
.legend-row  { display: flex; gap: 14px; }
.leg-item    { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; }
.leg-dot     { width: 8px; height: 8px; border-radius: 50%; }

.line-chart    { width: 100%; height: 160px; }
.chart-x-labels { display: flex; justify-content: space-between; padding: 6px 2px 0; }
.x-label       { font-size: 11px; color: #94a3b8; }

.bar-chart { display: flex; flex-direction: column; gap: 12px; }
.bar-row   { display: flex; align-items: center; gap: 10px; }
.bar-name  { font-size: 12px; font-style: italic; color: #334155; width: 90px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bar-track { flex: 1; height: 8px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
.bar-fill  { height: 100%; border-radius: 10px; transition: width .4s; }
.bar-count { font-size: 12px; font-weight: 600; color: #0f172a; width: 32px; text-align: right; }

.donut-wrap   { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.donut-svg    { width: 140px; height: 140px; }
.donut-legend { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.leg-item2    { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #475569; }
.leg-item2 strong { margin-left: auto; color: #0f172a; }

.conf-dist { display: flex; align-items: flex-end; gap: 12px; height: 140px; padding-bottom: 4px; }
.conf-bucket { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
.bucket-bar-wrap { height: 100px; display: flex; align-items: flex-end; }
.bucket-bar   { width: 28px; border-radius: 6px 6px 0 0; min-height: 4px; transition: height .4s; }
.bucket-pct   { font-size: 12px; font-weight: 700; color: #0f172a; }
.bucket-label { font-size: 10.5px; color: #94a3b8; text-align: center; }

.user-rank-list { display: flex; flex-direction: column; gap: 10px; }
.rank-row   { display: flex; align-items: center; gap: 10px; }
.rank-num   { font-size: 12px; font-weight: 700; color: #94a3b8; width: 22px; }
.rank-num--top { color: #f59e0b; }
.rank-avatar { width: 28px; height: 28px; border-radius: 50%; color: #fff; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rank-info  { min-width: 80px; }
.rank-name  { font-size: 12.5px; font-weight: 600; color: #0f172a; }
.rank-sub   { font-size: 11px; color: #94a3b8; }
.rank-bar-wrap { flex: 1; height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
.rank-bar   { height: 100%; border-radius: 10px; transition: width .4s; }
</style>
