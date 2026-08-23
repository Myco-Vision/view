<template>
  <div class="flex flex-col gap-[22px]">
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">Species Database</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">{{ species.length }} mushroom species on record</p>
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
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Region</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Added</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sp in filteredSpecies" :key="sp.id" class="hover:bg-[#f8fafc] group">
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle font-mono text-[12px] text-[#94a3b8] group-last:border-none">{{ sp.id }}</td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle italic font-semibold text-[#0f172a] group-last:border-none">{{ sp.scientific }}</td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">{{ sp.common }}</td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <span class="py-[3px] px-2.5 rounded-[20px] text-[11.5px] font-semibold capitalize" :class="sp.cls === 'edible' ? 'bg-[#d1fae5] text-[#065f46]' : (sp.cls === 'poisonous' ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#fef3c7] text-[#92400e]')">{{ sp.cls }}</span>
            </td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle text-[12.5px] text-[#64748b] group-last:border-none">{{ sp.region }}</td>
            <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle text-[12.5px] text-[#94a3b8] whitespace-nowrap group-last:border-none">{{ sp.added }}</td>
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
          <div class="grid grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Scientific Name *</label>
              <input v-model="form.scientific" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="e.g. Volvariella volvacea" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Common Name *</label>
              <input v-model="form.common" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="e.g. Paddy Straw Mushroom" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Classification *</label>
              <select v-model="form.cls" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]">
                <option value="">Select…</option>
                <option value="edible">Edible</option>
                <option value="poisonous">Poisonous</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Region</label>
              <input v-model="form.region" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="e.g. Southeast Asia" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#475569]">Description</label>
            <textarea v-model="form.description" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none resize-y transition-colors duration-[0.18s] focus:border-[#10b981]" rows="3" placeholder="Brief description…" />
          </div>
          <div class="flex justify-end gap-2.5 pt-1">
            <button class="py-[9px] px-5 rounded-lg border border-[#e2e8f0] bg-white text-[13.5px] font-medium font-sans cursor-pointer text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f8fafc]" @click="closeModal">Cancel</button>
            <button class="py-[9px] px-5 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-90" @click="saveSpecies">{{ editingId ? 'Update' : 'Add Species' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const clsFilter   = ref('')
const page        = ref(1)
const perPage     = 10
const showModal   = ref(false)
const editingId   = ref<number | null>(null)

const form = reactive({ scientific: '', common: '', cls: '', region: '', description: '' })

interface Species { id: number; scientific: string; common: string; cls: string; region: string; added: string; description: string }

const species = ref<Species[]>([])

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
definePageMeta({ 
  layout: 'admin',
  middleware: 'role',
  roles: ['admin', 'super_admin'],
})
</script>
