<template>
  <div class="species-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Species Database</h1>
        <p class="page-sub">{{ species.length }} mushroom species on record</p>
      </div>
      <div class="header-actions">
        <div class="search-wrap">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" class="search-input" placeholder="Search species…" />
        </div>
        <select v-model="clsFilter" class="filter-select">
          <option value="">All Classifications</option>
          <option value="edible">Edible</option>
          <option value="poisonous">Poisonous</option>
          <option value="unknown">Unknown</option>
        </select>
        <button class="add-btn" @click="openAdd">+ Add Species</button>
      </div>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Scientific Name</th>
            <th>Common Name</th>
            <th>Classification</th>
            <th>Region</th>
            <th>Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sp in filteredSpecies" :key="sp.id">
            <td class="td-id">{{ sp.id }}</td>
            <td class="td-sci">{{ sp.scientific }}</td>
            <td>{{ sp.common }}</td>
            <td><span class="class-chip" :class="`class-chip--${sp.cls}`">{{ sp.cls }}</span></td>
            <td class="td-region">{{ sp.region }}</td>
            <td class="td-date">{{ sp.added }}</td>
            <td>
              <div class="action-btns">
                <button class="act-btn" title="Edit" @click="openEdit(sp)">✏️</button>
                <button class="act-btn act-btn--del" title="Delete" @click="deleteSpecies(sp)">🗑</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="table-footer">
        <span class="table-count">{{ filteredSpecies.length }} of {{ species.length }} species</span>
        <div class="pagination">
          <button class="page-btn" :disabled="page <= 1" @click="page--">‹</button>
          <span class="page-info">Page {{ page }} of {{ totalPages }}</span>
          <button class="page-btn" :disabled="page >= totalPages" @click="page++">›</button>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <p class="modal-title">{{ editingId ? 'Edit Species' : 'Add New Species' }}</p>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Scientific Name *</label>
              <input v-model="form.scientific" class="form-input" placeholder="e.g. Volvariella volvacea" />
            </div>
            <div class="form-group">
              <label class="form-label">Common Name *</label>
              <input v-model="form.common" class="form-input" placeholder="e.g. Paddy Straw Mushroom" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Classification *</label>
              <select v-model="form.cls" class="form-select">
                <option value="">Select…</option>
                <option value="edible">Edible</option>
                <option value="poisonous">Poisonous</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Region</label>
              <input v-model="form.region" class="form-input" placeholder="e.g. Southeast Asia" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea v-model="form.description" class="form-textarea" rows="3" placeholder="Brief description…" />
          </div>
          <div class="modal-actions">
            <button class="cancel-btn" @click="closeModal">Cancel</button>
            <button class="save-btn" @click="saveSpecies">{{ editingId ? 'Update' : 'Add Species' }}</button>
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
const page        = ref(1)
const perPage     = 10
const showModal   = ref(false)
const editingId   = ref<number | null>(null)

const form = reactive({ scientific: '', common: '', cls: '', region: '', description: '' })

interface Species { id: number; scientific: string; common: string; cls: string; region: string; added: string; description: string }

const species = ref<Species[]>([
  { id: 1,  scientific: 'Volvariella volvacea',   common: 'Paddy Straw Mushroom',    cls: 'edible',    region: 'Southeast Asia',      added: 'Jan 10, 2026', description: '' },
  { id: 2,  scientific: 'Amanita phalloides',     common: 'Death Cap',               cls: 'poisonous', region: 'Europe, North America', added: 'Jan 12, 2026', description: '' },
  { id: 3,  scientific: 'Pleurotus ostreatus',    common: 'Oyster Mushroom',          cls: 'edible',    region: 'Global',              added: 'Jan 15, 2026', description: '' },
  { id: 4,  scientific: 'Lentinula edodes',       common: 'Shiitake',                cls: 'edible',    region: 'East Asia',           added: 'Jan 20, 2026', description: '' },
  { id: 5,  scientific: 'Ganoderma lucidum',      common: 'Reishi / Lingzhi',        cls: 'edible',    region: 'Asia',                added: 'Feb 3, 2026',  description: '' },
  { id: 6,  scientific: 'Cortinarius rubellus',   common: 'Deadly Webcap',           cls: 'poisonous', region: 'Northern Europe',     added: 'Feb 8, 2026',  description: '' },
  { id: 7,  scientific: 'Auricularia auricula',   common: 'Wood Ear',                cls: 'edible',    region: 'Asia',                added: 'Feb 14, 2026', description: '' },
  { id: 8,  scientific: 'Trametes versicolor',    common: 'Turkey Tail',             cls: 'edible',    region: 'Global',              added: 'Feb 22, 2026', description: '' },
  { id: 9,  scientific: 'Amanita muscaria',       common: 'Fly Agaric',              cls: 'poisonous', region: 'Northern Hemisphere', added: 'Mar 1, 2026',  description: '' },
  { id: 10, scientific: 'Morchella esculenta',    common: 'Morel',                   cls: 'edible',    region: 'North America, Europe', added: 'Mar 5, 2026', description: '' },
])

let nextId = 11

const filteredSpecies = computed(() => species.value.filter(s => {
  const q = searchQuery.value.toLowerCase()
  const matchQ = !q || s.scientific.toLowerCase().includes(q) || s.common.toLowerCase().includes(q)
  const matchC = !clsFilter.value || s.cls === clsFilter.value
  return matchQ && matchC
}))

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSpecies.value.length / perPage)))

function openAdd() {
  editingId.value = null
  Object.assign(form, { scientific: '', common: '', cls: '', region: '', description: '' })
  showModal.value = true
}

function openEdit(sp: Species) {
  editingId.value = sp.id
  Object.assign(form, { scientific: sp.scientific, common: sp.common, cls: sp.cls, region: sp.region, description: sp.description })
  showModal.value = true
}

function saveSpecies() {
  if (!form.scientific || !form.common || !form.cls) {
    alert('Please fill in required fields.')
    return
  }
  if (editingId.value) {
    const idx = species.value.findIndex(s => s.id === editingId.value)
    if (idx !== -1) Object.assign(species.value[idx], { ...form })
  } else {
    species.value.unshift({ id: nextId++, ...form, added: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) })
  }
  closeModal()
}

function closeModal() { showModal.value = false }

function deleteSpecies(sp: Species) {
  if (confirm(`Delete "${sp.scientific}"?`)) {
    species.value = species.value.filter(s => s.id !== sp.id)
  }
}
</script>

<style scoped>
.species-page { display: flex; flex-direction: column; gap: 22px; }
.page-header  { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.page-title   { font-size: 22px; font-weight: 700; color: #0f172a; }
.page-sub     { font-size: 13.5px; color: #64748b; margin-top: 3px; }
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.search-wrap  { position: relative; }
.search-icon  { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: #94a3b8; }
.search-input { padding: 8px 12px 8px 32px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13.5px; font-family: inherit; color: #0f172a; background: #fff; outline: none; width: 200px; }
.search-input:focus { border-color: #10b981; }
.filter-select { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13.5px; font-family: inherit; background: #fff; cursor: pointer; outline: none; }
.add-btn { padding: 8px 18px; border-radius: 8px; background: linear-gradient(135deg,#10b981,#059669); color: #fff; border: none; font-size: 13.5px; font-weight: 600; font-family: inherit; cursor: pointer; transition: opacity .18s; }
.add-btn:hover { opacity: .88; }

.table-card  { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
.data-table  { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; font-size: 11.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; padding: 12px 14px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
.data-table td { padding: 11px 14px; font-size: 13px; color: #334155; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #f8fafc; }
.td-id      { font-family: monospace; font-size: 12px; color: #94a3b8; }
.td-sci     { font-style: italic; font-weight: 600; color: #0f172a; }
.td-region  { font-size: 12.5px; color: #64748b; }
.td-date    { font-size: 12.5px; color: #94a3b8; white-space: nowrap; }
.class-chip  { padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; text-transform: capitalize; }
.class-chip--edible    { background: #d1fae5; color: #065f46; }
.class-chip--poisonous { background: #fee2e2; color: #991b1b; }
.class-chip--unknown   { background: #fef3c7; color: #92400e; }
.action-btns { display: flex; gap: 6px; }
.act-btn     { width: 30px; height: 30px; border-radius: 7px; border: 1px solid #e2e8f0; background: #f8fafc; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; transition: background .18s; }
.act-btn:hover     { background: #f1f5f9; }
.act-btn--del:hover { background: #fee2e2; border-color: #fecaca; }

.table-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid #f1f5f9; }
.table-count  { font-size: 12.5px; color: #64748b; }
.pagination   { display: flex; align-items: center; gap: 10px; }
.page-btn     { width: 30px; height: 30px; border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; font-size: 14px; color: #475569; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-btn:not(:disabled):hover { background: #f1f5f9; }
.page-info    { font-size: 12.5px; color: #475569; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(2px); }
.modal  { background: #fff; border-radius: 16px; width: 560px; max-width: 95vw; box-shadow: 0 20px 60px rgba(0,0,0,.2); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #f1f5f9; }
.modal-title  { font-size: 15px; font-weight: 700; color: #0f172a; }
.modal-close  { background: transparent; border: none; cursor: pointer; font-size: 16px; color: #94a3b8; }
.modal-close:hover { color: #ef4444; }
.modal-body   { padding: 22px; display: flex; flex-direction: column; gap: 16px; }
.form-row     { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group   { display: flex; flex-direction: column; gap: 6px; }
.form-label   { font-size: 12.5px; font-weight: 600; color: #475569; }
.form-input,
.form-select  { padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13.5px; font-family: inherit; color: #0f172a; background: #fff; outline: none; transition: border-color .18s; }
.form-input:focus,
.form-select:focus { border-color: #10b981; }
.form-textarea { padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13.5px; font-family: inherit; color: #0f172a; resize: vertical; outline: none; }
.form-textarea:focus { border-color: #10b981; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
.cancel-btn   { padding: 9px 20px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; font-size: 13.5px; font-weight: 500; font-family: inherit; cursor: pointer; color: #475569; }
.save-btn     { padding: 9px 20px; border-radius: 8px; background: linear-gradient(135deg,#10b981,#059669); color: #fff; border: none; font-size: 13.5px; font-weight: 600; font-family: inherit; cursor: pointer; }
</style>
