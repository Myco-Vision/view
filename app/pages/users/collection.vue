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
    <div class="grid grid-cols-4 gap-3">
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
      <div class="flex items-center gap-3.5 py-3.5 px-[18px] rounded-xl bg-white border border-[#e2e8f0] border-l-[3px] border-l-[#10b981]">
        <span class="text-[26px] leading-none">🎯</span>
        <div>
          <p class="text-[22px] font-bold text-[#0f172a] leading-none">{{ avgConfidence }}%</p>
          <p class="text-[12px] text-[#64748b] mt-[3px]">Avg. Confidence</p>
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
    <div v-if="filtered.length" class="grid grid-cols-3 gap-3.5">
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
          <!-- hover overlay -->
          <div class="absolute inset-0 bg-black/45 flex items-center justify-center gap-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button class="flex items-center gap-1.5 py-[7px] px-3.5 rounded-lg border-none text-[12.5px] font-semibold font-sans cursor-pointer bg-white text-[#0f172a] transition-colors duration-[0.18s] hover:bg-[#f0fdf4]" title="View details">
              <svg class="w-[14px] h-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              View
            </button>
            <button class="flex items-center gap-1.5 py-[7px] px-3.5 rounded-lg border-none text-[12.5px] font-semibold font-sans cursor-pointer bg-[#fee2e2] text-[#991b1b] transition-colors duration-[0.18s] hover:bg-[#fecaca]" title="Remove from collection">
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
        <div class="p-3.5 pb-3 flex flex-col gap-2">
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

          <!-- Meta -->
          <div class="flex flex-col gap-1">
            <span class="flex items-center gap-1.5 text-[12px] text-[#64748b]">
              <svg class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ item.location }}
            </span>
            <span class="flex items-center gap-1.5 text-[12px] text-[#64748b]">
              <svg class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
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
    <div v-else class="flex flex-col items-center justify-center gap-2.5 py-[60px] px-5 text-center bg-white border border-[#e2e8f0] rounded-[14px]">
      <div class="text-[52px] leading-none">🍄</div>
      <p class="text-[17px] font-semibold text-[#0f172a]">No mushrooms found</p>
      <p class="text-[13.5px] text-[#64748b]">Start scanning mushrooms and save them to your collection!</p>
      <NuxtLink to="/scan" class="mt-2 py-2.5 px-6 rounded-[10px] bg-[#10b981] text-white text-[14px] font-semibold no-underline transition-colors duration-[0.18s] hover:bg-[#059669]">Scan a Mushroom</NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const config = useRuntimeConfig()
const firstName = ref('User')

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    firstName.value = user.first_name || user.name?.split(' ')[0] || user.username || 'User'
  }
  fetchCollection()
})

// ── Filters & sort ────────────────────────────────────
const filters = [
  { label: 'All',           value: 'all' },
  { label: '✅ Edible',     value: 'Edible' },
  { label: '☠️ Poisonous',  value: 'Poisonous' },
]
const activeFilter = ref('all')
const search = ref('')
const sortBy = ref('date')

// ── Dynamic collection data ────────────────────────────
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

async function fetchCollection() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const data = await $fetch<any[]>(`${config.public.apiBase}/scans`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    collection.value = data.map(scan => {
      const rawClass = scan.result_classification || 'unknown';
      return {
        id: scan.id,
        name: scan.result_name || 'Unknown Species',
        classification: rawClass.charAt(0).toUpperCase() + rawClass.slice(1),
        confidence: scan.confidence_level || 0,
        location: scan.latitude && scan.longitude ? `${scan.latitude}, ${scan.longitude}` : 'Unknown Location',
        date: new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: scan.image_path ? `${config.public.apiBase.replace('/api', '')}/storage/${scan.image_path}` : 'https://placehold.co/400x400/e8f0e8/a3a3a3?text=No+Image'
      }
    })
  } catch (error) {
    console.error('Failed to fetch collection:', error)
  }
}

// ── Computed ──────────────────────────────────────────
const edibleCount    = computed(() => collection.value.filter(m => m.classification === 'Edible').length)
const poisonousCount = computed(() => collection.value.filter(m => m.classification === 'Poisonous').length)
const avgConfidence  = computed(() => {
  if (!collection.value.length) return 0
  return Math.round(collection.value.reduce((sum, m) => sum + m.confidence, 0) / collection.value.length)
})

const filtered = computed(() => {
  let list = collection.value.filter(m => {
    const matchFilter = activeFilter.value === 'all' || m.classification === activeFilter.value
    const matchSearch = m.name.toLowerCase().includes(search.value.toLowerCase())
    return matchFilter && matchSearch
  })
  if (sortBy.value === 'name')       list = [...list].sort((a,b) => a.name.localeCompare(b.name))
  if (sortBy.value === 'confidence') list = [...list].sort((a,b) => b.confidence - a.confidence)
  return list
})
</script>
