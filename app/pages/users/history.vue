<template>
  <div class="flex flex-col gap-[18px]">

    <!-- Header row -->
    <div class="flex items-baseline gap-3">
      <h1 class="text-[22px] font-bold text-[#0f172a]">Scan History</h1>
      <span class="text-[13px] text-[#64748b] bg-[#f8fafc] py-0.5 px-2.5 rounded-[20px]">{{ filtered.length }} records</span>
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
        <div class="w-[70px] h-[70px] rounded-[10px] overflow-hidden shrink-0 bg-[#f8fafc]">
          <img :src="item.image" :alt="item.name" class="w-full h-full object-cover block" />
        </div>

        <!-- Main info -->
        <div class="flex-1 flex flex-col gap-2 min-w-0">
          <div class="flex items-center gap-2.5 flex-wrap">
            <p class="text-[15px] font-semibold text-[#0f172a] italic">{{ item.name }}</p>
            <span
              class="text-[12px] font-semibold py-[3px] px-2.5 rounded-[20px]"
              :class="item.classification === 'Edible' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'"
            >
              {{ item.classification === 'Edible' ? '✅' : '☠️' }} {{ item.classification }}
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
        <div class="flex gap-2 shrink-0">
          <button class="w-[34px] h-[34px] rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center cursor-pointer transition-colors duration-[0.18s] text-[#059669] hover:bg-[#dcfce7] hover:border-[#10b981]" title="View details">
            <svg class="w-[15px] h-[15px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button class="w-[34px] h-[34px] rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center cursor-pointer transition-colors duration-[0.18s] text-[#dc2626] hover:bg-[#fee2e2] hover:border-[#fca5a5]" title="Delete">
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
      <NuxtLink to="/scan" class="mt-2 py-2.5 px-6 rounded-[10px] bg-[#10b981] text-white text-[14px] font-semibold no-underline transition-colors duration-[0.18s] hover:bg-[#059669]">Go to Scan</NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const config = useRuntimeConfig()

// ── Filters ───────────────────────────────────────────
const filters = [
  { label: 'All',       value: 'all' },
  { label: '✅ Edible', value: 'Edible' },
  { label: '☠️ Poisonous', value: 'Poisonous' },
]
const activeFilter = ref('all')
const search = ref('')

// ── Dynamic scan data ─────────────────────────────────
interface MushroomScan {
  id: number;
  name: string;
  classification: string;
  confidence: number;
  date: string;
  location: string;
  image: string;
}

const scans = ref<MushroomScan[]>([])

onMounted(async () => {
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
        location: scan.latitude && scan.longitude ? `${scan.latitude}, ${scan.longitude}` : 'Unknown Location',
        date: new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
        image: scan.image_path ? `${config.public.apiBase.replace('/api', '')}/storage/${scan.image_path}` : 'https://placehold.co/320x320/e8f0e8/a3a3a3?text=No+Image'
      }
    })
  } catch (error) {
    console.error('Failed to fetch scans:', error)
  }
})
// ── Computed filtered list ────────────────────────────
const filtered = computed(() =>
  scans.value.filter(s => {
    const matchesFilter = activeFilter.value === 'all' || s.classification === activeFilter.value
    const matchesSearch = s.name.toLowerCase().includes(search.value.toLowerCase())
    return matchesFilter && matchesSearch
  })
)
</script>
