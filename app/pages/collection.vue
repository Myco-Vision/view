<template>
  <div class="collection-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Welcome, <strong>{{ firstName }}!</strong></h1>
        <p class="page-sub">Your Mushroom Collection</p>
      </div>
      <span class="total-badge">{{ filtered.length }} mushrooms</span>
    </div>

    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat-card stat-card--total">
        <span class="stat-icon">🍄</span>
        <div>
          <p class="stat-num">{{ collection.length }}</p>
          <p class="stat-label">Total Collected</p>
        </div>
      </div>
      <div class="stat-card stat-card--edible">
        <span class="stat-icon">✅</span>
        <div>
          <p class="stat-num">{{ edibleCount }}</p>
          <p class="stat-label">Edible</p>
        </div>
      </div>
      <div class="stat-card stat-card--poisonous">
        <span class="stat-icon">☠️</span>
        <div>
          <p class="stat-num">{{ poisonousCount }}</p>
          <p class="stat-label">Poisonous</p>
        </div>
      </div>
      <div class="stat-card stat-card--accuracy">
        <span class="stat-icon">🎯</span>
        <div>
          <p class="stat-num">{{ avgConfidence }}%</p>
          <p class="stat-label">Avg. Confidence</p>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="controls-row">
      <!-- Search -->
      <div class="search-box">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search mushrooms…" class="search-input" />
      </div>

      <!-- Filter chips -->
      <div class="filter-chips">
        <button
          v-for="f in filters"
          :key="f.value"
          class="chip"
          :class="{ 'chip--active': activeFilter === f.value }"
          @click="activeFilter = f.value"
        >{{ f.label }}</button>
      </div>

      <!-- Sort -->
      <select v-model="sortBy" class="sort-select">
        <option value="date">Newest first</option>
        <option value="name">Name A–Z</option>
        <option value="confidence">Confidence ↓</option>
      </select>
    </div>

    <!-- Grid -->
    <div v-if="filtered.length" class="mushroom-grid">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="mushroom-card"
      >
        <!-- Image area -->
        <div class="card-img-wrap">
          <img :src="item.image" :alt="item.name" class="card-img" />
          <!-- classification ribbon -->
          <span
            class="ribbon"
            :class="item.classification === 'Edible' ? 'ribbon--edible' : 'ribbon--poisonous'"
          >
            {{ item.classification === 'Edible' ? '✅ Edible' : '☠️ Poisonous' }}
          </span>
          <!-- hover overlay -->
          <div class="card-overlay">
            <button class="overlay-btn" title="View details">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              View
            </button>
            <button class="overlay-btn overlay-btn--danger" title="Remove from collection">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
              Remove
            </button>
          </div>
        </div>

        <!-- Card body -->
        <div class="card-body">
          <p class="card-name">{{ item.name }}</p>

          <!-- Confidence bar -->
          <div class="confidence-row">
            <span class="confidence-label">Confidence</span>
            <div class="confidence-bar-wrap">
              <div
                class="confidence-bar"
                :style="{ width: item.confidence + '%' }"
                :class="item.confidence >= 90 ? 'bar--high' : item.confidence >= 75 ? 'bar--mid' : 'bar--low'"
              />
            </div>
            <span class="confidence-pct">{{ item.confidence }}%</span>
          </div>

          <!-- Meta -->
          <div class="card-meta">
            <span class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ item.location }}
            </span>
            <span class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {{ item.date }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <div class="empty-icon">🍄</div>
      <p class="empty-title">No mushrooms found</p>
      <p class="empty-sub">Start scanning mushrooms and save them to your collection!</p>
      <NuxtLink to="/scan" class="empty-btn">Scan a Mushroom</NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const firstName = 'Maria'

// ── Filters & sort ────────────────────────────────────
const filters = [
  { label: 'All',           value: 'all' },
  { label: '✅ Edible',     value: 'Edible' },
  { label: '☠️ Poisonous',  value: 'Poisonous' },
]
const activeFilter = ref('all')
const search = ref('')
const sortBy = ref('date')

// ── Static collection data ────────────────────────────
const collection = [
  {
    id: 1,
    name: 'Volvariella volvacea',
    classification: 'Edible',
    confidence: 94,
    location: 'Quezon City, PH',
    date: 'Apr 27, 2026',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Volvariella_volvacea_01.jpg/400px-Volvariella_volvacea_01.jpg',
  },
  {
    id: 2,
    name: 'Amanita muscaria',
    classification: 'Poisonous',
    confidence: 89,
    location: 'Baguio City, PH',
    date: 'Apr 25, 2026',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Fly_agaric_at_Bramshaw_Wood.jpg/400px-Fly_agaric_at_Bramshaw_Wood.jpg',
  },
  {
    id: 3,
    name: 'Pleurotus ostreatus',
    classification: 'Edible',
    confidence: 91,
    location: 'Laguna, PH',
    date: 'Apr 24, 2026',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Oyster_mushroom_%28Pleurotus_ostreatus%29.jpg/400px-Oyster_mushroom_%28Pleurotus_ostreatus%29.jpg',
  },
  {
    id: 4,
    name: 'Lentinula edodes',
    classification: 'Edible',
    confidence: 97,
    location: 'Benguet, PH',
    date: 'Apr 22, 2026',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Shiitakemushroom.jpg/400px-Shiitakemushroom.jpg',
  },
  {
    id: 5,
    name: 'Galerina marginata',
    classification: 'Poisonous',
    confidence: 81,
    location: 'Mt. Makiling, PH',
    date: 'Apr 20, 2026',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Galerina_marginata_8946.jpg/400px-Galerina_marginata_8946.jpg',
  },
  {
    id: 6,
    name: 'Agaricus bisporus',
    classification: 'Edible',
    confidence: 98,
    location: 'Cavite, PH',
    date: 'Apr 18, 2026',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Agaricus_bisporus_%28common_mushroom%29.jpg/400px-Agaricus_bisporus_%28common_mushroom%29.jpg',
  },
]

// ── Computed ──────────────────────────────────────────
const edibleCount    = computed(() => collection.filter(m => m.classification === 'Edible').length)
const poisonousCount = computed(() => collection.filter(m => m.classification === 'Poisonous').length)
const avgConfidence  = computed(() =>
  Math.round(collection.reduce((sum, m) => sum + m.confidence, 0) / collection.length)
)

const filtered = computed(() => {
  let list = collection.filter(m => {
    const matchFilter = activeFilter.value === 'all' || m.classification === activeFilter.value
    const matchSearch = m.name.toLowerCase().includes(search.value.toLowerCase())
    return matchFilter && matchSearch
  })
  if (sortBy.value === 'name')       list = [...list].sort((a,b) => a.name.localeCompare(b.name))
  if (sortBy.value === 'confidence') list = [...list].sort((a,b) => b.confidence - a.confidence)
  return list
})
</script>

<style scoped>
/* ── Page ──────────────────────────────────────────── */
.collection-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ── Header ────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.page-title {
  font-size: 22px;
  font-weight: 400;
  color: var(--color-text);
}
.page-title strong { font-weight: 700; }

.page-sub {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.total-badge {
  font-size: 13px;
  font-weight: 500;
  background: var(--color-hover-bg);
  color: var(--color-text-muted);
  padding: 4px 14px;
  border-radius: 20px;
  margin-top: 4px;
}

/* ── Stats row ─────────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--color-sidebar-border);
}

.stat-icon { font-size: 26px; line-height: 1; }

.stat-num {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 3px;
}

.stat-card--edible    { border-left: 3px solid #22c55e; }
.stat-card--poisonous { border-left: 3px solid #ef4444; }
.stat-card--accuracy  { border-left: 3px solid var(--color-primary); }
.stat-card--total     { border-left: 3px solid #a78bfa; }

/* ── Controls ──────────────────────────────────────── */
.controls-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--color-sidebar-border);
  border-radius: 10px;
  padding: 8px 14px;
  flex: 1;
  min-width: 180px;
}

.search-icon { width: 15px; height: 15px; color: var(--color-text-muted); flex-shrink: 0; }

.search-input {
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 13.5px;
  color: var(--color-text);
  background: transparent;
  width: 100%;
}
.search-input::placeholder { color: var(--color-text-muted); }

.filter-chips { display: flex; gap: 6px; }

.chip {
  padding: 7px 14px;
  border-radius: 20px;
  border: 1px solid var(--color-sidebar-border);
  background: #fff;
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.18s;
  font-weight: 500;
  white-space: nowrap;
}
.chip:hover { background: var(--color-hover-bg); color: var(--color-text); }
.chip--active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }

.sort-select {
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid var(--color-sidebar-border);
  background: #fff;
  font-family: inherit;
  font-size: 13px;
  color: var(--color-text);
  cursor: pointer;
  outline: none;
}

/* ── Grid ──────────────────────────────────────────── */
.mushroom-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

/* ── Card ──────────────────────────────────────────── */
.mushroom-card {
  background: #fff;
  border: 1px solid var(--color-sidebar-border);
  border-radius: 14px;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}
.mushroom-card:hover {
  box-shadow: 0 6px 24px rgba(0,0,0,0.09);
  transform: translateY(-2px);
}

/* Image */
.card-img-wrap {
  position: relative;
  height: 160px;
  overflow: hidden;
  background: #e8f0e8;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}
.mushroom-card:hover .card-img { transform: scale(1.04); }

/* Ribbon */
.ribbon {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
}
.ribbon--edible    { background: rgba(220,252,231,0.92); color: #166534; }
.ribbon--poisonous { background: rgba(254,226,226,0.92); color: #991b1b; }

/* Hover overlay */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.2s;
}
.mushroom-card:hover .card-overlay { opacity: 1; }

.overlay-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 8px;
  border: none;
  font-size: 12.5px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  background: #fff;
  color: var(--color-text);
  transition: background 0.18s;
}
.overlay-btn svg { width: 14px; height: 14px; }
.overlay-btn:hover { background: #f0fdf4; }
.overlay-btn--danger { background: #fee2e2; color: #991b1b; }
.overlay-btn--danger:hover { background: #fecaca; }

/* Card body */
.card-body {
  padding: 14px 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-text);
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Confidence bar */
.confidence-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-label {
  font-size: 11px;
  color: var(--color-text-muted);
  min-width: 64px;
}

.confidence-bar-wrap {
  flex: 1;
  height: 6px;
  background: #e8f0e8;
  border-radius: 10px;
  overflow: hidden;
}

.confidence-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 0.4s ease;
}
.bar--high { background: #22c55e; }
.bar--mid  { background: #f59e0b; }
.bar--low  { background: #ef4444; }

.confidence-pct {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  min-width: 32px;
  text-align: right;
}

/* Meta */
.card-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--color-text-muted);
}
.meta-item svg { width: 12px; height: 12px; flex-shrink: 0; }

/* ── Empty state ───────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 20px;
  text-align: center;
  background: #fff;
  border: 1px solid var(--color-sidebar-border);
  border-radius: 14px;
}
.empty-icon   { font-size: 52px; line-height: 1; }
.empty-title  { font-size: 17px; font-weight: 600; color: var(--color-text); }
.empty-sub    { font-size: 13.5px; color: var(--color-text-muted); }
.empty-btn {
  margin-top: 8px;
  padding: 10px 24px;
  border-radius: 10px;
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.18s;
}
.empty-btn:hover { background: var(--color-primary-dark); }
</style>
