<template>
  <div class="flex flex-col gap-[18px] h-full">

    <!-- Welcome Header -->
    <h1 class="text-[22px] font-normal text-[#0f172a]">Welcome, <strong class="font-bold">{{ firstName }}!</strong></h1>

    <!-- Two-column card -->
    <div class="grid grid-cols-2 bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden flex-1">

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

        <!-- Map -->
        <div class="flex-1 flex flex-col gap-2 min-h-0">
          <p class="text-[13px] font-medium text-[#0f172a]">Pin mushroom location</p>
          <div class="flex-1 rounded-[10px] overflow-hidden border border-[#e2e8f0] min-h-0">
            <iframe
              title="Mushroom location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=120.9,14.4,121.3,14.8&layer=mapnik&marker=14.599512,121.0"
              class="w-full h-full block border-0"
              loading="lazy"
            />
          </div>
          <button class="self-center bg-transparent border-none font-sans text-[13.5px] font-semibold text-[#0f172a] cursor-pointer underline py-0.5 transition-colors duration-[0.18s] hover:text-[#059669]">Save location</button>
        </div>

      </div>

      <!-- Empty state when no result -->
      <div v-else class="flex items-center justify-center bg-[#f8fafc] h-full p-6 col-start-2">
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

const config = useRuntimeConfig()

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
  if (fileInput.value) fileInput.value.value = ''
}
async function analyzeImage() {
  if (!selectedFile.value) return

  isAnalyzing.value = true
  result.value = null

  try {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('image', selectedFile.value)
    
    // Send to backend
    const data = await $fetch<any>(`${config.public.apiBase}/scans`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

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
