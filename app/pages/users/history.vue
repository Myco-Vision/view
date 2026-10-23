<template>
  <div class="flex flex-col gap-[18px]">

    <!-- Header row -->
    <div class="flex items-baseline justify-between gap-3">
      <div class="flex items-baseline gap-3">
        <h1 class="text-[22px] font-bold text-[#0f172a]">Scan History</h1>
        <span class="text-[13px] text-[#64748b] bg-[#f8fafc] py-0.5 px-2.5 rounded-[20px]">{{ filtered.length }} records</span>
      </div>
      <span v-if="favorites.length" class="text-[12.5px] font-medium text-[#ef4444] bg-[#fef2f2] border border-[#fecaca] py-1 px-3 rounded-full flex items-center gap-1.5">
        ❤️ {{ favorites.length }} Favorites saved
      </span>
    </div>

    <!-- Search + Filter row -->
    <div class="flex items-center gap-3 flex-wrap">
      <!-- Search -->
      <div class="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-[10px] py-2 px-3.5 flex-1 min-w-[200px]">
        <svg class="w-4 h-4 text-[#94a3b8] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="search"
          type="text"
          class="border-none outline-none font-sans text-[13.5px] text-[#0f172a] bg-transparent w-full placeholder:text-[#94a3b8]"
          placeholder="Search mushroom name…"
        />
      </div>

      <!-- Filter chips -->
      <div class="flex gap-2">
        <button
          v-for="f in filters"
          :key="f.value"
          class="py-[7px] px-4 rounded-[20px] border border-[#e2e8f0] bg-white text-[13px] font-sans text-[#64748b] cursor-pointer transition-all duration-[0.18s] font-medium hover:bg-[#f8fafc] hover:text-[#0f172a]"
          :class="{ 'bg-[#10b981] border-[#10b981] text-white hover:bg-[#10b981] hover:text-white': activeFilter === f.value }"
          @click="activeFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Scan list -->
    <div v-if="filtered.length" class="flex flex-col gap-2.5">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="flex items-center gap-4 bg-white border border-[#e2e8f0] rounded-xl py-3.5 px-4 transition-all duration-[0.18s] hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] hover:-translate-y-[1px]"
      >
        <!-- Thumbnail -->
        <div class="w-[70px] h-[70px] rounded-[10px] overflow-hidden shrink-0 bg-[#f8fafc] cursor-pointer" @click="openDetails(item)">
          <img :src="item.image" :alt="item.name" class="w-full h-full object-cover block" />
        </div>

        <!-- Main info -->
        <div class="flex-1 flex flex-col gap-2 min-w-0 cursor-pointer" @click="openDetails(item)">
          <div class="flex items-center gap-2.5 flex-wrap">
            <p class="text-[15px] font-semibold text-[#0f172a] italic">{{ item.name }}</p>
            <span
              class="text-[12px] font-semibold py-[3px] px-2.5 rounded-[20px]"
              :class="item.classification === 'Edible' ? 'bg-[#dcfce7] text-[#166534]' : (item.classification === 'Poisonous' ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#fef3c7] text-[#92400e]')"
            >
              {{ item.classification === 'Edible' ? '✅' : (item.classification === 'Poisonous' ? '☠️' : '❓') }} {{ item.classification }}
            </span>
          </div>

          <div class="flex items-center gap-4 flex-wrap">
            <span class="flex items-center gap-1.5 text-[12.5px] text-[#64748b]">
              <!-- confidence -->
              <svg class="w-[13px] h-[13px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              {{ item.confidence }}% confidence
            </span>
            <span class="flex items-center gap-1.5 text-[12.5px] text-[#64748b]">
              <!-- calendar -->
              <svg class="w-[13px] h-[13px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {{ item.date }}
            </span>
            <span class="flex items-center gap-1.5 text-[12.5px] text-[#64748b]">
              <!-- pin -->
              <svg class="w-[13px] h-[13px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ item.location }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Favorite Heart Button -->
          <button 
            class="w-[34px] h-[34px] rounded-lg border flex items-center justify-center cursor-pointer transition-all duration-[0.18s]"
            :class="isFavorite(item.id) ? 'bg-[#fef2f2] border-[#fecaca] text-[#ef4444]' : 'bg-white border-[#e2e8f0] text-[#94a3b8] hover:bg-[#fef2f2] hover:text-[#ef4444] hover:border-[#fecaca]'"
            :title="isFavorite(item.id) ? 'Remove from favorites' : 'Add to collection favorites'"
            @click.stop="toggleFavorite(item)"
          >
            <svg class="w-[16px] h-[16px]" :fill="isFavorite(item.id) ? '#ef4444' : 'none'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <!-- Eye Icon (View Details Modal) -->
          <button 
            class="w-[34px] h-[34px] rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center cursor-pointer transition-colors duration-[0.18s] text-[#059669] hover:bg-[#dcfce7] hover:border-[#10b981]" 
            title="View complete details"
            @click.stop="openDetails(item)"
          >
            <svg class="w-[15px] h-[15px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>

          <!-- Delete Scan Button -->
          <button 
            class="w-[34px] h-[34px] rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center cursor-pointer transition-colors duration-[0.18s] text-[#dc2626] hover:bg-[#fee2e2] hover:border-[#fca5a5]" 
            title="Delete scan"
            @click.stop="deleteScan(item)"
          >
            <svg class="w-[15px] h-[15px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
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
    <div v-else class="flex-1 flex flex-col items-center justify-center gap-2.5 py-[60px] px-5 text-center bg-white border border-[#e2e8f0] rounded-[14px]">
      <div class="text-[52px] leading-none">🍄</div>
      <p class="text-[17px] font-semibold text-[#0f172a]">No scans found</p>
      <p class="text-[13.5px] text-[#64748b]">Try a different search or scan your first mushroom!</p>
      <NuxtLink to="/users/scan" class="mt-2 py-2.5 px-6 rounded-[10px] bg-[#10b981] text-white text-[14px] font-semibold no-underline transition-colors duration-[0.18s] hover:bg-[#059669]">Go to Scan</NuxtLink>
    </div>

    <!-- Complete Scan Details Modal -->
    <Teleport to="body">
      <div v-if="showModal && selectedScan" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" @click.self="showModal = false">
        <div class="bg-white rounded-2xl w-[540px] max-w-full shadow-2xl overflow-hidden border border-[#e2e8f0] animate-in fade-in zoom-in duration-200">
          
          <!-- Image Header with Floating Badge -->
          <div class="relative h-[220px] bg-[#0f172a]">
            <img :src="selectedScan.image" :alt="selectedScan.name" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
              <div class="flex items-end justify-between w-full">
                <div>
                  <span
                    class="text-[11.5px] font-bold py-1 px-3 rounded-full mb-1.5 inline-block backdrop-blur-md"
                    :class="selectedScan.classification === 'Edible' ? 'bg-[#dcfce7]/90 text-[#166534]' : (selectedScan.classification === 'Poisonous' ? 'bg-[#fee2e2]/90 text-[#991b1b]' : 'bg-[#fef3c7]/90 text-[#92400e]')"
                  >
                    {{ selectedScan.classification === 'Edible' ? '✅ Edible Species' : (selectedScan.classification === 'Poisonous' ? '☠️ Poisonous Species' : '❓ Unknown Classification') }}
                  </span>
                  <h2 class="text-[20px] font-bold text-white italic drop-shadow-md">{{ selectedScan.name }}</h2>
                </div>
                <button 
                  class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-lg hover:bg-white/40 cursor-pointer"
                  @click="showModal = false"
                >✕</button>
              </div>
            </div>
          </div>

          <!-- Modal Body Details -->
          <div class="p-5 flex flex-col gap-4">
            
            <!-- AI Confidence Score Meter -->
            <div class="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5 flex flex-col gap-2">
              <div class="flex items-center justify-between text-[13px]">
                <span class="font-semibold text-[#334155] flex items-center gap-1.5">
                  🎯 AI Confidence Match
                </span>
                <span class="font-bold text-[#10b981] text-[14px]">{{ selectedScan.confidence }}%</span>
              </div>
              <div class="w-full bg-[#e2e8f0] h-2.5 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-[#10b981] to-[#059669] h-full rounded-full transition-all duration-500" :style="{ width: `${selectedScan.confidence}%` }"></div>
              </div>
            </div>

            <!-- Meta Metadata Grid -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl flex flex-col gap-1">
                <span class="text-[11.5px] font-semibold text-[#94a3b8] uppercase">📅 Scanned Date</span>
                <span class="text-[13px] font-semibold text-[#0f172a]">{{ selectedScan.date }}</span>
              </div>
              <div class="p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl flex flex-col gap-1">
                <span class="text-[11.5px] font-semibold text-[#94a3b8] uppercase">📍 Location / Coords</span>
                <span class="text-[13px] font-semibold text-[#0f172a] truncate">{{ selectedScan.location }}</span>
              </div>
            </div>

            <!-- Notes or Description -->
            <div class="flex flex-col gap-1.5">
              <span class="text-[12px] font-semibold text-[#475569] uppercase tracking-wider">Species Notes & Identification</span>
              <p class="text-[13px] text-[#475569] leading-relaxed bg-[#f8fafc] p-3 rounded-xl border border-[#f1f5f9]">
                {{ selectedScan.notes || 'No user notes added for this scan. AI model identified specimen characteristics as ' + selectedScan.name + '.' }}
              </p>
            </div>

          </div>

          <!-- Modal Footer Actions -->
          <div class="p-4 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
            <button 
              class="py-2 px-4 rounded-xl border text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 transition-all"
              :class="isFavorite(selectedScan.id) ? 'bg-[#fef2f2] border-[#fecaca] text-[#ef4444]' : 'bg-white border-[#e2e8f0] text-[#475569] hover:text-[#ef4444]'"
              @click="toggleFavorite(selectedScan)"
            >
              <span>{{ isFavorite(selectedScan.id) ? '❤️ Saved to Favorites' : '🤍 Add to Collection Favorites' }}</span>
            </button>
            <button 
              class="py-2 px-5 rounded-xl bg-[#0f172a] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#334155] transition-colors"
              @click="showModal = false"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const config = useRuntimeConfig()

// ── Filters ───────────────────────────────────────────
const filters = [
  { label: 'All Scans',   value: 'all' },
  { label: '✅ Edible',   value: 'Edible' },
  { label: '☠️ Poisonous', value: 'Poisonous' },
  { label: '❤️ Favorites', value: 'favorites' },
]
const activeFilter = ref('all')
const search = ref('')

// ── Scan & Modal State ────────────────────────────────
interface MushroomScan {
  id: number;
  name: string;
  classification: string;
  confidence: number;
  date: string;
  location: string;
  image: string;
  notes?: string;
}

const scans = ref<MushroomScan[]>([])
const favorites = ref<number[]>([])
const showModal = ref(false)
const selectedScan = ref<MushroomScan | null>(null)

onMounted(async () => {
  loadFavorites()
  fetchScans()
})

function loadFavorites() {
  const stored = localStorage.getItem('myco_favorites')
  if (stored) {
    try {
      favorites.value = JSON.parse(stored)
    } catch (e) {
      favorites.value = []
    }
  }
}

function saveFavorites() {
  localStorage.setItem('myco_favorites', JSON.stringify(favorites.value))
}

function isFavorite(id: number): boolean {
  return favorites.value.includes(id)
}

function toggleFavorite(item: MushroomScan) {
  const index = favorites.value.indexOf(item.id)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(item.id)
  }
  saveFavorites()
}

function openDetails(item: MushroomScan) {
  selectedScan.value = item
  showModal.value = true
}

async function fetchScans() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const data = await $fetch<any[]>(`${config.public.apiBase}/scans`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    scans.value = data.map(scan => {
      const rawClass = scan.result_classification || 'unknown';
      return {
        id: scan.id,
        name: scan.result_name || 'Unknown Species',
        classification: rawClass.charAt(0).toUpperCase() + rawClass.slice(1),
        confidence: scan.confidence_level || 0,
        location: scan.location_name || (scan.latitude && scan.longitude ? `${scan.latitude}, ${scan.longitude}` : 'Unknown Location'),
        date: new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
        image: scan.image_path ? `${config.public.apiBase.replace('/api', '')}/storage/${scan.image_path}` : 'https://placehold.co/320x320/e8f0e8/a3a3a3?text=No+Image',
        notes: scan.notes
      }
    })
  } catch (error) {
    console.error('Failed to fetch scans:', error)
  }
}

async function deleteScan(item: MushroomScan) {
  if (!confirm(`Are you sure you want to delete scan for "${item.name}"?`)) return
  try {
    const token = localStorage.getItem('token')
    await $fetch(`${config.public.apiBase}/scans/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    scans.value = scans.value.filter(s => s.id !== item.id)
    if (selectedScan.value?.id === item.id) {
      showModal.value = false
    }
  } catch (error) {
    alert('Failed to delete scan.')
  }
}

// ── Computed filtered list ────────────────────────────
const filtered = computed(() =>
  scans.value.filter(s => {
    let matchesFilter = true
    if (activeFilter.value === 'favorites') {
      matchesFilter = isFavorite(s.id)
    } else if (activeFilter.value !== 'all') {
      matchesFilter = s.classification === activeFilter.value
    }
    
    const matchesSearch = s.name.toLowerCase().includes(search.value.toLowerCase())
    return matchesFilter && matchesSearch
  })
)
</script>
