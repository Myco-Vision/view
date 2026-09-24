<template>
  <div class="flex flex-col gap-[22px]">
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">Species Database</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">{{ pagination.total }} mushroom species on record</p>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
        <div class="relative">
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#94a3b8]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" @input="debouncedFilter" class="py-2 pr-3 pl-8 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none w-[200px] transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="Search species…" />
        </div>
        <select v-model="clsFilter" @change="filterSpecies" class="py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans bg-white cursor-pointer outline-none">
          <option value="">All Classifications</option>
          <option value="edible">Edible</option>
          <option value="poisonous">Poisonous</option>
          <option value="unknown">Unknown</option>
        </select>
        <button class="py-2 px-[18px] rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-90" @click="openAdd">+ Add Species</button>
      </div>
    </div>

    <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
      <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">#</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Scientific Name</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Common Name</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Classification</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Habitat</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Added</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="animate-pulse">
            <td colspan="7" class="py-8 text-center text-[#94a3b8] text-[13.5px]">Loading species...</td>
          </tr>
          <tr v-else-if="filteredSpecies.length === 0">
            <td colspan="7" class="py-8 text-center text-[#94a3b8] text-[14px]">No species found.</td>
          </tr>
          <tr v-else v-for="sp in paginatedSpecies" :key="sp.id" class="hover:bg-[#f8fafc] group">
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle font-mono text-[12px] text-[#94a3b8] group-last:border-none">{{ sp.id }}</td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle italic font-semibold text-[#0f172a] group-last:border-none">{{ sp.scientific_name || '-' }}</td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">{{ sp.name }}</td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <span class="py-[3px] px-2.5 rounded-[20px] text-[11.5px] font-semibold capitalize" :class="sp.classification === 'edible' ? 'bg-[#d1fae5] text-[#065f46]' : (sp.classification === 'poisonous' ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#fef3c7] text-[#92400e]')">{{ sp.classification }}</span>
            </td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle text-[12.5px] text-[#64748b] group-last:border-none">{{ sp.habitat || '-' }}</td>
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
        <span class="text-[12.5px] text-[#64748b]">{{ filteredSpecies.length }} of {{ allSpecies.length }} species</span>
        <div class="flex items-center gap-2.5">
          <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white" :disabled="page <= 1" @click="page--">‹</button>
          <span class="text-[12.5px] text-[#475569]">Page {{ page }} of {{ totalPages }}</span>
          <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white" :disabled="page >= totalPages" @click="page++">›</button>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-[2px]" @click.self="closeModal">
      <div class="bg-white rounded-2xl w-[560px] max-w-[95vw] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <div class="flex items-center justify-between py-[18px] px-[22px] border-b border-[#f1f5f9]">
          <p class="text-[15px] font-bold text-[#0f172a]">{{ editingId ? 'Edit Species' : 'Add New Species' }}</p>
          <button class="bg-transparent border-none cursor-pointer text-[16px] text-[#94a3b8] hover:text-[#ef4444]" @click="closeModal">✕</button>
        </div>
        <div class="p-[22px] flex flex-col gap-4">
          <div v-if="formError" class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px] font-medium">{{ formError }}</div>
          <div class="grid grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Common Name *</label>
              <input v-model="form.name" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="e.g. Paddy Straw Mushroom" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Scientific Name</label>
              <input v-model="form.scientific_name" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="e.g. Volvariella volvacea" />
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
              <label class="text-[12.5px] font-semibold text-[#475569]">Habitat</label>
              <input v-model="form.habitat" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="e.g. Tropical forests" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#475569]">Description</label>
            <textarea v-model="form.description" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none resize-y transition-colors duration-[0.18s] focus:border-[#10b981]" rows="3" placeholder="Brief description…" />
          </div>
          <div class="flex justify-end gap-2.5 pt-1">
            <button class="py-[9px] px-5 rounded-lg border border-[#e2e8f0] bg-white text-[13.5px] font-medium font-sans cursor-pointer text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f8fafc]" @click="closeModal">Cancel</button>
            <button class="py-[9px] px-5 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-90 flex items-center justify-center min-w-[100px]" @click="saveSpecies" :disabled="isSaving">
              <span v-if="isSaving" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              <span v-else>{{ editingId ? 'Update' : 'Add Species' }}</span>
            </button>
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
const isSaving = ref(false)
const searchQuery = ref('')
const clsFilter   = ref('')
const page        = ref(1)
const perPage     = 10
const showModal   = ref(false)
const editingId   = ref<number | null>(null)
const formError   = ref('')

const form = reactive({ name: '', scientific_name: '', classification: '', habitat: '', description: '' })

const allSpecies = ref<any[]>([])
const pagination = reactive({ total: 0 })

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

async function fetchSpecies() {
  loading.value = true
  try {
    const res = await $fetch<any[]>(`${config.public.apiBase}/admin/species`, {
      headers: getHeaders(),
    })
    allSpecies.value = res
    pagination.total = res.length
  } catch (error) {
    console.error('Failed to fetch species:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => { fetchSpecies() })

// Client-side filtering (species list is typically not huge)
const filteredSpecies = computed(() => allSpecies.value.filter(s => {
  const q = searchQuery.value.toLowerCase()
  const matchQ = !q || (s.scientific_name || '').toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
  const matchC = !clsFilter.value || s.classification === clsFilter.value
  return matchQ && matchC
}))

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSpecies.value.length / perPage)))
const paginatedSpecies = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredSpecies.value.slice(start, start + perPage)
})

let debounceTimer: any = null
function debouncedFilter() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1 }, 300)
}
function filterSpecies() { page.value = 1 }

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function openAdd() {
  editingId.value = null
  formError.value = ''
  Object.assign(form, { name: '', scientific_name: '', classification: '', habitat: '', description: '' })
  showModal.value = true
}

function openEdit(sp: any) {
  editingId.value = sp.id
  formError.value = ''
  Object.assign(form, {
    name: sp.name,
    scientific_name: sp.scientific_name || '',
    classification: sp.classification,
    habitat: sp.habitat || '',
    description: sp.description || '',
  })
  showModal.value = true
}

async function saveSpecies() {
  if (!form.name || !form.classification) {
    formError.value = 'Please fill in required fields (Common Name and Classification).'
    return
  }
  formError.value = ''
  isSaving.value = true

  try {
    if (editingId.value) {
      await $fetch(`${config.public.apiBase}/admin/species/${editingId.value}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: form,
      })
    } else {
      await $fetch(`${config.public.apiBase}/admin/species`, {
        method: 'POST',
        headers: getHeaders(),
        body: form,
      })
    }
    closeModal()
    fetchSpecies()
  } catch (err: any) {
    formError.value = err?.data?.message || 'Failed to save species.'
  } finally {
    isSaving.value = false
  }
}

function closeModal() { showModal.value = false }

async function deleteSpecies(sp: any) {
  if (!confirm(`Delete "${sp.name}"?`)) return
  try {
    await $fetch(`${config.public.apiBase}/admin/species/${sp.id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    fetchSpecies()
  } catch (err: any) {
    alert(err?.data?.message || 'Failed to delete species.')
  }
}
</script>
