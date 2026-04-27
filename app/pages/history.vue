<template>
  <div class="history-page">

    <!-- Header row -->
    <div class="page-header">
      <h1 class="page-title">Scan History</h1>
      <span class="record-count">{{ filtered.length }} records</span>
    </div>

    <!-- Search + Filter row -->
    <div class="controls-row">
      <!-- Search -->
      <div class="search-box">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search mushroom name…"
        />
      </div>

      <!-- Filter chips -->
      <div class="filter-chips">
        <button
          v-for="f in filters"
          :key="f.value"
          class="chip"
          :class="{ 'chip--active': activeFilter === f.value }"
          @click="activeFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Scan list -->
    <div v-if="filtered.length" class="scan-list">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="scan-card"
      >
        <!-- Thumbnail -->
        <div class="card-thumb">
          <img :src="item.image" :alt="item.name" />
        </div>

        <!-- Main info -->
        <div class="card-body">
          <div class="card-top">
            <p class="card-name">{{ item.name }}</p>
            <span
              class="badge"
              :class="item.classification === 'Edible' ? 'badge--edible' : 'badge--poisonous'"
            >
              {{ item.classification === 'Edible' ? '✅' : '☠️' }} {{ item.classification }}
            </span>
          </div>

          <div class="card-meta">
            <span class="meta-item">
              <!-- confidence -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              {{ item.confidence }}% confidence
            </span>
            <span class="meta-item">
              <!-- calendar -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {{ item.date }}
            </span>
            <span class="meta-item">
              <!-- pin -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ item.location }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="card-actions">
          <button class="action-btn action-btn--view" title="View details">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button class="action-btn action-btn--delete" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <div class="empty-icon">🍄</div>
      <p class="empty-title">No scans found</p>
      <p class="empty-sub">Try a different search or scan your first mushroom!</p>
      <NuxtLink to="/scan" class="empty-btn">Go to Scan</NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

// ── Filters ───────────────────────────────────────────
const filters = [
  { label: 'All',       value: 'all' },
  { label: '✅ Edible', value: 'Edible' },
  { label: '☠️ Poisonous', value: 'Poisonous' },
]
const activeFilter = ref('all')
const search = ref('')

// ── Static scan data (replace with API call) ──────────
const scans = [
  {
    id: 1,
    name: 'Volvariella volvacea',
    classification: 'Edible',
    confidence: 94,
    date: 'Apr 27, 2026 · 3:45 PM',
    location: 'Quezon City, PH',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Volvariella_volvacea_01.jpg/320px-Volvariella_volvacea_01.jpg',
  },
  {
    id: 2,
    name: 'Amanita phalloides',
    classification: 'Poisonous',
    confidence: 88,
    date: 'Apr 25, 2026 · 10:12 AM',
    location: 'Baguio City, PH',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Amanita_phalloides_1.JPG/320px-Amanita_phalloides_1.JPG',
  },
  {
    id: 3,
    name: 'Lentinula edodes',
    classification: 'Edible',
    confidence: 97,
    date: 'Apr 24, 2026 · 2:00 PM',
    location: 'Benguet, PH',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Shiitakemushroom.jpg/320px-Shiitakemushroom.jpg',
  },
  {
    id: 4,
    name: 'Galerina marginata',
    classification: 'Poisonous',
    confidence: 81,
    date: 'Apr 22, 2026 · 8:30 AM',
    location: 'Mount Makiling, PH',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Galerina_marginata_8946.jpg/320px-Galerina_marginata_8946.jpg',
  },
  {
    id: 5,
    name: 'Pleurotus ostreatus',
    classification: 'Edible',
    confidence: 96,
    date: 'Apr 20, 2026 · 4:15 PM',
    location: 'Laguna, PH',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Oyster_mushroom_%28Pleurotus_ostreatus%29.jpg/320px-Oyster_mushroom_%28Pleurotus_ostreatus%29.jpg',
  },
]

// ── Computed filtered list ────────────────────────────
const filtered = computed(() =>
  scans.filter(s => {
    const matchesFilter = activeFilter.value === 'all' || s.classification === activeFilter.value
    const matchesSearch = s.name.toLowerCase().includes(search.value.toLowerCase())
    return matchesFilter && matchesSearch
  })
)
</script>

<style scoped>
/* ── Page ──────────────────────────────────────────── */
.history-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ── Header ────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
}

.record-count {
  font-size: 13px;
  color: var(--color-text-muted);
  background: var(--color-hover-bg);
  padding: 2px 10px;
  border-radius: 20px;
}

/* ── Controls row ──────────────────────────────────── */
.controls-row {
  display: flex;
  align-items: center;
  gap: 12px;
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
  min-width: 200px;
}

.search-icon {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

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

.filter-chips {
  display: flex;
  gap: 8px;
}

.chip {
  padding: 7px 16px;
  border-radius: 20px;
  border: 1px solid var(--color-sidebar-border);
  background: #fff;
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.18s;
  font-weight: 500;
}

.chip:hover { background: var(--color-hover-bg); color: var(--color-text); }

.chip--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

/* ── Scan list ─────────────────────────────────────── */
.scan-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Scan card ─────────────────────────────────────── */
.scan-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border: 1px solid var(--color-sidebar-border);
  border-radius: 12px;
  padding: 14px 16px;
  transition: box-shadow 0.18s, transform 0.18s;
}

.scan-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  transform: translateY(-1px);
}

/* Thumbnail */
.card-thumb {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-hover-bg);
}

.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Body */
.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  font-style: italic;
}

.badge {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

.badge--edible {
  background: #dcfce7;
  color: #166534;
}

.badge--poisonous {
  background: #fee2e2;
  color: #991b1b;
}

/* Meta */
.card-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: var(--color-text-muted);
}

.meta-item svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

/* Actions */
.card-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--color-sidebar-border);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s;
}

.action-btn svg {
  width: 15px;
  height: 15px;
}

.action-btn--view { color: var(--color-primary-dark); }
.action-btn--view:hover { background: #dcfce7; border-color: var(--color-primary); }

.action-btn--delete { color: #dc2626; }
.action-btn--delete:hover { background: #fee2e2; border-color: #fca5a5; }

/* ── Empty state ───────────────────────────────────── */
.empty-state {
  flex: 1;
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

.empty-icon { font-size: 52px; line-height: 1; }

.empty-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);
}

.empty-sub {
  font-size: 13.5px;
  color: var(--color-text-muted);
}

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
