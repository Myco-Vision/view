<template>
  <div class="flex flex-col gap-[18px]">

    <!-- Header row -->
    <div class="flex flex-wrap items-center justify-between gap-2.5">
      <div class="flex flex-wrap items-center gap-2.5">
        <h1 class="text-[22px] font-bold text-white">Scan History</h1>
        <span class="text-[12.5px] font-medium text-[#64748b] bg-[#f8fafc] py-0.5 px-2.5 rounded-[20px] whitespace-nowrap shrink-0">{{ filtered.length }} records</span>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <button
          v-if="filtered.length"
          class="py-1.5 px-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-[12.5px] font-semibold cursor-pointer flex items-center gap-1.5 transition-all backdrop-blur-md"
          title="Export current scan history log to PDF"
          @click="exportHistoryPdf"
        >
          <AppIcon name="file" class="w-3.5 h-3.5 text-emerald-400" />
          <span>Export History (PDF)</span>
        </button>
        <span v-if="favorites.length" class="text-[12.5px] font-medium text-[#ef4444] bg-[#fef2f2] border border-[#fecaca] py-1 px-3 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
          <AppIcon name="heart-solid" class="w-3.5 h-3.5" /> {{ favorites.length }} Favorites saved
        </span>
      </div>
    </div>

    <!-- Search + Filter row -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <!-- Search -->
      <div class="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-[10px] py-2 px-3.5 w-full sm:flex-1 sm:min-w-[200px]">
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
      <div class="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
        <button
          v-for="f in filters"
          :key="f.value"
          class="py-[7px] px-3.5 rounded-[20px] border text-[13px] font-sans cursor-pointer transition-all duration-[0.18s] font-medium inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
          :class="activeFilter === f.value ? 'bg-[#10b981] border-[#10b981] text-white' : 'bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'"
          @click="activeFilter = f.value"
        >
          <AppIcon v-if="f.icon" :name="f.icon" class="w-3.5 h-3.5" :class="activeFilter === f.value ? 'text-white' : f.iconClass" />
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Scan list -->
    <div v-if="filtered.length" class="flex flex-col gap-2.5">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white border border-[#e2e8f0] rounded-xl p-3.5 sm:py-3.5 sm:px-4 transition-all duration-[0.18s] hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] hover:-translate-y-[1px]"
      >
        <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <!-- Thumbnail -->
          <div class="w-[64px] h-[64px] sm:w-[70px] sm:h-[70px] rounded-[10px] overflow-hidden shrink-0 bg-[#f8fafc] cursor-pointer" @click="openDetails(item)">
            <img :src="item.image" :alt="item.name" class="w-full h-full object-cover block" />
          </div>

          <!-- Main info -->
          <div class="flex-1 flex flex-col gap-1.5 sm:gap-2 min-w-0 cursor-pointer" @click="openDetails(item)">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-[14px] sm:text-[15px] font-semibold text-[#0f172a] italic truncate">{{ item.name }}</p>
              <span
                class="text-[11px] sm:text-[12px] font-semibold py-[2px] sm:py-[3px] px-2 sm:px-2.5 rounded-[20px] inline-flex items-center gap-1"
                :class="item.classification === 'Edible' ? 'bg-[#dcfce7] text-[#166534]' : (item.classification === 'Poisonous' ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#fef3c7] text-[#92400e]')"
              >
                <AppIcon :name="item.classification === 'Edible' ? 'check-circle' : (item.classification === 'Poisonous' ? 'skull' : 'help-circle')" class="w-3.5 h-3.5" /> {{ item.classification }}
              </span>
            </div>

            <div class="flex items-center gap-2.5 sm:gap-4 flex-wrap text-[11.5px] sm:text-[12.5px] text-[#64748b]">
              <span class="flex items-center gap-1">
                <svg class="w-[13px] h-[13px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                {{ item.confidence }}%
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-[13px] h-[13px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {{ item.date }}
              </span>
              <span v-if="item.location" class="flex items-center gap-1 truncate max-w-[140px] sm:max-w-none">
                <svg class="w-[13px] h-[13px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {{ item.location }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f1f5f9]">
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

          <!-- Export PDF Button -->
          <button 
            class="w-[34px] h-[34px] rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center cursor-pointer transition-colors duration-[0.18s] text-[#0284c7] hover:bg-[#e0f2fe] hover:border-[#bae6fd]" 
            title="Export Mushroom Datasheet (PDF)"
            @click.stop="exportScanPdf(item)"
          >
            <AppIcon name="file" class="w-3.5 h-3.5 text-[#0284c7]" />
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
      <AppIcon name="mushroom" class="w-12 h-12 text-[#10b981]" />
      <p class="text-[17px] font-semibold text-[#0f172a]">No scans found</p>
      <p class="text-[13.5px] text-[#64748b]">Try a different search or scan your first mushroom!</p>
      <NuxtLink to="/users/scan" class="mt-2 py-2.5 px-6 rounded-[10px] bg-[#10b981] text-white text-[14px] font-semibold no-underline transition-colors duration-[0.18s] hover:bg-[#059669]">Go to Scan</NuxtLink>
    </div>

    <!-- Complete Scan Details Modal -->
    <Teleport to="body">
      <div v-if="showModal && selectedScan" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" @click.self="showModal = false">
        <div class="bg-white rounded-2xl w-[540px] max-w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e2e8f0] animate-in fade-in zoom-in duration-200">
          
          <!-- Image Header with Floating Badge -->
          <div class="relative h-[220px] bg-[#0f172a]">
            <img :src="selectedScan.image" :alt="selectedScan.name" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
              <div class="flex items-end justify-between w-full">
                <div>
                  <span
                    class="text-[11.5px] font-bold py-1 px-3 rounded-full mb-1.5 inline-flex items-center gap-1.5 backdrop-blur-md"
                    :class="selectedScan.classification === 'Edible' ? 'bg-[#dcfce7]/90 text-[#166534]' : (selectedScan.classification === 'Poisonous' ? 'bg-[#fee2e2]/90 text-[#991b1b]' : 'bg-[#fef3c7]/90 text-[#92400e]')"
                  >
                    <AppIcon :name="selectedScan.classification === 'Edible' ? 'check-circle' : (selectedScan.classification === 'Poisonous' ? 'skull' : 'help-circle')" class="w-3.5 h-3.5" />
                    <span>{{ selectedScan.classification === 'Edible' ? 'Edible Species' : (selectedScan.classification === 'Poisonous' ? 'Poisonous Species' : 'Unknown Classification') }}</span>
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
                  <AppIcon name="target" class="w-4 h-4 text-[#10b981]" /> AI Confidence Match
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
                <span class="text-[11.5px] font-semibold text-[#94a3b8] uppercase inline-flex items-center gap-1"><AppIcon name="calendar" class="w-3.5 h-3.5" /> Scanned Date</span>
                <span class="text-[13px] font-semibold text-[#0f172a]">{{ selectedScan.date }}</span>
              </div>
              <div class="p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl flex flex-col gap-1">
                <span class="text-[11.5px] font-semibold text-[#94a3b8] uppercase inline-flex items-center gap-1"><AppIcon name="map-pin" class="w-3.5 h-3.5" /> Location / Coords</span>
                <span class="text-[13px] font-semibold text-[#0f172a] truncate">{{ selectedScan.location }}</span>
              </div>
            </div>

            <!-- Brief Information (Wikipedia Description, Habitat & Reference Link) -->
            <div class="flex flex-col gap-1.5 bg-[#f8fafc] p-3.5 rounded-xl border border-[#f1f5f9]">
              <span class="text-[12px] font-semibold text-[#475569] uppercase tracking-wider">Brief Information</span>
              <p class="text-[12.5px] text-[#0f172a] leading-[1.65] text-justify">
                <em class="italic underline font-semibold">{{ selectedScan.name }}</em>{{ selectedScan.descriptionRest }}
              </p>
              <p v-if="selectedScan.habitat" class="text-[12px] text-[#334155] leading-[1.5]">
                <strong class="text-[#0f172a]">Habitat:</strong> {{ selectedScan.habitat }}
              </p>
              <a :href="selectedScan.reference" target="_blank" rel="noopener noreferrer" class="text-[11px] text-[#059669] break-all no-underline leading-normal hover:underline">{{ selectedScan.reference }}</a>
              <p v-if="selectedScan.notes" class="text-[12px] text-[#475569] pt-1.5 mt-1 border-t border-[#e2e8f0]">
                <strong class="text-[#0f172a]">Notes:</strong> {{ selectedScan.notes }}
              </p>
            </div>

          </div>

          <!-- Modal Footer Actions -->
          <div class="p-4 border-t border-[#f1f5f9] bg-[#f8fafc] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <button 
              class="w-full sm:w-auto justify-center py-2 px-4 rounded-xl border text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 transition-all"
              :class="isFavorite(selectedScan.id) ? 'bg-[#fef2f2] border-[#fecaca] text-[#ef4444]' : 'bg-white border-[#e2e8f0] text-[#475569] hover:text-[#ef4444]'"
              @click="toggleFavorite(selectedScan)"
            >
              <span class="inline-flex items-center gap-1.5">
                <AppIcon :name="isFavorite(selectedScan.id) ? 'heart-solid' : 'heart'" class="w-4 h-4" />
                {{ isFavorite(selectedScan.id) ? 'Saved to Favorites' : 'Add to Collection Favorites' }}
              </span>
            </button>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <button 
                class="w-full sm:w-auto justify-center py-2 px-4 rounded-xl border border-[#0284c7]/30 bg-[#f0f9ff] text-[#0284c7] hover:bg-[#e0f2fe] text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
                title="Export Mushroom Datasheet (PDF)"
                @click="exportScanPdf(selectedScan)"
              >
                <AppIcon name="file" class="w-3.5 h-3.5 text-[#0284c7]" />
                <span>Export PDF</span>
              </button>
              <button 
                class="w-full sm:w-auto py-2 px-5 rounded-xl bg-[#0f172a] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#334155] transition-colors text-center"
                @click="showModal = false"
              >
                Close
              </button>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user', middleware: 'auth' })

const config = useRuntimeConfig()

// ── Filters ───────────────────────────────────────────
const filters = [
  { label: 'All Scans', value: 'all',       icon: '',             iconClass: '' },
  { label: 'Edible',    value: 'Edible',    icon: 'check-circle', iconClass: 'text-[#16a34a]' },
  { label: 'Poisonous', value: 'Poisonous', icon: 'skull',        iconClass: 'text-[#dc2626]' },
  { label: 'Favorites', value: 'favorites', icon: 'heart-solid',  iconClass: 'text-[#ef4444]' },
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
  descriptionRest: string;
  habitat: string;
  reference: string;
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
      const brief = resolveSpeciesBrief(scan)
      return {
        id: scan.id,
        name: brief.name,
        classification: brief.classification,
        confidence: brief.confidence,
        location: scan.location_name || (scan.latitude && scan.longitude ? `${scan.latitude}, ${scan.longitude}` : 'Unknown Location'),
        date: new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
        image: scan.image_url || (scan.image_path ? `${config.public.apiBase.replace(/\/api$/, '')}/storage/${scan.image_path}` : 'https://placehold.co/320x320/e8f0e8/a3a3a3?text=No+Image'),
        notes: scan.notes,
        descriptionRest: brief.descriptionRest,
        habitat: brief.habitat,
        reference: brief.reference,
      }
    })
  } catch (error) {
    console.error('Failed to fetch scans:', error)
  }
}

async function deleteScan(item: MushroomScan) {
  const { confirm } = useConfirm()
  const toast = useToast()
  const ok = await confirm({
    title: 'Delete this scan?',
    message: `"${item.name}" will be permanently removed from your scan history.`,
    tone: 'danger',
    confirmText: 'Delete',
  })
  if (!ok) return
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
    toast.success('Scan deleted.')
  } catch (error) {
    toast.error('Failed to delete scan.')
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

// ── PDF Export Utilities ──────────────────────────────
function esc(s: any): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const PRINT_MUSHROOM_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="color: #059669; display: inline-block; vertical-align: middle;"><path d="M12 2C7.03 2 3 6.03 3 11c0 1.25.26 2.44.73 3.52C4.1 15.35 4.8 16 5.6 16h12.8c.8 0 1.5-.65 1.87-1.48.47-1.08.73-2.27.73-3.52 0-4.97-4.03-9-9-9zm-1.5 15h3v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-5z"/></svg>'

function exportScanPdf(item: MushroomScan | null) {
  if (!item) return
  const printWindow = window.open('', '_blank', 'width=880,height=960')
  if (!printWindow) {
    alert('Please allow popups to export the mushroom PDF report.')
    return
  }

  const cls = (item.classification || '').toLowerCase()
  const isEdible = cls === 'edible'
  const isPoisonous = cls === 'poisonous'
  const badgeBg = isEdible ? '#dcfce7' : (isPoisonous ? '#fee2e2' : '#fef3c7')
  const badgeColor = isEdible ? '#166534' : (isPoisonous ? '#991b1b' : '#92400e')
  const badgeBorder = isEdible ? '#bbf7d0' : (isPoisonous ? '#fecaca' : '#fde68a')

  const descriptionFull = `${item.name}${item.descriptionRest || ''}`

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${esc(item.name)} - MycoVision Forager Observation Report</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0; padding: 24px; color: #0f172a; background: #ffffff; line-height: 1.5; font-size: 13px;
    }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;
    }
    .brand {
      display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 800; color: #065f46; letter-spacing: -0.5px;
    }
    .brand-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #059669; letter-spacing: 1px; }
    .doc-meta { text-align: right; font-size: 11px; color: #64748b; }
    .doc-meta strong { color: #0f172a; }
    
    .title-banner {
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
      border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px 20px; margin-bottom: 20px;
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
    }
    .species-title { font-size: 24px; font-weight: 800; color: #064e3b; margin: 0; font-style: italic; }
    .species-subtitle { font-size: 12.5px; color: #047857; margin-top: 3px; font-weight: 500; }
    
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 20px; font-size: 12.5px; font-weight: 700;
      background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder};
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    
    .confidence-meter {
      background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 14px;
      display: inline-flex; align-items: center; gap: 8px; margin-top: 8px;
    }
    .confidence-val { font-size: 15px; font-weight: 800; color: #059669; }
    
    .content-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;
    }
    .card {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px;
    }
    .card-title {
      font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;
      color: #475569; margin: 0 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;
    }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 7px; font-size: 12.5px; }
    .info-label { color: #64748b; font-weight: 500; }
    .info-val { color: #0f172a; font-weight: 600; text-align: right; max-width: 65%; word-break: break-word; }
    
    .photo-section {
      text-align: center; margin-bottom: 20px;
    }
    .photo-box {
      display: inline-block; max-width: 100%; border: 1px solid #cbd5e1; border-radius: 12px;
      overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); background: #f1f5f9;
    }
    .photo-box img {
      max-height: 260px; max-width: 100%; width: auto; height: auto; object-fit: contain; display: block;
    }
    .photo-caption { font-size: 11px; color: #64748b; margin-top: 6px; font-style: italic; }
    
    .section-box {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px;
    }
    .section-title {
      font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;
      color: #334155; margin: 0 0 8px 0;
    }
    .desc-p { margin: 0 0 8px 0; font-size: 12.5px; line-height: 1.6; color: #334155; text-align: justify; }
    
    .disclaimer-box {
      background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 10px; padding: 12px 14px;
      margin-top: 20px; font-size: 11px; line-height: 1.5; color: #92400e;
    }
    .disclaimer-box strong { color: #78350f; font-weight: 700; }
    
    .footer {
      border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px;
      display: flex; justify-content: space-between; font-size: 10.5px; color: #94a3b8;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">${PRINT_MUSHROOM_SVG} MycoVision</div>
      <div class="brand-tag">Wild Mushroom Intelligence &amp; Forager Biosafety</div>
    </div>
    <div class="doc-meta">
      <div>Observation ID: <strong>#SCAN-${esc(item.id)}</strong></div>
      <div>Printed: <strong>${esc(new Date().toLocaleString())}</strong></div>
    </div>
  </div>

  <div class="title-banner">
    <div>
      <h1 class="species-title">${esc(item.name)}</h1>
      <div class="species-subtitle">Specimen Record • Philippine Fungal Sighting</div>
      <div class="confidence-meter">
        <span style="font-size: 12px; color: #64748b; font-weight: 600;">AI Confidence:</span>
        <span class="confidence-val">${esc(item.confidence)}%</span>
      </div>
    </div>
    <div>
      <div class="badge">${esc(item.classification)}</div>
    </div>
  </div>

  <div class="content-grid">
    <div class="card">
      <div class="card-title">Observation Details</div>
      <div class="info-row"><span class="info-label">Discovery Date:</span><span class="info-val">${esc(item.date)}</span></div>
      <div class="info-row"><span class="info-label">Field Location:</span><span class="info-val">${esc(item.location || 'Unknown Coordinates')}</span></div>
      <div class="info-row"><span class="info-label">Identification Model:</span><span class="info-val">MycoVision Two-Stage Vision</span></div>
      <div class="info-row"><span class="info-label">Record Status:</span><span class="info-val">Logged &amp; Cataloged</span></div>
    </div>

    <div class="card">
      <div class="card-title">Botanical &amp; Field Context</div>
      <div class="info-row"><span class="info-label">Classification:</span><span class="info-val">${esc(item.classification)}</span></div>
      <div class="info-row"><span class="info-label">Habitat:</span><span class="info-val">${esc(item.habitat || 'Forest floor / Decaying timber')}</span></div>
      ${item.notes ? `<div class="info-row"><span class="info-label">Field Notes:</span><span class="info-val">${esc(item.notes)}</span></div>` : ''}
    </div>
  </div>

  ${item.image ? `
  <div class="photo-section">
    <div class="photo-box">
      <img src="${esc(item.image)}" alt="${esc(item.name)}" />
    </div>
    <div class="photo-caption">Field photograph captured by forager during AI identification scan</div>
  </div>
  ` : ''}

  <div class="section-box">
    <div class="section-title">Species Description &amp; Taxonomic Information</div>
    <p class="desc-p">${esc(descriptionFull || 'Detailed characteristics logged via MycoVision botanical database.')}</p>
    ${item.reference ? `<p style="font-size: 11px; margin: 4px 0 0 0; color: #059669; word-break: break-all;">Reference Source: ${esc(item.reference)}</p>` : ''}
  </div>

  <div class="disclaimer-box">
    <strong>⚠️ FORAGER BIOSAFETY NOTICE:</strong> This identification report is generated through computer vision and machine learning models for educational, research, and informational reference only. Fungal morphology in tropical climates displays notable phenotypic plasticity. Never harvest or ingest wild mushrooms without positive in-person confirmation from a certified mycologist.
  </div>

  <div class="footer">
    <span>MycoVision Field Biosafety Platform • https://mycovision.app</span>
    <span>Page 1 of 1</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  <\/script>
</body>
</html>`

  printWindow.document.write(html)
  printWindow.document.close()
}

function exportHistoryPdf() {
  if (!filtered.value.length) return
  const printWindow = window.open('', '_blank', 'width=900,height=960')
  if (!printWindow) {
    alert('Please allow popups to export the scan history PDF.')
    return
  }

  const edibleCount = filtered.value.filter(s => s.classification === 'Edible').length
  const poisonousCount = filtered.value.filter(s => s.classification === 'Poisonous').length
  const otherCount = filtered.value.length - edibleCount - poisonousCount

  const rowsHtml = filtered.value.map((s, idx) => {
    const isEd = s.classification === 'Edible'
    const isPo = s.classification === 'Poisonous'
    const color = isEd ? '#166534' : (isPo ? '#991b1b' : '#92400e')
    const bg = isEd ? '#dcfce7' : (isPo ? '#fee2e2' : '#fef3c7')
    return `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
        <td style="padding: 10px 8px; text-align: center; color: #64748b;">${idx + 1}</td>
        <td style="padding: 10px 8px; text-align: center;">
          <img src="${esc(s.image)}" style="width: 46px; height: 46px; object-fit: cover; border-radius: 8px; border: 1px solid #cbd5e1;" />
        </td>
        <td style="padding: 10px 8px; font-weight: 700; color: #0f172a; font-style: italic;">
          ${esc(s.name)}
        </td>
        <td style="padding: 10px 8px; text-align: center;">
          <span style="display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; background: ${bg}; color: ${color};">
            ${esc(s.classification)}
          </span>
        </td>
        <td style="padding: 10px 8px; text-align: center; font-weight: 700; color: #059669;">
          ${esc(s.confidence)}%
        </td>
        <td style="padding: 10px 8px; color: #475569; font-size: 11.5px;">
          ${esc(s.location || 'Unknown')}
        </td>
        <td style="padding: 10px 8px; color: #64748b; font-size: 11.5px; white-space: nowrap;">
          ${esc(s.date)}
        </td>
      </tr>
    `
  }).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MycoVision - Forager Scan History Log</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0; padding: 20px; color: #0f172a; background: #ffffff; line-height: 1.4;
    }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 16px;
    }
    .brand { font-size: 20px; font-weight: 800; color: #065f46; display: flex; align-items: center; gap: 8px; }
    .stats-row {
      display: flex; gap: 12px; margin-bottom: 16px;
    }
    .stat-chip {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 14px; font-size: 12px;
    }
    .stat-chip strong { color: #0f172a; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th {
      background: #f1f5f9; color: #334155; font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px;
      padding: 9px 8px; text-align: left; border-bottom: 2px solid #cbd5e1;
    }
    .footer {
      border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 20px;
      display: flex; justify-content: space-between; font-size: 10.5px; color: #94a3b8;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">${PRINT_MUSHROOM_SVG} MycoVision</div>
      <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #059669; letter-spacing: 1px;">Forager Scan History Log</div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #64748b;">
      <div>Filter: <strong>${esc(activeFilter.value === 'all' ? 'All Records' : activeFilter.value)}</strong></div>
      <div>Generated: <strong>${esc(new Date().toLocaleString())}</strong></div>
    </div>
  </div>

  <div class="stats-row">
    <div class="stat-chip">Total Scans: <strong>${filtered.value.length}</strong></div>
    <div class="stat-chip">Edible Species: <strong style="color: #166534;">${edibleCount}</strong></div>
    <div class="stat-chip">Poisonous Species: <strong style="color: #991b1b;">${poisonousCount}</strong></div>
    ${otherCount > 0 ? `<div class="stat-chip">Other: <strong>${otherCount}</strong></div>` : ''}
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 35px; text-align: center;">#</th>
        <th style="width: 60px; text-align: center;">Photo</th>
        <th>Species Name</th>
        <th style="text-align: center;">Classification</th>
        <th style="text-align: center;">Match %</th>
        <th>Field Location</th>
        <th>Date &amp; Time</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="footer">
    <span>MycoVision Field Biosafety Platform • Generated by Forager Portal</span>
    <span>Total Observations Logged: ${filtered.value.length}</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  <\/script>
</body>
</html>`

  printWindow.document.write(html)
  printWindow.document.close()
}
</script>
