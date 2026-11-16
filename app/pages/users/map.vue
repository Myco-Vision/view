<template>
  <div class="max-w-7xl mx-auto space-y-5">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-extrabold text-white tracking-tight">Foraging Map</h1>
      <p class="text-sm text-emerald-100/75 mt-0.5">
        Explore your geotagged mushroom finds and record field journal notes.
      </p>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-wrap items-end gap-3">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Search Species or Place</label>
        <input
          v-model="filters.search"
          @keyup.enter="loadMapData"
          type="text"
          placeholder="e.g. Oyster, Mt. Makiling..."
          class="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">From</label>
        <input
          v-model="filters.date_from"
          @change="loadMapData"
          type="date"
          class="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
        />
      </div>

      <div>
        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">To</label>
        <input
          v-model="filters.date_to"
          @change="loadMapData"
          type="date"
          class="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
        />
      </div>

      <button
        @click="loadMapData"
        class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
      >
        Apply
      </button>
    </div>

    <!-- Clickable Filter Pills -->
    <div class="flex flex-wrap items-center gap-2 text-xs">
      <button
        @click="setClassification('all')"
        class="px-3.5 py-1.5 rounded-xl font-semibold border transition cursor-pointer"
        :class="filters.classification === 'all'
          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
      >
        {{ allPins.length }} Sightings
      </button>

      <button
        @click="setClassification('edible')"
        class="px-3.5 py-1.5 rounded-xl font-semibold border transition cursor-pointer"
        :class="filters.classification === 'edible'
          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'"
      >
        {{ edibleCount }} Edible
      </button>

      <button
        @click="setClassification('poisonous')"
        class="px-3.5 py-1.5 rounded-xl font-semibold border transition cursor-pointer"
        :class="filters.classification === 'poisonous'
          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'"
      >
        {{ poisonousCount }} Poisonous
      </button>
    </div>

    <!-- Relocate Pin Mode Banner -->
    <div
      v-if="relocateScanId"
      class="rounded-xl bg-amber-50 border border-amber-300 px-4 py-2.5 text-xs font-semibold text-amber-900 flex items-center justify-between"
    >
      <span>Click anywhere on the map to move this scan's pin.</span>
      <button @click="relocateScanId = null" class="underline font-bold cursor-pointer">Cancel</button>
    </div>

    <!-- Map + Detail Drawer Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
      <!-- Leaflet Map Container -->
      <div
        class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs relative"
        :class="selectedPin ? 'lg:col-span-2' : 'lg:col-span-3'"
      >
        <ClientOnly>
          <div
            ref="mapEl"
            class="w-full h-[500px] sm:h-[560px] z-0"
            :class="{ 'cursor-crosshair': !!relocateScanId }"
          />
          <template #fallback>
            <div class="w-full h-[500px] bg-slate-100 animate-pulse flex items-center justify-center text-sm text-slate-400">
              Loading interactive map...
            </div>
          </template>
        </ClientOnly>

        <!-- Empty overlay -->
        <div
          v-if="!loading && visiblePins.length === 0"
          class="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-3.5 shadow-md text-xs text-slate-600 max-w-sm z-[400]"
        >
          <p class="font-bold text-slate-900">No geotagged sightings found</p>
          <p class="mt-0.5">
            Try switching the filter above or scan a mushroom with GPS enabled.
          </p>
        </div>
      </div>

      <!-- Pin Detail Drawer -->
      <div
        v-if="selectedPin"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4"
      >
        <!-- Multi-scan spot switcher -->
        <div v-if="selectedSpotScans.length > 1" class="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-2">
          <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {{ selectedSpotScans.length }} mushrooms found at this spot
          </p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="(s, idx) in selectedSpotScans"
              :key="s.id"
              @click="selectPin(s)"
              class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer inline-flex items-center gap-1.5"
              :class="selectedPin.id === s.id
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'"
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="s.result_classification === 'edible' ? 'bg-emerald-500' : s.result_classification === 'poisonous' ? 'bg-rose-500' : 'bg-amber-500'"
              />
              <span>#{{ idx + 1 }} {{ s.result_name }}</span>
            </button>
          </div>
        </div>

        <div class="flex items-start justify-between gap-2">
          <div>
            <span
              class="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
              :class="selectedPin.result_classification === 'edible'
                ? 'bg-emerald-100 text-emerald-800'
                : selectedPin.result_classification === 'poisonous'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'"
            >
              {{ selectedPin.result_classification }}
            </span>
            <h2 class="text-lg font-extrabold text-slate-900 mt-1">{{ selectedPin.result_name }}</h2>
            <p v-if="selectedPin.species?.scientific_name" class="text-xs italic text-slate-500">
              {{ selectedPin.species.scientific_name }}
            </p>
          </div>
          <button
            @click="selectedPin = null"
            class="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <img
          v-if="selectedPin.image_url"
          :src="selectedPin.image_url"
          :alt="selectedPin.result_name"
          class="w-full h-44 object-cover rounded-xl border border-slate-100"
        />

        <div class="text-xs text-slate-600 space-y-1.5">
          <p><strong class="text-slate-800">Confidence:</strong> {{ Number(selectedPin.confidence_level || 0).toFixed(1) }}%</p>
          <p><strong class="text-slate-800">Location:</strong> {{ selectedPin.location_name || `${selectedPin.latitude.toFixed(4)}, ${selectedPin.longitude.toFixed(4)}` }}</p>
          <p><strong class="text-slate-800">Spotted:</strong> {{ formatDate(selectedPin.created_at) }}</p>
        </div>

        <!-- Field Journal Notes -->
        <div class="pt-3 border-t border-slate-100 space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Field Journal Notes</label>
            <textarea
              v-model="detailForm.notes"
              rows="3"
              placeholder="Substrate, weather, gill color, nearby trees..."
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              @click="savePinDetails"
              :disabled="savingDetails"
              class="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer"
            >
              {{ savingDetails ? 'Saving...' : 'Save Notes' }}
            </button>
            <button
              @click="relocateScanId = selectedPin.id"
              class="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Move Pin
            </button>
          </div>
          <p v-if="detailSavedMsg" class="text-[11px] font-semibold text-emerald-600">{{ detailSavedMsg }}</p>
        </div>

        <a
          :href="`https://www.google.com/maps/search/?api=1&query=${selectedPin.latitude},${selectedPin.longitude}`"
          target="_blank"
          rel="noopener"
          class="block w-full text-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold no-underline transition"
        >
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'

definePageMeta({ layout: 'user' })

const config = useRuntimeConfig()
const route = useRoute()

const mapEl = ref<HTMLElement | null>(null)
let mapInstance: any = null
let markersLayer: any = null
let leafletLib: any = null

const loading = ref(true)
const allPins = ref<Array<any>>([])
const selectedPin = ref<any>(null)
const selectedSpotScans = ref<Array<any>>([])
const relocateScanId = ref<number | null>(null)

const savingDetails = ref(false)
const detailSavedMsg = ref('')
const detailForm = ref({
  notes: '',
})

const filters = ref({
  search: '',
  classification: 'all' as 'all' | 'edible' | 'poisonous',
  date_from: '',
  date_to: '',
})

const edibleCount = computed(() => allPins.value.filter(p => p.result_classification === 'edible').length)
const poisonousCount = computed(() => allPins.value.filter(p => p.result_classification === 'poisonous').length)

const visiblePins = computed(() => {
  if (filters.value.classification === 'all') return allPins.value
  return allPins.value.filter(p => p.result_classification === filters.value.classification)
})

function setClassification(next: 'all' | 'edible' | 'poisonous') {
  filters.value.classification = next
  selectedPin.value = null
  selectedSpotScans.value = []
  renderMarkers()
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function selectPin(pin: any, spotScans?: Array<any>) {
  selectedPin.value = pin
  if (spotScans) {
    selectedSpotScans.value = spotScans
  }
  detailSavedMsg.value = ''
  detailForm.value = {
    notes: pin.notes || '',
  }
}

async function loadMapData() {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const params = new URLSearchParams({ scope: 'mine' })
    if (filters.value.search.trim()) params.set('search', filters.value.search.trim())
    if (filters.value.date_from) params.set('date_from', filters.value.date_from)
    if (filters.value.date_to) params.set('date_to', filters.value.date_to)

    const data: any = await $fetch(`${config.public.apiBase}/scans/map?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    allPins.value = data.pins || []
    renderMarkers()

    // Deep link ?scan=ID
    const qScanId = Number(route.query.scan)
    if (qScanId && !selectedPin.value) {
      const match = allPins.value.find(p => p.id === qScanId)
      if (match) {
        selectPin(match)
        mapInstance?.setView([match.latitude, match.longitude], 14)
      }
    }
  } catch (e: any) {
    console.error('Failed to load map data', e)
  } finally {
    loading.value = false
  }
}

function renderMarkers() {
  if (!mapInstance || !markersLayer || !leafletLib) return
  markersLayer.clearLayers()

  const bounds: Array<[number, number]> = []

  // Group scans at the same spot (~11m precision)
  const spotMap = new Map<string, { latitude: number; longitude: number; scans: Array<any> }>()
  for (const pin of visiblePins.value) {
    const key = `${Number(pin.latitude).toFixed(4)},${Number(pin.longitude).toFixed(4)}`
    if (!spotMap.has(key)) {
      spotMap.set(key, {
        latitude: Number(pin.latitude),
        longitude: Number(pin.longitude),
        scans: [],
      })
    }
    spotMap.get(key)!.scans.push(pin)
  }

  for (const spot of spotMap.values()) {
    if (spot.scans.length === 1) {
      const pin = spot.scans[0]
      const color =
        pin.result_classification === 'edible'
          ? '#10b981'
          : pin.result_classification === 'poisonous'
            ? '#f43f5e'
            : '#f59e0b'

      const marker = leafletLib.circleMarker([spot.latitude, spot.longitude], {
        radius: 9,
        fillColor: color,
        color: '#ffffff',
        weight: 2.5,
        opacity: 1,
        fillOpacity: 0.92,
      })

      marker.bindTooltip(`${pin.result_name} (${pin.result_classification})`, { direction: 'top' })
      marker.on('click', () => {
        selectPin(pin, [pin])
      })
      marker.addTo(markersLayer)
    } else {
      const hasEdible = spot.scans.some(s => s.result_classification === 'edible')
      const hasPoisonous = spot.scans.some(s => s.result_classification === 'poisonous')
      const bg = hasEdible && hasPoisonous ? '#0f172a' : hasPoisonous ? '#f43f5e' : '#10b981'

      const icon = leafletLib.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;border-radius:9999px;background:${bg};color:#fff;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;">${spot.scans.length}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      const marker = leafletLib.marker([spot.latitude, spot.longitude], { icon })
      marker.bindTooltip(`${spot.scans.length} mushrooms at this spot`, { direction: 'top' })
      marker.on('click', () => {
        selectPin(spot.scans[0], spot.scans)
      })
      marker.addTo(markersLayer)
    }

    bounds.push([spot.latitude, spot.longitude])
  }

  if (bounds.length > 0) {
    mapInstance.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 })
  }
}

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
    if (!res.ok) return null
    const json = await res.json()
    return json?.display_name ? String(json.display_name).split(',').slice(0, 3).join(', ') : null
  } catch {
    return null
  }
}

async function handleMapClick(lat: number, lng: number) {
  const scanId = relocateScanId.value
  if (!scanId) return

  try {
    const token = localStorage.getItem('token')
    const placeName = await reverseGeocode(lat, lng)
    await $fetch(`${config.public.apiBase}/scans/${scanId}/location`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        latitude: lat,
        longitude: lng,
        location_name: placeName,
        location_source: 'manual',
      },
    })
    relocateScanId.value = null
    await loadMapData()
    const updated = allPins.value.find(p => p.id === scanId)
    if (updated) selectPin(updated)
  } catch (e) {
    console.error('Failed to update scan location', e)
  }
}

async function savePinDetails() {
  if (!selectedPin.value) return
  savingDetails.value = true
  detailSavedMsg.value = ''
  try {
    const token = localStorage.getItem('token')
    const updated: any = await $fetch(`${config.public.apiBase}/scans/${selectedPin.value.id}/details`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: detailForm.value,
    })
    selectedPin.value.notes = updated.notes
    const inList = allPins.value.find(p => p.id === selectedPin.value.id)
    if (inList) {
      inList.notes = updated.notes
    }
    detailSavedMsg.value = 'Saved!'
  } catch (e) {
    console.error('Failed to save details', e)
  } finally {
    savingDetails.value = false
  }
}

onMounted(async () => {
  leafletLib = (await import('leaflet')).default
  await nextTick()

  if (mapEl.value) {
    mapInstance = leafletLib.map(mapEl.value).setView([14.5995, 120.9842], 6)
    leafletLib.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance)

    markersLayer = leafletLib.layerGroup().addTo(mapInstance)
    mapInstance.on('click', (e: any) => {
      if (relocateScanId.value) {
        handleMapClick(e.latlng.lat, e.latlng.lng)
      }
    })
  }

  await loadMapData()
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>
