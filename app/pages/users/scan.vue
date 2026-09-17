<template>
  <div class="flex flex-col gap-[18px] h-full">

    <!-- Welcome Header -->
    <h1 class="text-[22px] font-normal text-[#0f172a]">Welcome, <strong class="font-bold">{{ firstName }}!</strong></h1>

    <!-- Two-column card -->
    <div class="grid grid-cols-1 lg:grid-cols-2 bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden flex-1">

      <!-- ── LEFT: Input Panel ─────────────────────────── -->
      <div class="p-6 py-6 px-[22px] flex flex-col gap-3 overflow-hidden border-r border-[#e2e8f0]">
        <h2 class="text-[15px] font-semibold text-[#0f172a] text-center mb-0.5">Scan Mushroom</h2>

        <!-- Camera Overlay Modal -->
        <div v-if="isCameraOpen" class="absolute inset-0 bg-black z-50 flex flex-col">
          <div class="relative w-full h-full flex flex-col">
            <video ref="videoRef" autoplay playsinline class="flex-1 w-full object-cover bg-[#111]"></video>
            <div class="absolute bottom-0 left-0 right-0 h-[80px] bg-black/60 flex items-center justify-between px-5 backdrop-blur-[5px]">
              <button class="bg-transparent border-none text-white cursor-pointer text-[14px] font-medium font-sans w-[60px] text-left" @click="closeCamera">Cancel</button>
              <button class="w-14 h-14 rounded-full border-[3px] border-white flex items-center justify-center p-0.5 transition-transform duration-[0.15s] active:scale-[0.92] bg-transparent cursor-pointer" @click="takeSnapshot">
                <span class="w-full h-full bg-white rounded-full"></span>
              </button>
              <div style="width: 60px;"></div> <!-- Spacer -->
            </div>
          </div>
        </div>

        <!-- Capture box -->
        <button class="flex-1 flex flex-col items-center justify-center gap-2.5 p-5 border-2 border-dashed border-[#b0cfb0] rounded-xl bg-[#f8fbf3] cursor-pointer transition-colors duration-[0.18s] hover:bg-[#ecf5e4] hover:border-[#10b981] font-sans text-center min-h-0" @click="openCamera">
          <span class="text-[#2d3a2d]">
            <svg class="w-[42px] h-[42px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8
                       a2 2 0 0 1 2-2h4l2-3h6l2 3h4
                       a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </span>
          <span class="text-[14px] font-semibold text-[#0f172a]">Capture Mushroom</span>
        </button>

        <p class="text-center text-[13px] text-[#64748b] -my-[2px]">or</p>

        <!-- Upload box -->
        <label
          class="flex-1 flex flex-col items-center justify-center gap-2.5 p-5 border-2 border-dashed border-[#b0cfb0] rounded-xl bg-[#f8fbf3] cursor-pointer transition-colors duration-[0.18s] hover:bg-[#ecf5e4] hover:border-[#10b981] font-sans text-center min-h-0"
          :class="{ 'bg-[#ecf5e4] border-[#10b981]': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="absolute w-[1px] h-[1px] overflow-hidden [clip:rect(0,0,0,0)]"
            @change="handleFileChange"
          />
          <span class="text-[#2d3a2d]">
            <svg class="w-[42px] h-[42px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </span>
          <span class="text-[14px] font-semibold text-[#0f172a]">Upload Mushroom Image</span>
          <span class="text-[12px] text-[#64748b]">Drag &amp; drop or select</span>
        </label>

        <!-- Image preview -->
        <div v-if="previewUrl" class="relative rounded-[10px] overflow-hidden border border-[#e2e8f0]">
          <img :src="previewUrl" alt="Mushroom preview" class="w-full h-[130px] object-cover block" />
          <button class="absolute top-2 right-2 bg-black/50 text-white border-none rounded-md py-[3px] px-2.5 text-[12px] cursor-pointer font-sans" @click="clearImage">✕ Remove</button>
        </div>

        <!-- Upload button -->
        <button class="flex items-center justify-center gap-2 p-[13px] rounded-[10px] bg-[#7a956a] text-white border-none text-[14px] font-semibold font-sans cursor-pointer mt-auto transition-colors duration-[0.18s] disabled:opacity-55 disabled:cursor-not-allowed hover:not-disabled:bg-[#5c7a52]" @click="analyzeImage" :disabled="isAnalyzing || !selectedFile">
          <span v-if="isAnalyzing" class="w-[15px] h-[15px] border-2 border-white/35 border-t-white rounded-full animate-spin" />
          {{ isAnalyzing ? 'Analyzing…' : 'Upload picture' }}
        </button>
      </div>

      <!-- ── RIGHT: Result Panel ───────── -->
      <div v-if="result" class="p-6 py-6 px-[22px] flex flex-col gap-3 overflow-y-auto">

        <!-- Info card -->
        <div class="py-3.5 px-4 border border-[#e2e8f0] rounded-xl bg-[#fafdfa] flex flex-col gap-1.5">
          <div class="flex items-center gap-2 text-[13px]">
            <span class="text-[#64748b] min-w-[120px] text-right">Mushroom name:</span>
            <span class="text-[#0f172a] font-bold">{{ result.name }}</span>
          </div>
          <div class="flex items-center gap-2 text-[13px]">
            <span class="text-[#64748b] min-w-[120px] text-right">Classification:</span>
            <span class="font-bold flex items-center gap-1.5 py-[3px] px-2.5 rounded-[20px]" :class="result.classification === 'Edible' ? 'text-[#166534] bg-[#dcfce7]' : 'text-[#991b1b] bg-[#fee2e2]'">
              {{ result.classification }}
              <svg v-if="result.classification === 'Edible'" class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#fff"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              </svg>
              <svg v-else class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" fill="#ef4444"/>
                <path d="M15 9l-6 6M9 9l6 6" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </span>
          </div>
          <div class="flex items-center gap-2 text-[13px]">
            <span class="text-[#64748b] min-w-[120px] text-right">Confidence level:</span>
            <span class="text-[#0f172a] font-bold">{{ result.confidence }}%</span>
          </div>
        </div>

        <!-- Divider -->
        <hr class="border-0 border-t border-[#e2e8f0] m-0" />

        <!-- Brief info -->
        <div class="flex flex-col gap-1.5">
          <p class="text-[13px] font-medium text-[#0f172a]">Brief information:</p>
          <p class="text-[12.5px] text-[#0f172a] leading-[1.65] text-justify">
            <em class="italic underline">{{ result.name }}</em>{{ result.descriptionRest }}
          </p>
          <a :href="result.reference" target="_blank" class="text-[11px] text-[#64748b] break-all no-underline leading-normal hover:underline">{{ result.reference }}</a>
        </div>

        <!-- Map (dynamic based on user's real GPS location) -->
        <div class="flex-1 flex flex-col gap-2 min-h-0">
          <div class="flex items-center justify-between">
            <p class="text-[13px] font-medium text-[#0f172a]">Pin mushroom location</p>
            <span v-if="geoError" class="text-[11px] text-[#ef4444]">{{ geoError }}</span>
            <span v-else-if="isLocating" class="text-[11px] text-[#64748b] flex items-center gap-1">
              <span class="w-[10px] h-[10px] border-[1.5px] border-[#64748b]/30 border-t-[#64748b] rounded-full animate-spin" />
              Getting location…
            </span>
            <span v-else-if="userLat !== null" class="text-[11px] text-[#64748b]">
              📍 {{ userLat.toFixed(5) }}, {{ userLng!.toFixed(5) }}
            </span>
          </div>
          <div class="flex-1 rounded-[10px] overflow-hidden border border-[#e2e8f0] min-h-0">
            <iframe
              title="Mushroom location"
              :src="mapEmbedUrl"
              class="w-full h-full block border-0"
              loading="lazy"
            />
          </div>
          <button
            class="self-center flex items-center gap-1.5 bg-transparent border-none font-sans text-[13.5px] font-semibold cursor-pointer underline py-0.5 transition-colors duration-[0.18s] disabled:opacity-50 disabled:cursor-not-allowed"
            :class="locationSaved ? 'text-[#059669]' : 'text-[#0f172a] hover:text-[#059669]'"
            :disabled="isSavingLocation || userLat === null"
            @click="saveLocation"
          >
            <span v-if="isSavingLocation" class="w-[12px] h-[12px] border-[1.5px] border-[#0f172a]/30 border-t-[#0f172a] rounded-full animate-spin" />
            {{ locationSaved ? '✓ Location saved' : 'Save location' }}
          </button>
        </div>

      </div>

      <!-- Empty state when no result -->
      <div v-else class="flex items-center justify-center bg-[#f8fafc] p-6 lg:col-start-2">
        <div class="text-center max-w-[260px] flex flex-col items-center gap-3">
          <div class="text-[56px] opacity-50 grayscale-[0.8]">🍄</div>
          <h3 class="text-[18px] font-semibold text-[#475569]">Ready to Analyze</h3>
          <p class="text-[13.5px] text-[#64748b] leading-[1.5]">Upload a mushroom picture on the left to see the AI classification and confidence results here.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const firstName = ref('User')

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    firstName.value = user.first_name || user.name?.split(' ')[0] || user.username || 'User'
  }
})

// ── Upload state ─────────────────────────────────────
const fileInput   = ref<HTMLInputElement | null>(null)
const previewUrl  = ref<string | null>(null)
const isDragging  = ref(false)
const isAnalyzing = ref(false)
const selectedFile = ref<File | null>(null)
const result = ref<any>(null)

// ── Camera state ──────────────────────────────────────
const isCameraOpen = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)
let mediaStream: MediaStream | null = null

// ── Geolocation state ─────────────────────────────────
const userLat = ref<number | null>(null)
const userLng = ref<number | null>(null)
const isLocating = ref(false)
const geoError = ref<string | null>(null)
const lastScanId = ref<number | null>(null)
const isSavingLocation = ref(false)
const locationSaved = ref(false)

const config = useRuntimeConfig()

// ── Geolocation helpers ───────────────────────────────
function fetchUserLocation(): Promise<void> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      geoError.value = 'Geolocation not supported'
      resolve()
      return
    }

    isLocating.value = true
    geoError.value = null

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLat.value = position.coords.latitude
        userLng.value = position.coords.longitude
        isLocating.value = false
        resolve()
      },
      (err) => {
        isLocating.value = false
        switch (err.code) {
          case err.PERMISSION_DENIED:
            geoError.value = 'Location permission denied'
            break
          case err.POSITION_UNAVAILABLE:
            geoError.value = 'Location unavailable'
            break
          case err.TIMEOUT:
            geoError.value = 'Location request timed out'
            break
          default:
            geoError.value = 'Could not get location'
        }
        resolve()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Cache location for 1 min
      }
    )
  })
}

// Build map URL dynamically from user's real coordinates
const mapEmbedUrl = computed(() => {
  const lat = userLat.value ?? 14.5995  // fallback only if geo fails
  const lng = userLng.value ?? 120.9842
  const delta = 0.01 // tighter zoom around the user's actual position
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
})

// ── Save location to backend ──────────────────────────
async function saveLocation() {
  if (userLat.value === null || userLng.value === null || !lastScanId.value) return

  isSavingLocation.value = true
  try {
    const token = localStorage.getItem('token')
    await $fetch(`${config.public.apiBase}/scans/${lastScanId.value}/location`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: {
        latitude: userLat.value,
        longitude: userLng.value,
      },
    })
    locationSaved.value = true
  } catch (error) {
    console.error('Failed to save location:', error)
    alert('Failed to save location. Please try again.')
  } finally {
    isSavingLocation.value = false
  }
}

async function openCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' } // Prefer back camera on mobile
    })
    mediaStream = stream
    isCameraOpen.value = true
    // Wait for DOM to render the video element
    nextTick(() => {
      if (videoRef.value) {
        videoRef.value.srcObject = stream
      }
    })
  } catch (error) {
    console.error('Error accessing camera:', error)
    alert('Could not access camera. Please ensure permissions are granted.')
  }
}

function closeCamera() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }
  isCameraOpen.value = false
}

function takeSnapshot() {
  if (!videoRef.value) return
  
  const video = videoRef.value
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'snapshot.jpg', { type: 'image/jpeg' })
        selectedFile.value = file
        loadPreview(file)
      }
    }, 'image/jpeg', 0.9)
  }
  closeCamera()
}

onUnmounted(() => {
  closeCamera() // Cleanup
})

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    selectedFile.value = file
    loadPreview(file)
  }
}
function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    selectedFile.value = file
    loadPreview(file)
  }
}
function loadPreview(file: File) {
  const reader = new FileReader()
  reader.onload = ev => { previewUrl.value = ev.target?.result as string }
  reader.readAsDataURL(file)
}
function clearImage() {
  previewUrl.value = null
  selectedFile.value = null
  result.value = null
  lastScanId.value = null
  locationSaved.value = false
  if (fileInput.value) fileInput.value.value = ''
}
async function analyzeImage() {
  if (!selectedFile.value) return

  isAnalyzing.value = true
  result.value = null
  lastScanId.value = null
  locationSaved.value = false

  // Start fetching the user's GPS location in parallel with the scan
  fetchUserLocation()

  try {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('image', selectedFile.value)

    // Include GPS coordinates if already available
    if (userLat.value !== null && userLng.value !== null) {
      formData.append('latitude', String(userLat.value))
      formData.append('longitude', String(userLng.value))
    }
    
    // Send to backend
    const data = await $fetch<any>(`${config.public.apiBase}/scans`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    // Store the scan ID so we can update location later
    lastScanId.value = data.id

    // Map result from backend to UI state
    const rawClass = data.result_classification || 'unknown';
    result.value = {
      name: data.result_name || 'Unknown',
      classification: rawClass.charAt(0).toUpperCase() + rawClass.slice(1),
      confidence: data.confidence_level || 0,
      descriptionRest: ' is the identified species based on your scan. More details will be populated here when the species database is fully linked.',
      reference: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(data.result_name || 'Mushroom')
    }
  } catch (error) {
    console.error('Scan upload failed:', error)
    alert('Failed to analyze the image. Please try again.')
  } finally {
    isAnalyzing.value = false
  }
}
</script>

