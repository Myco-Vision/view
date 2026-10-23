<template>
  <div class="flex flex-col gap-[18px]">

    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-[22px] font-normal text-[#0f172a]">Welcome, <strong class="font-bold">{{ firstName }}!</strong></h1>
        <p class="text-[13px] text-[#64748b] mt-0.5">Your Mushroom Collection</p>
      </div>
      <span class="text-[13px] font-medium bg-[#f8fafc] text-[#64748b] py-1 px-3.5 rounded-[20px] mt-1">{{ filtered.length }} mushrooms</span>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="flex items-center gap-3.5 py-3.5 px-[18px] rounded-xl bg-white border border-[#e2e8f0] border-l-[3px] border-l-[#a78bfa]">
        <span class="text-[26px] leading-none">🍄</span>
        <div>
          <p class="text-[22px] font-bold text-[#0f172a] leading-none">{{ collection.length }}</p>
          <p class="text-[12px] text-[#64748b] mt-[3px]">Total Collected</p>
        </div>
      </div>
      <div class="flex items-center gap-3.5 py-3.5 px-[18px] rounded-xl bg-white border border-[#e2e8f0] border-l-[3px] border-l-[#22c55e]">
        <span class="text-[26px] leading-none">✅</span>
        <div>
          <p class="text-[22px] font-bold text-[#0f172a] leading-none">{{ edibleCount }}</p>
          <p class="text-[12px] text-[#64748b] mt-[3px]">Edible</p>
        </div>
      </div>
      <div class="flex items-center gap-3.5 py-3.5 px-[18px] rounded-xl bg-white border border-[#e2e8f0] border-l-[3px] border-l-[#ef4444]">
        <span class="text-[26px] leading-none">☠️</span>
        <div>
          <p class="text-[22px] font-bold text-[#0f172a] leading-none">{{ poisonousCount }}</p>
          <p class="text-[12px] text-[#64748b] mt-[3px]">Poisonous</p>
        </div>
      </div>
      <div class="flex items-center gap-3.5 py-3.5 px-[18px] rounded-xl bg-white border border-[#e2e8f0] border-l-[3px] border-l-[#ec4899]">
        <span class="text-[26px] leading-none">❤️</span>
        <div>
          <p class="text-[22px] font-bold text-[#0f172a] leading-none">{{ favorites.length }}</p>
          <p class="text-[12px] text-[#64748b] mt-[3px]">Favorites Saved</p>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-2.5 flex-wrap">
      <!-- Search -->
      <div class="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-[10px] py-2 px-3.5 flex-1 min-w-[180px]">
        <svg class="w-[15px] h-[15px] text-[#94a3b8] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search mushrooms…" class="border-none outline-none font-sans text-[13.5px] text-[#0f172a] bg-transparent w-full placeholder:text-[#94a3b8]" />
      </div>

      <!-- Filter chips -->
      <div class="flex gap-1.5">
        <button
          v-for="f in filters"
          :key="f.value"
          class="py-[7px] px-3.5 rounded-[20px] border border-[#e2e8f0] bg-white text-[13px] font-sans text-[#64748b] cursor-pointer transition-all duration-[0.18s] font-medium whitespace-nowrap hover:bg-[#f8fafc] hover:text-[#0f172a]"
          :class="{ 'bg-[#10b981] border-[#10b981] text-white hover:bg-[#10b981] hover:text-white': activeFilter === f.value }"
          @click="activeFilter = f.value"
        >{{ f.label }}</button>
      </div>

      <!-- Sort -->
      <select v-model="sortBy" class="py-2 px-3.5 rounded-[10px] border border-[#e2e8f0] bg-white font-sans text-[13px] text-[#0f172a] cursor-pointer outline-none">
        <option value="date">Newest first</option>
        <option value="name">Name A–Z</option>
        <option value="confidence">Confidence ↓</option>
      </select>
    </div>

    <!-- Grid -->
    <div v-if="filtered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden transition-all duration-200 group hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] hover:-translate-y-[2px]"
      >
        <!-- Image area -->
        <div class="relative h-[160px] overflow-hidden bg-[#e8f0e8]">
          <img :src="item.image" :alt="item.name" class="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.04]" />
          <!-- classification ribbon -->
          <span
            class="absolute top-2.5 left-2.5 text-[11.5px] font-semibold py-[3px] px-2.5 rounded-[20px] backdrop-blur-[4px]"
            :class="item.classification === 'Edible' ? 'bg-[#dcfce7eb] text-[#166534]' : 'bg-[#fee2e2eb] text-[#991b1b]'"
          >
            {{ item.classification === 'Edible' ? '✅ Edible' : '☠️ Poisonous' }}
          </span>
          <!-- Heart Button -->
          <button 
            class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full border-none flex items-center justify-center cursor-pointer transition-transform duration-200 backdrop-blur-md z-10"
            :class="isFavorite(item.id) ? 'bg-[#fef2f2]/90 text-[#ef4444]' : 'bg-black/40 text-white hover:bg-black/60'"
            :title="isFavorite(item.id) ? 'Remove favorite' : 'Add to favorites'"
            @click.stop="toggleFavorite(item)"
          >
            <svg class="w-4 h-4" :fill="isFavorite(item.id) ? '#ef4444' : 'none'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <!-- hover overlay -->
          <div class="absolute inset-0 bg-black/45 flex items-center justify-center gap-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button 
              class="flex items-center gap-1.5 py-[7px] px-3.5 rounded-lg border-none text-[12.5px] font-semibold font-sans cursor-pointer bg-white text-[#0f172a] transition-colors duration-[0.18s] hover:bg-[#f0fdf4]" 
              title="View details"
              @click="openDetails(item)"
            >
              <svg class="w-[14px] h-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              View
            </button>
            <button 
              class="flex items-center gap-1.5 py-[7px] px-3.5 rounded-lg border-none text-[12.5px] font-semibold font-sans cursor-pointer bg-[#fee2e2] text-[#991b1b] transition-colors duration-[0.18s] hover:bg-[#fecaca]" 
              title="Remove from collection"
              @click="deleteItem(item)"
            >
              <svg class="w-[14px] h-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
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
        <div class="p-3.5 pb-3 flex flex-col gap-2 cursor-pointer" @click="openDetails(item)">
          <p class="text-[13.5px] font-semibold text-[#0f172a] italic whitespace-nowrap overflow-hidden text-ellipsis">{{ item.name }}</p>

          <!-- Confidence bar -->
          <div class="flex items-center gap-2">
            <span class="text-[11px] text-[#64748b] min-w-[64px]">Confidence</span>
            <div class="flex-1 h-1.5 bg-[#e8f0e8] rounded-[10px] overflow-hidden">
              <div
                class="h-full rounded-[10px] transition-[width] duration-400 ease-in-out"
                :style="{ width: item.confidence + '%' }"
                :class="item.confidence >= 90 ? 'bg-[#22c55e]' : item.confidence >= 75 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'"
              />
            </div>
            <span class="text-[12px] font-semibold text-[#0f172a] min-w-[32px] text-right">{{ item.confidence }}%</span>
          </div>

          <!-- Footer meta -->
          <div class="flex items-center justify-between text-[11.5px] text-[#94a3b8] pt-1 border-t border-[#f1f5f9] mt-0.5">
            <span>📍 {{ item.location }}</span>
            <span>{{ item.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex-1 flex flex-col items-center justify-center gap-2.5 py-[60px] px-5 text-center bg-white border border-[#e2e8f0] rounded-[14px]">
      <div class="text-[52px] leading-none">🍄</div>
      <p class="text-[17px] font-semibold text-[#0f172a]">No mushrooms found</p>
      <p class="text-[13.5px] text-[#64748b]">Start scanning mushrooms and save them to your collection!</p>
      <NuxtLink to="/users/scan" class="mt-2 py-2.5 px-6 rounded-[10px] bg-[#10b981] text-white text-[14px] font-semibold no-underline transition-colors duration-[0.18s] hover:bg-[#059669]">Scan a Mushroom</NuxtLink>
    </div>

    <!-- Complete Detail Modal -->
    <Teleport to="body">
      <div v-if="showModal && selectedItem" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" @click.self="showModal = false">
        <div class="bg-white rounded-2xl w-[540px] max-w-full shadow-2xl overflow-hidden border border-[#e2e8f0] animate-in fade-in zoom-in duration-200">
          
          <!-- Image Header -->
          <div class="relative h-[220px] bg-[#0f172a]">
            <img :src="selectedItem.image" :alt="selectedItem.name" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
              <div class="flex items-end justify-between w-full">
                <div>
                  <span
                    class="text-[11.5px] font-bold py-1 px-3 rounded-full mb-1.5 inline-block backdrop-blur-md"
                    :class="selectedItem.classification === 'Edible' ? 'bg-[#dcfce7]/90 text-[#166534]' : 'bg-[#fee2e2]/90 text-[#991b1b]'"
                  >
                    {{ selectedItem.classification === 'Edible' ? '✅ Edible Species' : '☠️ Poisonous Species' }}
                  </span>
                  <h2 class="text-[20px] font-bold text-white italic drop-shadow-md">{{ selectedItem.name }}</h2>
                </div>
                <button 
                  class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-lg hover:bg-white/40 cursor-pointer"
                  @click="showModal = false"
                >✕</button>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-5 flex flex-col gap-4">
            <div class="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5 flex flex-col gap-2">
              <div class="flex items-center justify-between text-[13px]">
                <span class="font-semibold text-[#334155]">🎯 AI Confidence Score</span>
                <span class="font-bold text-[#10b981] text-[14px]">{{ selectedItem.confidence }}%</span>
              </div>
              <div class="w-full bg-[#e2e8f0] h-2.5 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-[#10b981] to-[#059669] h-full rounded-full" :style="{ width: `${selectedItem.confidence}%` }"></div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl flex flex-col gap-1">
                <span class="text-[11.5px] font-semibold text-[#94a3b8] uppercase">📅 Collection Date</span>
                <span class="text-[13px] font-semibold text-[#0f172a]">{{ selectedItem.date }}</span>
              </div>
              <div class="p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl flex flex-col gap-1">
                <span class="text-[11.5px] font-semibold text-[#94a3b8] uppercase">📍 Location</span>
                <span class="text-[13px] font-semibold text-[#0f172a] truncate">{{ selectedItem.location }}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
            <button 
              class="py-2 px-4 rounded-xl border text-[13px] font-semibold cursor-pointer flex items-center gap-1.5"
              :class="isFavorite(selectedItem.id) ? 'bg-[#fef2f2] border-[#fecaca] text-[#ef4444]' : 'bg-white border-[#e2e8f0] text-[#475569] hover:text-[#ef4444]'"
              @click="toggleFavorite(selectedItem)"
            >
              <span>{{ isFavorite(selectedItem.id) ? '❤️ Favorite' : '🤍 Add to Favorites' }}</span>
            </button>
            <button class="py-2 px-5 rounded-xl bg-[#0f172a] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#334155]" @click="showModal = false">
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

// User info
const firstName = ref('Explorer')

// Filters & sort
const filters = [
  { label: 'All',           value: 'all' },
  { label: '✅ Edible',     value: 'Edible' },
  { label: '☠️ Poisonous',  value: 'Poisonous' },
  { label: '❤️ Favorites',  value: 'favorites' },
]
const activeFilter = ref('all')
const search = ref('')
const sortBy = ref('date')

interface Mushroom {
  id: number;
  name: string;
  classification: string;
  confidence: number;
  location: string;
  date: string;
  image: string;
}

const collection = ref<Mushroom[]>([])
const favorites = ref<number[]>([])
const showModal = ref(false)
const selectedItem = ref<Mushroom | null>(null)

onMounted(async () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    firstName.value = user.first_name || user.name?.split(' ')[0] || 'Explorer'
  }
  loadFavorites()
  fetchCollection()
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

function toggleFavorite(item: Mushroom) {
  const index = favorites.value.indexOf(item.id)
  if (index > -1) {
    favorites.value.splice(index, 1)
    // Remove from collection list since it's no longer a favorite
    collection.value = collection.value.filter(m => m.id !== item.id)
    if (selectedItem.value?.id === item.id) {
      showModal.value = false
    }
  } else {
    favorites.value.push(item.id)
  }
  saveFavorites()
}

function openDetails(item: Mushroom) {
  selectedItem.value = item
  showModal.value = true
}

async function fetchCollection() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const data = await $fetch<any[]>(`${config.public.apiBase}/scans`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    // ONLY include mushrooms that have been added to favorites
    collection.value = data
      .filter(scan => isFavorite(scan.id))
      .map(scan => {
        const rawClass = scan.result_classification || 'unknown';
        return {
          id: scan.id,
          name: scan.result_name || 'Unknown Species',
          classification: rawClass.charAt(0).toUpperCase() + rawClass.slice(1),
          confidence: scan.confidence_level || 0,
          location: scan.location_name || (scan.latitude && scan.longitude ? `${scan.latitude}, ${scan.longitude}` : 'Unknown Location'),
          date: new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          image: scan.image_path ? `${config.public.apiBase.replace('/api', '')}/storage/${scan.image_path}` : 'https://placehold.co/400x400/e8f0e8/a3a3a3?text=No+Image'
        }
      })
  } catch (error) {
    console.error('Failed to fetch collection:', error)
  }
}

async function deleteItem(item: Mushroom) {
  if (!confirm(`Remove "${item.name}" from your collection?`)) return
  try {
    const token = localStorage.getItem('token')
    await $fetch(`${config.public.apiBase}/scans/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    collection.value = collection.value.filter(m => m.id !== item.id)
  } catch (error) {
    alert('Failed to delete item.')
  }
}

// Computed
const edibleCount    = computed(() => collection.value.filter(m => m.classification === 'Edible').length)
const poisonousCount = computed(() => collection.value.filter(m => m.classification === 'Poisonous').length)

const filtered = computed(() => {
  let list = collection.value.filter(m => {
    let matchFilter = true
    if (activeFilter.value === 'favorites') {
      matchFilter = isFavorite(m.id)
    } else if (activeFilter.value !== 'all') {
      matchFilter = m.classification === activeFilter.value
    }
    const matchSearch = m.name.toLowerCase().includes(search.value.toLowerCase())
    return matchFilter && matchSearch
  })

  return list.sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    if (sortBy.value === 'confidence') return b.confidence - a.confidence
    return b.id - a.id
  })
})
</script>
