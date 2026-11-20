<template>
  <div class="flex flex-col gap-5">

    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-[22px] font-bold text-white tracking-tight">My Collection</h1>
        <p class="text-[13px] text-emerald-300/80 mt-0.5">Organise your scans into folders</p>
      </div>
      <button
        class="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold transition-colors shadow-sm"
        @click="openCreateFolder"
      >
        <AppIcon name="folder" class="w-4 h-4" />
        New Folder
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loadingFolders" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div v-for="i in 4" :key="i" class="h-28 rounded-2xl bg-white/10 animate-pulse" />
    </div>

    <!-- Empty: no folders yet -->
    <div
      v-else-if="folders.length === 0 && !activeFolder"
      class="flex flex-col items-center justify-center gap-3 py-20 px-6 text-center bg-white/5 border border-white/10 rounded-2xl"
    >
      <AppIcon name="folder" class="w-14 h-14 text-emerald-400/60" />
      <p class="text-[17px] font-semibold text-white">No folders yet</p>
      <p class="text-[13.5px] text-slate-400 max-w-sm">Create a folder to start organising your mushroom scans.</p>
      <button
        class="mt-2 py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[14px] font-semibold transition-colors"
        @click="openCreateFolder"
      >Create your first folder</button>
    </div>

    <!-- Folder grid + detail view -->
    <template v-else>

      <!-- Folder list (shown when no active folder) -->
      <div v-if="!activeFolder" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="group relative flex flex-col gap-2 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          @click="openFolder(folder)"
        >
          <!-- Folder icon + colour accent -->
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="folderBg(folder.color)">
            <AppIcon name="folder" class="w-5 h-5" :class="folderIcon(folder.color)" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[14px] font-bold text-slate-900 truncate">{{ folder.name }}</p>
            <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <p class="text-[12px] text-slate-400">{{ folder.items_count }} scan{{ folder.items_count === 1 ? '' : 's' }}</p>
              <span v-if="folder.allow_ai_training" class="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                <AppIcon name="cpu" class="w-3 h-3" /> AI
              </span>
            </div>
          </div>
          <!-- Actions (shown on hover) -->
          <div class="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" @click.stop>
            <button class="w-6 h-6 rounded-md bg-slate-100 hover:bg-amber-50 hover:text-amber-600 flex items-center justify-center text-slate-500 transition-colors" title="Rename" @click="openRenameFolder(folder)">
              <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="w-6 h-6 rounded-md bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-500 transition-colors" title="Delete folder" @click="deleteFolder(folder)">
              <AppIcon name="trash" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Active folder: scan grid -->
      <div v-if="activeFolder">
        <!-- Breadcrumb + controls -->
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <button class="inline-flex items-center gap-1.5 text-[13px] text-slate-300 hover:text-white font-medium transition-colors" @click="closeFolder">
            <AppIcon name="arrow-left" class="w-4 h-4" />
            All Folders
          </button>
          <span class="text-slate-500">/</span>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg flex items-center justify-center" :class="folderBg(activeFolder.color)">
              <AppIcon name="folder" class="w-3.5 h-3.5" :class="folderIcon(activeFolder.color)" />
            </div>
            <span class="text-[14px] font-bold text-white">{{ activeFolder.name }}</span>
          </div>
          <span class="ml-auto text-[12px] text-slate-400">{{ folderScans.length }} scan{{ folderScans.length === 1 ? '' : 's' }}</span>
        </div>

        <!-- Search + sort -->
        <div class="flex flex-col sm:flex-row gap-2.5 mb-4">
          <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl py-2 px-3.5 flex-1">
            <AppIcon name="search" class="w-4 h-4 text-slate-400 shrink-0" />
            <input v-model="search" type="text" placeholder="Search in folder…" class="border-none outline-none text-[13.5px] text-slate-900 bg-transparent w-full placeholder:text-slate-400 font-sans" />
          </div>
          <select v-model="sortBy" class="py-2 px-3.5 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-900 outline-none cursor-pointer font-sans">
            <option value="date">Newest first</option>
            <option value="name">Name A–Z</option>
            <option value="confidence">Confidence ↓</option>
          </select>
        </div>

        <!-- Loading scans -->
        <div v-if="loadingScans" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div v-for="i in 3" :key="i" class="h-52 rounded-2xl bg-white/10 animate-pulse" />
        </div>

        <!-- Empty folder -->
        <div v-else-if="filteredScans.length === 0" class="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center bg-white/5 border border-white/10 rounded-2xl">
          <AppIcon name="mushroom" class="w-12 h-12 text-emerald-400/50" />
          <p class="text-[16px] font-semibold text-white">{{ search ? 'No matches' : 'Folder is empty' }}</p>
          <p class="text-[13px] text-slate-400">{{ search ? 'Try a different search term.' : 'Go to Scan History and add scans to this folder.' }}</p>
          <NuxtLink v-if="!search" to="/users/history" class="mt-1 py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold no-underline transition-colors">Go to History</NuxtLink>
        </div>

        <!-- Scan cards -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div
            v-for="item in filteredScans"
            :key="item.id"
            class="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 group hover:shadow-lg hover:-translate-y-0.5"
          >
            <!-- Image -->
            <div class="relative h-[160px] overflow-hidden bg-slate-100">
              <img :src="item.image" :alt="item.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
              <span
                class="absolute top-2.5 left-2.5 text-[11.5px] font-semibold py-[3px] px-2.5 rounded-full backdrop-blur-sm inline-flex items-center gap-1"
                :class="item.classification === 'Edible' ? 'bg-emerald-100/90 text-emerald-800' : 'bg-red-100/90 text-red-800'"
              >
                <AppIcon :name="item.classification === 'Edible' ? 'check-circle' : 'skull'" class="w-3.5 h-3.5" />
                {{ item.classification }}
              </span>
              <!-- Hover overlay -->
              <div class="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="py-1.5 px-3 rounded-lg bg-white text-slate-900 text-[12px] font-semibold hover:bg-slate-50 transition-colors" @click="openDetails(item)">
                  <AppIcon name="eye" class="w-3.5 h-3.5 inline mr-1" />View
                </button>
                <button class="py-1.5 px-3 rounded-lg bg-emerald-50 text-emerald-700 text-[12px] font-semibold hover:bg-emerald-100 transition-colors" @click="exportScanPdf(item)" title="Export PDF">
                  <svg class="w-3.5 h-3.5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <polyline points="9 15 12 18 15 15"/>
                  </svg>PDF
                </button>
                <button class="py-1.5 px-3 rounded-lg bg-red-100 text-red-700 text-[12px] font-semibold hover:bg-red-200 transition-colors" @click="removeScanFromFolder(item)" title="Remove from folder">
                  <AppIcon name="folder-minus" class="w-3.5 h-3.5 inline mr-1" />Remove
                </button>
              </div>
            </div>

            <!-- Card body -->
            <div class="p-3.5 flex flex-col gap-2 cursor-pointer" @click="openDetails(item)">
              <p class="text-[13.5px] font-semibold text-slate-900 italic truncate">{{ item.name }}</p>
              <!-- Confidence bar -->
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-slate-400 min-w-[62px]">Confidence</span>
                <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    :style="{ width: item.confidence + '%' }"
                    :class="item.confidence >= 90 ? 'bg-emerald-500' : item.confidence >= 75 ? 'bg-amber-400' : 'bg-red-400'"
                  />
                </div>
                <span class="text-[12px] font-bold text-slate-800 min-w-[32px] text-right">{{ item.confidence }}%</span>
              </div>
              <!-- Footer -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-100 mt-0.5">
                <span class="inline-flex items-center gap-1 text-[11.5px] text-slate-400 truncate max-w-[130px]">
                  <AppIcon name="map-pin" class="w-3.5 h-3.5 shrink-0" />{{ item.location }}
                </span>
                <span class="text-[11.5px] text-slate-400">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>

    <!-- ── Create / Rename Folder Modal ── -->
    <Teleport to="body">
      <div v-if="folderModal.open" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" @click.self="folderModal.open = false">
        <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
          <div class="p-5 border-b border-slate-100">
            <h3 class="text-[16px] font-bold text-slate-900">{{ folderModal.isEdit ? 'Rename Folder' : 'New Folder' }}</h3>
          </div>
          <div class="p-5 flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[13px] font-semibold text-slate-700">Folder Name</label>
              <input
                v-model="folderModal.name"
                type="text"
                maxlength="80"
                placeholder="e.g. Edible Finds, Field Trip 2026…"
                class="py-2.5 px-3.5 border border-slate-200 rounded-xl text-[14px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-sans"
                @keyup.enter="saveFolder"
              />
            </div>
            <!-- Colour picker -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[13px] font-semibold text-slate-700">Colour</label>
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="c in FOLDER_COLORS"
                  :key="c.value"
                  class="w-7 h-7 rounded-full border-2 transition-all"
                  :class="[c.bg, folderModal.color === c.value ? 'border-slate-800 scale-110' : 'border-transparent']"
                  @click="folderModal.color = c.value"
                />
              </div>
            </div>

            <!-- AI Training consent -->
            <div class="flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-colors" :class="folderModal.allowAiTraining ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'">
              <div class="flex-1 min-w-0">
                <p class="text-[13px] font-semibold text-slate-900 flex items-center gap-1.5">
                  <AppIcon name="cpu" class="w-3.5 h-3.5 text-emerald-600" />
                  Allow AI Training
                </p>
                <p class="text-[11.5px] text-slate-500 mt-0.5 leading-relaxed">Scans in this folder may be used to improve MycoVision's species identification AI. Your identity is never shared.</p>
              </div>
              <button
                class="relative w-10 h-[22px] rounded-full border-none cursor-pointer shrink-0 mt-0.5 transition-colors duration-200"
                :class="folderModal.allowAiTraining ? 'bg-emerald-500' : 'bg-slate-300'"
                @click="folderModal.allowAiTraining = !folderModal.allowAiTraining"
              >
                <div class="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" :class="folderModal.allowAiTraining ? 'translate-x-[18px]' : ''" />
              </button>
            </div>
          </div>
          <div class="p-4 bg-slate-50 flex justify-end gap-2 border-t border-slate-100">
            <button class="py-2 px-4 rounded-xl text-slate-500 text-[13px] font-semibold hover:bg-slate-100 transition-colors" @click="folderModal.open = false">Cancel</button>
            <button
              class="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold transition-colors disabled:opacity-50"
              :disabled="!folderModal.name.trim() || folderModal.saving"
              @click="saveFolder"
            >
              <span v-if="folderModal.saving" class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-1"></span>
              {{ folderModal.isEdit ? 'Save' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Scan Detail Modal ── -->
    <Teleport to="body">
      <div v-if="showModal && selectedItem" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" @click.self="showModal = false">
        <div class="bg-white rounded-2xl w-[540px] max-w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
          <!-- Image header -->
          <div class="relative h-[220px] bg-slate-900">
            <img :src="selectedItem.image" :alt="selectedItem.name" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 flex flex-col justify-between p-5">
              <div class="flex items-center justify-end">
                <button class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-colors cursor-pointer" @click="showModal = false">✕</button>
              </div>
              <div>
                <span
                  class="text-[11.5px] font-bold py-0.5 px-2.5 rounded-full mb-2 inline-flex items-center gap-1.5 backdrop-blur-md"
                  :class="selectedItem.classification === 'Edible' ? 'bg-emerald-100/90 text-emerald-800' : 'bg-red-100/90 text-red-800'"
                >
                  <AppIcon :name="selectedItem.classification === 'Edible' ? 'check-circle' : 'skull'" class="w-3.5 h-3.5" />
                  {{ selectedItem.classification === 'Edible' ? 'Edible Species' : 'Poisonous Species' }}
                </span>
                <h2 class="text-[20px] font-bold text-white italic truncate drop-shadow-md">{{ selectedItem.name }}</h2>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-5 flex flex-col gap-4">
            <!-- Confidence -->
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div class="flex items-center justify-between text-[13px] mb-2">
                <span class="font-semibold text-slate-700 inline-flex items-center gap-1.5"><AppIcon name="target" class="w-4 h-4 text-emerald-500" />AI Confidence</span>
                <span class="font-bold text-emerald-600 text-[14px]">{{ selectedItem.confidence }}%</span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full" :style="{ width: `${selectedItem.confidence}%` }" />
              </div>
            </div>

            <!-- Meta grid -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p class="text-[11.5px] font-semibold text-slate-400 uppercase tracking-wide mb-1 inline-flex items-center gap-1"><AppIcon name="calendar" class="w-3.5 h-3.5" />Date</p>
                <p class="text-[13.5px] font-semibold text-slate-900">{{ selectedItem.date }}</p>
              </div>
              <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p class="text-[11.5px] font-semibold text-slate-400 uppercase tracking-wide mb-1 inline-flex items-center gap-1"><AppIcon name="map-pin" class="w-3.5 h-3.5" />Location</p>
                <p class="text-[13.5px] font-semibold text-slate-900 truncate">{{ selectedItem.location }}</p>
              </div>
            </div>

            <!-- Description -->
            <div v-if="selectedItem.descriptionRest" class="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-2">About</p>
              <p class="text-[13px] text-slate-700 leading-relaxed"><em class="font-semibold">{{ selectedItem.name }}</em>{{ selectedItem.descriptionRest }}</p>
            </div>

            <!-- Habitat -->
            <div v-if="selectedItem.habitat" class="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <p class="text-[11.5px] font-bold text-emerald-700 uppercase tracking-wide mb-1">Habitat</p>
              <p class="text-[13px] text-emerald-800 leading-relaxed">{{ selectedItem.habitat }}</p>
            </div>

            <!-- Wikipedia -->
            <a v-if="selectedItem.reference" :href="selectedItem.reference" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-[13px] text-emerald-600 hover:text-emerald-700 font-medium no-underline">
              <AppIcon name="external-link" class="w-4 h-4" /> Read on Wikipedia
            </a>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user', middleware: 'auth' })

const config = useRuntimeConfig()
const { success: toastSuccess, error: toastError } = useToast()
const { confirm } = useConfirm()

// ── Colour palette for folders ──────────────────────────────────────────────
const FOLDER_COLORS = [
  { value: 'emerald', bg: 'bg-emerald-500' },
  { value: 'sky',     bg: 'bg-sky-500' },
  { value: 'violet',  bg: 'bg-violet-500' },
  { value: 'amber',   bg: 'bg-amber-500' },
  { value: 'rose',    bg: 'bg-rose-500' },
  { value: 'slate',   bg: 'bg-slate-500' },
]

function folderBg(color: string) {
  const map: Record<string, string> = {
    emerald: 'bg-emerald-100', sky: 'bg-sky-100', violet: 'bg-violet-100',
    amber: 'bg-amber-100', rose: 'bg-rose-100', slate: 'bg-slate-100',
  }
  return map[color] || 'bg-emerald-100'
}
function folderIcon(color: string) {
  const map: Record<string, string> = {
    emerald: 'text-emerald-600', sky: 'text-sky-600', violet: 'text-violet-600',
    amber: 'text-amber-600', rose: 'text-rose-600', slate: 'text-slate-600',
  }
  return map[color] || 'text-emerald-600'
}

// ── State ───────────────────────────────────────────────────────────────────
interface Folder { id: number; name: string; color: string; items_count: number; allow_ai_training: boolean }
interface Mushroom {
  id: number; name: string; classification: string; confidence: number
  location: string; date: string; image: string; notes?: string
  descriptionRest: string; habitat: string; reference: string
}

const folders       = ref<Folder[]>([])
const activeFolder  = ref<Folder | null>(null)
const folderScans   = ref<Mushroom[]>([])
const loadingFolders = ref(true)
const loadingScans   = ref(false)
const search         = ref('')
const sortBy         = ref('date')
const showModal      = ref(false)
const selectedItem   = ref<Mushroom | null>(null)

// ── Folder modal state ───────────────────────────────────────────────────────
const folderModal = reactive({
  open: false, isEdit: false, saving: false,
  id: null as number | null, name: '', color: 'emerald', allowAiTraining: false,
})

// ── Helpers ──────────────────────────────────────────────────────────────────
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

function mapScan(scan: any): Mushroom {
  const brief = resolveSpeciesBrief(scan)
  return {
    id: scan.id,
    name: brief.name,
    classification: brief.classification,
    confidence: brief.confidence,
    location: scan.location_name || (scan.latitude && scan.longitude ? `${scan.latitude}, ${scan.longitude}` : 'Unknown'),
    date: new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    image: scan.image_url || (scan.image_path ? `${config.public.apiBase.replace(/\/api$/, '')}/storage/${scan.image_path}` : 'https://placehold.co/400x400/e8f0e8/a3a3a3?text=No+Image'),
    notes: scan.notes,
    descriptionRest: brief.descriptionRest,
    habitat: brief.habitat,
    reference: brief.reference,
  }
}

// ── Computed ─────────────────────────────────────────────────────────────────
const filteredScans = computed(() => {
  let list = folderScans.value.filter(m =>
    m.name.toLowerCase().includes(search.value.toLowerCase())
  )
  if (sortBy.value === 'name')       list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  if (sortBy.value === 'confidence') list = [...list].sort((a, b) => b.confidence - a.confidence)
  return list
})

// ── API calls ─────────────────────────────────────────────────────────────────
async function fetchFolders() {
  loadingFolders.value = true
  try {
    const data = await $fetch<Folder[]>(`${config.public.apiBase}/collections`, { headers: getHeaders() })
    folders.value = data
  } catch {
    toastError('Failed to load folders.')
  } finally {
    loadingFolders.value = false
  }
}

async function fetchFolderScans(folder: Folder) {
  loadingScans.value = true
  folderScans.value = []
  try {
    const data = await $fetch<any[]>(`${config.public.apiBase}/collections/${folder.id}/scans`, { headers: getHeaders() })
    folderScans.value = data.map(mapScan)
  } catch {
    toastError('Failed to load folder contents.')
  } finally {
    loadingScans.value = false
  }
}

// ── Folder actions ────────────────────────────────────────────────────────────
function openCreateFolder() {
  folderModal.open = true
  folderModal.isEdit = false
  folderModal.id = null
  folderModal.name = ''
  folderModal.color = 'emerald'
  folderModal.allowAiTraining = false
}

function openRenameFolder(folder: Folder) {
  folderModal.open = true
  folderModal.isEdit = true
  folderModal.id = folder.id
  folderModal.name = folder.name
  folderModal.color = folder.color
  folderModal.allowAiTraining = folder.allow_ai_training
}

async function saveFolder() {
  if (!folderModal.name.trim()) return
  folderModal.saving = true
  try {
    if (folderModal.isEdit && folderModal.id) {
      const updated = await $fetch<Folder>(`${config.public.apiBase}/collections/${folderModal.id}`, {
        method: 'PUT', headers: getHeaders(),
        body: { name: folderModal.name.trim(), color: folderModal.color, allow_ai_training: folderModal.allowAiTraining },
      })
      const idx = folders.value.findIndex(f => f.id === folderModal.id)
      if (idx !== -1) folders.value[idx] = updated
      if (activeFolder.value?.id === folderModal.id) activeFolder.value = updated
      toastSuccess('Folder renamed.')
    } else {
      const created = await $fetch<Folder>(`${config.public.apiBase}/collections`, {
        method: 'POST', headers: getHeaders(),
        body: { name: folderModal.name.trim(), color: folderModal.color, allow_ai_training: folderModal.allowAiTraining },
      })
      folders.value.push(created)
      toastSuccess('Folder created.')
    }
    folderModal.open = false
  } catch {
    toastError('Failed to save folder.')
  } finally {
    folderModal.saving = false
  }
}

async function deleteFolder(folder: Folder) {
  const ok = await confirm({
    title: 'Delete folder?',
    message: `"${folder.name}" will be deleted. Your scans are not affected.`,
    tone: 'danger',
    confirmText: 'Delete Folder',
  })
  if (!ok) return
  try {
    await $fetch(`${config.public.apiBase}/collections/${folder.id}`, {
      method: 'DELETE', headers: getHeaders(),
    })
    folders.value = folders.value.filter(f => f.id !== folder.id)
    if (activeFolder.value?.id === folder.id) activeFolder.value = null
    toastSuccess('Folder deleted.')
  } catch {
    toastError('Failed to delete folder.')
  }
}

function openFolder(folder: Folder) {
  activeFolder.value = folder
  search.value = ''
  fetchFolderScans(folder)
}

function closeFolder() {
  activeFolder.value = null
  folderScans.value = []
}

// ── Scan actions ──────────────────────────────────────────────────────────────
function openDetails(item: Mushroom) {
  selectedItem.value = item
  showModal.value = true
}

async function removeScanFromFolder(item: Mushroom) {
  if (!activeFolder.value) return
  const ok = await confirm({
    title: 'Remove from folder?',
    message: `"${item.name}" will be removed from "${activeFolder.value.name}". The scan itself is not deleted.`,
    tone: 'warning',
    confirmText: 'Remove',
  })
  if (!ok) return
  try {
    await $fetch(`${config.public.apiBase}/collections/${activeFolder.value.id}/scans/${item.id}`, {
      method: 'DELETE', headers: getHeaders(),
    })
    folderScans.value = folderScans.value.filter(s => s.id !== item.id)
    // Update count in folder list
    const f = folders.value.find(f => f.id === activeFolder.value!.id)
    if (f) f.items_count = Math.max(0, f.items_count - 1)
    if (showModal.value && selectedItem.value?.id === item.id) showModal.value = false
    toastSuccess('Removed from folder.')
  } catch {
    toastError('Failed to remove scan.')
  }
}

// ── PDF Export Functions ────────────────────────────────────────────────────
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

function exportScanPdf(item: Mushroom | null) {
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
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <!-- Top Action Bar (Hidden during print) -->
  <div class="no-print" style="position: sticky; top: 0; z-index: 100; background: #0f172a; color: white; padding: 12px 24px; margin: -24px -24px 20px -24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-weight: 700; font-size: 14px;">MycoVision Mushroom Information Datasheet</span>
      <span style="font-size: 11px; background: rgba(16,185,129,0.2); color: #34d399; padding: 2px 8px; border-radius: 12px; font-weight: 600;">Specimen #SCAN-${esc(item.id)}</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 7px 16px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer;">
        Save as PDF / Print
      </button>
      <button onclick="window.close()" style="background: rgba(255,255,255,0.1); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.2); padding: 7px 14px; border-radius: 8px; font-size: 12px; cursor: pointer;">
        Close
      </button>
    </div>
  </div>

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

onMounted(fetchFolders)
</script>
