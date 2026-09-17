<template>
  <div class="flex flex-col gap-[22px]">
    <!-- Page Header & Tab Navigation -->
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">Species Database</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">
          Manage verified database species and review user-scanned research candidate data.
        </p>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
        <div class="relative">
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#94a3b8]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" class="py-2 pr-3 pl-8 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none w-[200px] transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="Search species…" />
        </div>
        <select v-model="clsFilter" class="py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans bg-white cursor-pointer outline-none">
          <option value="">All Classifications</option>
          <option value="edible">Edible</option>
          <option value="poisonous">Poisonous</option>
          <option value="unknown">Unknown</option>
        </select>
        <button v-if="activeTab === 'verified'" class="py-2 px-[18px] rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-90" @click="openAdd">+ Add Species</button>
      </div>
    </div>

    <!-- Tabs Navigation Bar -->
    <div class="flex items-center gap-2 border-b border-[#e2e8f0]">
      <button 
        class="py-2.5 px-4 text-[14px] font-semibold transition-colors duration-200 border-b-2 -mb-[1px] cursor-pointer flex items-center gap-2"
        :class="activeTab === 'verified' ? 'border-[#10b981] text-[#10b981]' : 'border-transparent text-[#64748b] hover:text-[#0f172a]'"
        @click="activeTab = 'verified'"
      >
        <span>📚 Verified Species (In DB)</span>
        <span class="py-0.5 px-2 rounded-full text-[11px] bg-[#f1f5f9] text-[#475569]">{{ species.length }}</span>
      </button>
      
      <button 
        class="py-2.5 px-4 text-[14px] font-semibold transition-colors duration-200 border-b-2 -mb-[1px] cursor-pointer flex items-center gap-2"
        :class="activeTab === 'candidates' ? 'border-[#10b981] text-[#10b981]' : 'border-transparent text-[#64748b] hover:text-[#0f172a]'"
        @click="activeTab = 'candidates'"
      >
        <span>🔬 Candidate Scans (New Data - Not in DB)</span>
        <span class="py-0.5 px-2 rounded-full text-[11px] bg-[#d1fae5] text-[#065f46] font-bold">{{ candidateScans.length }}</span>
      </button>
    </div>

    <!-- Tab 1: Verified Species Table ("Old Data in DB") -->
    <div v-if="activeTab === 'verified'" class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">#</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Scientific Name</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Common Name</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Classification</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Habitat / Region</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Added</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="text-center">
              <td colspan="7" class="py-8 text-[#64748b] text-[13.5px]">Loading species database...</td>
            </tr>
            <tr v-else-if="filteredSpecies.length === 0" class="text-center">
              <td colspan="7" class="py-8 text-[#64748b] text-[13.5px]">No verified species found on record.</td>
            </tr>
            <tr v-for="sp in filteredSpecies" :key="sp.id" class="hover:bg-[#f8fafc] group">
              <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle font-mono text-[12px] text-[#94a3b8] group-last:border-none">{{ sp.id }}</td>
              <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle italic font-semibold text-[#0f172a] group-last:border-none">{{ sp.scientific_name || sp.name }}</td>
              <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">{{ sp.name }}</td>
              <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
                <span class="py-[3px] px-2.5 rounded-[20px] text-[11.5px] font-semibold capitalize" :class="sp.classification === 'edible' ? 'bg-[#d1fae5] text-[#065f46]' : (sp.classification === 'poisonous' ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#fef3c7] text-[#92400e]')">{{ sp.classification }}</span>
              </td>
              <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle text-[12.5px] text-[#64748b] group-last:border-none">{{ sp.habitat || 'Global' }}</td>
              <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle text-[12.5px] text-[#94a3b8] whitespace-nowrap group-last:border-none">{{ formatDate(sp.created_at) }}</td>
              <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
                <div class="flex gap-1.5">
                  <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#f8fafc] cursor-pointer text-[13px] flex items-center justify-center transition-colors duration-[0.18s] hover:bg-[#f1f5f9]" title="Edit" @click="openEdit(sp)">✏️</button>
                  <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#f8fafc] cursor-pointer text-[13px] flex items-center justify-center transition-colors duration-[0.18s] hover:bg-[#fee2e2] hover:border-[#fecaca]" title="Delete" @click="deleteSpecies(sp)">🗑</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between py-3 px-4 border-t border-[#f1f5f9]">
        <span class="text-[12.5px] text-[#64748b]">{{ filteredSpecies.length }} of {{ species.length }} species</span>
      </div>
    </div>

    <!-- Tab 2: Candidate Scans Table ("New Data - Not in DB") -->
    <div v-if="activeTab === 'candidates'" class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
      <div class="bg-[#f8fafc] p-3.5 border-b border-[#f1f5f9] flex items-center justify-between">
        <p class="text-[12.5px] text-[#475569]">
          Showing user scans where <strong class="text-[#059669]">Share Data for Research</strong> is enabled. Admins can promote valid candidate scans into official DB species.
        </p>
        <button class="py-1.5 px-3 rounded-lg border border-[#e2e8f0] bg-white text-[12px] font-medium text-[#475569] cursor-pointer hover:bg-[#f1f5f9]" @click="fetchCandidateScans">🔄 Refresh</button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Image</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Detected Species</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Classification</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Scanned By</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Location / Coords</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Consent Status</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loadingCandidates" class="text-center">
              <td colspan="7" class="py-8 text-[#64748b] text-[13.5px]">Loading consented research candidate scans...</td>
            </tr>
            <tr v-else-if="filteredCandidates.length === 0" class="text-center">
              <td colspan="7" class="py-8 text-[#64748b] text-[13.5px]">No candidate scans found from opted-in users yet.</td>
            </tr>
            <tr v-for="scan in filteredCandidates" :key="scan.id" class="hover:bg-[#f8fafc] group">
              <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle">
                <img :src="getImageUrl(scan.image_path)" class="w-11 h-11 rounded-lg object-cover border border-[#e2e8f0]" />
              </td>
              <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle">
                <p class="font-semibold text-[#0f172a] text-[13.5px]">{{ scan.result_name }}</p>
                <p class="text-[11.5px] text-[#64748b]">Confidence: {{ scan.confidence_level }}%</p>
              </td>
              <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle">
                <span class="py-[3px] px-2.5 rounded-[20px] text-[11.5px] font-semibold capitalize" :class="scan.result_classification === 'edible' ? 'bg-[#d1fae5] text-[#065f46]' : (scan.result_classification === 'poisonous' ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#fef3c7] text-[#92400e]')">{{ scan.result_classification }}</span>
              </td>
              <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle text-[12.5px] text-[#334155]">
                <p class="font-medium text-[#0f172a]">{{ scan.user?.name || 'Anonymous User' }}</p>
                <p class="text-[11.5px] text-[#94a3b8]">{{ scan.user?.email }}</p>
              </td>
              <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle text-[12px] text-[#64748b]">
                <span v-if="scan.latitude && scan.longitude">📍 {{ scan.latitude }}, {{ scan.longitude }}</span>
                <span v-else class="text-[#94a3b8]">No GPS Data</span>
              </td>
              <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle">
                <span class="py-1 px-2.5 rounded-full text-[11px] font-bold bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] inline-flex items-center gap-1">
                  ✓ Consented for ML
                </span>
              </td>
              <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle">
                <button 
                  class="py-1.5 px-3 rounded-lg bg-[#10b981] text-white text-[12px] font-semibold border-none cursor-pointer hover:bg-[#059669] transition-colors"
                  @click="openPromoteModal(scan)"
                >
                  ➕ Add to Species DB
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Species Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-[2px]" @click.self="closeModal">
      <div class="bg-white rounded-2xl w-[560px] max-w-[95vw] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <div class="flex items-center justify-between py-[18px] px-[22px] border-b border-[#f1f5f9]">
          <p class="text-[15px] font-bold text-[#0f172a]">{{ promoteScanId ? 'Promote Scan to Official Species DB' : (editingId ? 'Edit Species' : 'Add New Species') }}</p>
          <button class="bg-transparent border-none cursor-pointer text-[16px] text-[#94a3b8] hover:text-[#ef4444]" @click="closeModal">✕</button>
        </div>
        <div class="p-[22px] flex flex-col gap-4">
          <div v-if="form.image_path" class="flex items-center gap-3 p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
            <img :src="getImageUrl(form.image_path)" class="w-14 h-14 rounded-lg object-cover border" />
            <div>
              <p class="text-[12px] font-bold text-[#0f172a]">Candidate Photo Attached</p>
              <p class="text-[11.5px] text-[#64748b]">This photo will be saved as the reference image for this DB species.</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Scientific Name *</label>
              <input v-model="form.scientific_name" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="e.g. Volvariella volvacea" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Common Name *</label>
              <input v-model="form.name" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="e.g. Paddy Straw Mushroom" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Classification *</label>
              <select v-model="form.classification" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]">
                <option value="">Select…</option>
                <option value="edible">Edible</option>
                <option value="poisonous">Poisonous</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Habitat / Region</label>
              <input v-model="form.habitat" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="e.g. Southeast Asia" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#475569]">Description</label>
            <textarea v-model="form.description" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none resize-y transition-colors duration-[0.18s] focus:border-[#10b981]" rows="3" placeholder="Brief description…" />
          </div>
          <div class="flex justify-end gap-2.5 pt-1">
            <button class="py-[9px] px-5 rounded-lg border border-[#e2e8f0] bg-white text-[13.5px] font-medium font-sans cursor-pointer text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f8fafc]" @click="closeModal">Cancel</button>
            <button class="py-[9px] px-5 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-90" @click="saveSpecies">{{ promoteScanId ? 'Confirm & Save to DB' : (editingId ? 'Update' : 'Add Species') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ 
  layout: 'admin',
  middleware: 'role',
  roles: ['admin', 'super_admin'],
})

const config = useRuntimeConfig()
const activeTab = ref<'verified' | 'candidates'>('verified')

const searchQuery = ref('')
const clsFilter   = ref('')
const loading     = ref(false)
const loadingCandidates = ref(false)
const showModal   = ref(false)
const editingId   = ref<number | null>(null)
const promoteScanId = ref<number | null>(null)

interface Species {
  id: number
  name: string
  scientific_name?: string
  classification: string
  habitat?: string
  description?: string
  image_path?: string
  created_at?: string
}

interface ScanCandidate {
  id: number
  result_name: string
  result_classification: string
  confidence_level: number
  latitude?: number
  longitude?: number
  image_path: string
  created_at: string
  user?: { id: number; name: string; email: string }
}

const species = ref<Species[]>([])
const candidateScans = ref<ScanCandidate[]>([])

const form = reactive({
  name: '',
  scientific_name: '',
  classification: '',
  habitat: '',
  description: '',
  image_path: ''
})

onMounted(() => {
  fetchVerifiedSpecies()
  fetchCandidateScans()
})

async function fetchVerifiedSpecies() {
  loading.value = true
  try {
    const data = await $fetch<Species[]>(`${config.public.apiBase}/species`)
    species.value = data
  } catch (err) {
    console.error('Failed to fetch verified species:', err)
  } finally {
    loading.value = false
  }
}

async function fetchCandidateScans() {
  loadingCandidates.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch<any>(`${config.public.apiBase}/admin/scans?only_consented=1`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const rawData = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : [])
    candidateScans.value = rawData
  } catch (err) {
    console.error('Failed to fetch candidate scans:', err)
  } finally {
    loadingCandidates.value = false
  }
}

const filteredSpecies = computed(() => species.value.filter(s => {
  const q = searchQuery.value.toLowerCase()
  const sName = (s.scientific_name || s.name || '').toLowerCase()
  const cName = (s.name || '').toLowerCase()
  const matchQ = !q || sName.includes(q) || cName.includes(q)
  const matchC = !clsFilter.value || s.classification === clsFilter.value
  return matchQ && matchC
}))

const filteredCandidates = computed(() => candidateScans.value.filter(c => {
  const q = searchQuery.value.toLowerCase()
  const matchQ = !q || (c.result_name || '').toLowerCase().includes(q)
  const matchC = !clsFilter.value || c.result_classification === clsFilter.value
  return matchQ && matchC
}))

function getImageUrl(path?: string) {
  if (!path) return 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=150&q=80'
  if (path.startsWith('http')) return path
  return `${config.public.apiBase.replace('/api', '')}/storage/${path}`
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function openAdd() {
  editingId.value = null
  promoteScanId.value = null
  Object.assign(form, { name: '', scientific_name: '', classification: '', habitat: '', description: '', image_path: '' })
  showModal.value = true
}

function openEdit(sp: Species) {
  editingId.value = sp.id
  promoteScanId.value = null
  Object.assign(form, {
    name: sp.name,
    scientific_name: sp.scientific_name || sp.name,
    classification: sp.classification,
    habitat: sp.habitat || '',
    description: sp.description || '',
    image_path: sp.image_path || ''
  })
  showModal.value = true
}

function openPromoteModal(scan: ScanCandidate) {
  promoteScanId.value = scan.id
  editingId.value = null
  Object.assign(form, {
    name: scan.result_name,
    scientific_name: scan.result_name,
    classification: scan.result_classification,
    habitat: scan.latitude && scan.longitude ? `Coords: ${scan.latitude}, ${scan.longitude}` : 'User Scan Submission',
    description: `Promoted from user scan #${scan.id} (Scanned by ${scan.user?.name || 'User'}).`,
    image_path: scan.image_path
  })
  showModal.value = true
}

async function saveSpecies() {
  if (!form.name || !form.classification) {
    alert('Please fill in required fields.')
    return
  }

  const token = localStorage.getItem('token')

  try {
    if (editingId.value) {
      await $fetch(`${config.public.apiBase}/admin/species/${editingId.value}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      })
    } else {
      await $fetch(`${config.public.apiBase}/admin/species`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      })
    }

    closeModal()
    fetchVerifiedSpecies()
    alert(promoteScanId.value ? 'Candidate scan successfully promoted & saved to Species DB!' : 'Species saved successfully!')
  } catch (err: any) {
    alert(err?.data?.message || 'Failed to save species.')
  }
}

function closeModal() {
  showModal.value = false
  promoteScanId.value = null
  editingId.value = null
}

async function deleteSpecies(sp: Species) {
  if (!confirm(`Delete "${sp.name}" from database?`)) return
  const token = localStorage.getItem('token')
  try {
    await $fetch(`${config.public.apiBase}/admin/species/${sp.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchVerifiedSpecies()
  } catch (err) {
    alert('Failed to delete species.')
  }
}
</script>
