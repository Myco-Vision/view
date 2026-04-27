<template>
  <div class="scan-page">

    <!-- Welcome Header -->
    <h1 class="welcome-heading">Welcome, <strong>{{ firstName }}!</strong></h1>

    <!-- Two-column card -->
    <div class="scan-card">

      <!-- ── LEFT: Input Panel ─────────────────────────── -->
      <div class="panel panel--left">
        <h2 class="panel-title">Scan Mushroom</h2>

        <!-- Capture box -->
        <button class="capture-zone" @click="openCamera">
          <span class="zone-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8
                       a2 2 0 0 1 2-2h4l2-3h6l2 3h4
                       a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </span>
          <span class="zone-label">Capture Mushroom</span>
        </button>

        <p class="divider-or">or</p>

        <!-- Upload box -->
        <label
          class="upload-zone"
          :class="{ 'upload-zone--drag': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="sr-only"
            @change="handleFileChange"
          />
          <span class="zone-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </span>
          <span class="zone-label">Upload Mushroom Image</span>
          <span class="zone-hint">Drag &amp; drop or select</span>
        </label>

        <!-- Image preview -->
        <div v-if="previewUrl" class="image-preview">
          <img :src="previewUrl" alt="Mushroom preview" />
          <button class="clear-btn" @click="clearImage">✕ Remove</button>
        </div>

        <!-- Upload button -->
        <button class="upload-btn" @click="analyzeImage" :disabled="isAnalyzing">
          <span v-if="isAnalyzing" class="spinner" />
          {{ isAnalyzing ? 'Analyzing…' : 'Upload picture' }}
        </button>
      </div>

      <!-- ── RIGHT: Result Panel (always shown) ───────── -->
      <div class="panel panel--right">

        <!-- Info card -->
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">Mushroom name:</span>
            <span class="info-value bold">{{ result.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Classification:</span>
            <span class="info-value edible">
              {{ result.classification }}
              <svg class="edible-check" xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#fff"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              </svg>
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">Confidence level:</span>
            <span class="info-value bold">{{ result.confidence }}%</span>
          </div>
        </div>

        <!-- Divider -->
        <hr class="divider-line" />

        <!-- Brief info -->
        <div class="brief-section">
          <p class="brief-heading">Brief information:</p>
          <p class="brief-text">
            <em class="species-name">{{ result.name }}</em>{{ result.descriptionRest }}
          </p>
          <a :href="result.reference" target="_blank" class="ref-link">{{ result.reference }}</a>
        </div>

        <!-- Map -->
        <div class="map-section">
          <p class="map-heading">Pin mushroom location</p>
          <div class="map-wrapper">
            <iframe
              title="Mushroom location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=120.9,14.4,121.3,14.8&layer=mapnik&marker=14.599512,121.0"
              width="100%"
              height="100%"
              loading="lazy"
            />
          </div>
          <button class="save-loc-btn">Save location</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const firstName = 'Maria'

// ── Upload state ─────────────────────────────────────
const fileInput   = ref<HTMLInputElement | null>(null)
const previewUrl  = ref<string | null>(null)
const isDragging  = ref(false)
const isAnalyzing = ref(false)

function openCamera() {
  if (fileInput.value) {
    fileInput.value.setAttribute('capture', 'environment')
    fileInput.value.click()
  }
}
function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) loadPreview(file)
}
function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) loadPreview(file)
}
function loadPreview(file: File) {
  const reader = new FileReader()
  reader.onload = ev => { previewUrl.value = ev.target?.result as string }
  reader.readAsDataURL(file)
}
function clearImage() {
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
}
async function analyzeImage() {
  isAnalyzing.value = true
  await new Promise(r => setTimeout(r, 1800))
  isAnalyzing.value = false
}

// ── Static result data (for presentation) ────────────
const result = {
  name: 'Volvariella volvacea',
  classification: 'Edible',
  confidence: 94,
  descriptionRest:
    ', commonly known as the paddy straw mushroom, is a highly nutritious and popular edible mushroom cultivated extensively in tropical and subtropical regions of Asia. Renowned for its quick cultivation (4–5 days to harvest) and savory flavor, it is packed with protein, amino acids, and antioxidants, and is often harvested in its immature, "egg-like" button stage.',
  reference:
    'https://www.sciencedirect.com/science/article/pii/S240584402415787#:~:text=Abstract,phenylalanine%2C%20threonine%2C%20and%20histidine.',
}
</script>

<style scoped>
/* ── Page wrapper ──────────────────────────────────── */
.scan-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
}

.welcome-heading {
  font-size: 22px;
  font-weight: 400;
  color: var(--color-text);
}
.welcome-heading strong { font-weight: 700; }

/* ── Card ──────────────────────────────────────────── */
.scan-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #fff;
  border: 1px solid var(--color-sidebar-border);
  border-radius: 14px;
  overflow: hidden;
  flex: 1;
}

/* ── Panels ────────────────────────────────────────── */
.panel {
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.panel--left {
  border-right: 1px solid var(--color-sidebar-border);
}

.panel--right {
  overflow-y: auto;
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 2px;
}

/* ── Zones (capture / upload) ──────────────────────── */
.capture-zone,
.upload-zone {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  border: 2px dashed #b0cfb0;
  border-radius: 12px;
  background: #f8fbf3;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s;
  font-family: inherit;
  text-align: center;
  min-height: 0;
}

.capture-zone { border: 2px dashed #b0cfb0; }

.capture-zone:hover,
.upload-zone:hover,
.upload-zone--drag {
  background: #ecf5e4;
  border-color: var(--color-primary);
}

.zone-icon svg {
  width: 42px;
  height: 42px;
  color: #2d3a2d;
}

.zone-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.zone-hint {
  font-size: 12px;
  color: var(--color-text-muted);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
}

/* ── "or" divider ──────────────────────────────────── */
.divider-or {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-muted);
  margin: -2px 0;
}

/* ── Image preview ─────────────────────────────────── */
.image-preview {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--color-sidebar-border);
}
.image-preview img {
  width: 100%;
  height: 130px;
  object-fit: cover;
  display: block;
}
.clear-btn {
  position: absolute;
  top: 8px; right: 8px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
}

/* ── Upload button ─────────────────────────────────── */
.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px;
  border-radius: 10px;
  background: #7a956a;
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  margin-top: auto;
  transition: background 0.18s, opacity 0.18s;
}
.upload-btn:hover:not(:disabled) { background: #5c7a52; }
.upload-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Right panel ───────────────────────────────────── */

/* Info card */
.info-card {
  padding: 14px 16px;
  border: 1px solid var(--color-sidebar-border);
  border-radius: 12px;
  background: #fafdfa;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.info-label {
  color: var(--color-text-muted);
  min-width: 120px;
  text-align: right;
}

.info-value {
  color: var(--color-text);
}

.info-value.bold { font-weight: 700; }

.info-value.edible {
  color: #166534;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}

.edible-check {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Divider */
.divider-line {
  border: none;
  border-top: 1px solid var(--color-sidebar-border);
  margin: 0;
}

/* Brief info */
.brief-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.brief-heading {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
}

.brief-text {
  font-size: 12.5px;
  color: var(--color-text);
  line-height: 1.65;
  text-align: justify;
}

.species-name {
  font-style: italic;
  text-decoration: underline;
}

.ref-link {
  font-size: 11px;
  color: var(--color-text-muted);
  word-break: break-all;
  text-decoration: none;
  line-height: 1.5;
}
.ref-link:hover { text-decoration: underline; }

/* Map */
.map-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.map-heading {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
}

.map-wrapper {
  flex: 1;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--color-sidebar-border);
  line-height: 0;
  min-height: 0;
}

.map-wrapper iframe {
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
}

.save-loc-btn {
  align-self: center;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  text-decoration: underline;
  padding: 2px 0;
  transition: color 0.18s;
}
.save-loc-btn:hover { color: var(--color-primary-dark); }
</style>
