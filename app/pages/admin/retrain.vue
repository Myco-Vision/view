<template>
  <div class="flex flex-col gap-[22px]">

    <!-- Header -->
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">AI Model Retraining</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">
          Improve the mushroom classifier using real scan data from consenting foragers.
        </p>
      </div>
      <button
        id="btn-start-retrain"
        :disabled="retrainState === 'running' || totalSelected === 0"
        class="py-2 px-[22px] rounded-lg text-[13.5px] font-semibold text-white transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="retrainState === 'running'
          ? 'bg-[#64748b] cursor-not-allowed'
          : 'bg-gradient-to-br from-[#10b981] to-[#059669] hover:opacity-90'"
        @click="startRetrain"
      >
        <span v-if="retrainState === 'running'" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
        <span v-else>🧠</span>
        {{ retrainState === 'running' ? 'Training in progress…' : `Retrain with ${totalSelected} image${totalSelected !== 1 ? 's' : ''}` }}
      </button>
    </div>

    <!-- Loading candidates -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-[3px] border-[#e2e8f0] border-t-[#10b981] rounded-full animate-spin" />
    </div>

    <template v-else>

      <!-- ── Status Banner ─────────────────────────────────────────────────── -->
      <div
        v-if="retrainState !== 'idle'"
        class="rounded-[14px] border px-5 py-4 flex items-start gap-4"
        :class="{
          'bg-[#fffbeb] border-[#fde68a]': retrainState === 'running',
          'bg-[#f0fdf4] border-[#bbf7d0]': retrainState === 'done',
          'bg-[#fef2f2] border-[#fecaca]': retrainState === 'failed' || retrainState === 'unknown',
        }"
      >
        <div class="text-[28px] leading-none mt-0.5">
          {{ retrainState === 'running' ? '⚙️' : retrainState === 'done' ? '✅' : '❌' }}
        </div>
        <div class="flex flex-col gap-0.5 flex-1">
          <p class="text-[14px] font-semibold"
            :class="{
              'text-[#92400e]': retrainState === 'running',
              'text-[#065f46]': retrainState === 'done',
              'text-[#991b1b]': retrainState === 'failed' || retrainState === 'unknown',
            }"
          >
            {{ statusMessage }}
          </p>
          <p v-if="lastResult" class="text-[12.5px] text-[#64748b]">
            Train accuracy: <strong>{{ lastResult.train_accuracy }}%</strong> ·
            Val accuracy: <strong>{{ lastResult.val_accuracy }}%</strong> ·
            {{ lastResult.total_images }} images used
            ({{ lastResult.total_edible }} edible, {{ lastResult.total_poisonous }} poisonous)
          </p>
          <p v-if="statusError" class="text-[12.5px] text-[#ef4444] font-mono">{{ statusError }}</p>
        </div>
      </div>

      <!-- ── Warning if too few images ─────────────────────────────────────── -->
      <div
        v-if="summary.total < 20"
        class="rounded-[14px] bg-[#fffbeb] border border-[#fde68a] px-5 py-4 flex items-start gap-3"
      >
        <span class="text-[20px] mt-0.5">⚠️</span>
        <div>
          <p class="text-[13.5px] font-semibold text-[#92400e]">Low image count</p>
          <p class="text-[12.5px] text-[#78350f] mt-0.5">
            Only <strong>{{ summary.total }}</strong> consented images are available.
            We recommend at least <strong>20</strong> images (10 per class) for meaningful retraining.
            Fewer images may reduce model accuracy.
          </p>
        </div>
      </div>

      <!-- ── Summary Stats ──────────────────────────────────────────────────── -->
      <div class="grid grid-cols-3 gap-3.5">
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-[22px]">🍄</div>
          <div>
            <p class="text-[24px] font-bold text-[#0f172a] leading-none">{{ summary.total }}</p>
            <p class="text-[12px] text-[#64748b] mt-1">Total Candidate Images</p>
          </div>
        </div>
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-[22px]">✅</div>
          <div>
            <p class="text-[24px] font-bold text-[#0f172a] leading-none">{{ summary.edible_count }}</p>
            <p class="text-[12px] text-[#64748b] mt-1">Edible Images</p>
          </div>
        </div>
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-[#fef2f2] flex items-center justify-center text-[22px]">☠️</div>
          <div>
            <p class="text-[24px] font-bold text-[#0f172a] leading-none">{{ summary.poisonous_count }}</p>
            <p class="text-[12px] text-[#64748b] mt-1">Poisonous Images</p>
          </div>
        </div>
      </div>

      <!-- ── Dual Panels: Edible | Poisonous ──────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Edible Panel -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
          <div class="flex items-center justify-between px-5 py-3.5 border-b border-[#f1f5f9] bg-[#f0fdf4]">
            <div class="flex items-center gap-2">
              <span class="text-[18px]">✅</span>
              <h2 class="text-[14px] font-bold text-[#065f46]">Edible Scans</h2>
              <span class="text-[11px] font-semibold bg-[#bbf7d0] text-[#065f46] px-2 py-0.5 rounded-full">
                {{ edibleSelected.length }} / {{ candidates.edible.length }} selected
              </span>
            </div>
            <div class="flex gap-2">
              <button class="text-[12px] font-semibold text-[#059669] hover:underline" @click="selectAll('edible')">Select All</button>
              <span class="text-[#cbd5e1]">|</span>
              <button class="text-[12px] font-semibold text-[#64748b] hover:underline" @click="deselectAll('edible')">Clear</button>
            </div>
          </div>

          <div v-if="candidates.edible.length === 0" class="flex flex-col items-center justify-center py-14 gap-2 text-center">
            <span class="text-[40px]">🌿</span>
            <p class="text-[13.5px] font-semibold text-[#0f172a]">No edible candidates yet</p>
            <p class="text-[12px] text-[#64748b]">Foragers need to consent to data sharing for their scans to appear here.</p>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 max-h-[420px] overflow-y-auto">
            <div
              v-for="scan in candidates.edible"
              :key="scan.id"
              class="relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:shadow-md group"
              :class="isSelected('edible', scan.id)
                ? 'border-[#10b981] shadow-[0_0_0_2px_#d1fae5]'
                : 'border-[#e2e8f0]'"
              @click="toggleSelect('edible', scan.id)"
            >
              <img
                :src="scan.image_url"
                :alt="scan.result_name"
                class="w-full h-[100px] object-cover"
              />
              <!-- Checkmark overlay -->
              <div
                class="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
                :class="isSelected('edible', scan.id) ? 'bg-[#10b981]/30 opacity-100' : 'opacity-0 group-hover:opacity-100 bg-black/20'"
              >
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center text-[16px] font-bold"
                  :class="isSelected('edible', scan.id) ? 'bg-[#10b981] text-white' : 'bg-white/80 text-[#64748b]'"
                >
                  {{ isSelected('edible', scan.id) ? '✓' : '+' }}
                </div>
              </div>
              <div class="p-2">
                <p class="text-[11.5px] font-semibold text-[#0f172a] truncate italic">{{ scan.result_name }}</p>
                <p class="text-[11px] text-[#94a3b8]">{{ scan.confidence }}% · {{ scan.scanned_at }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Poisonous Panel -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
          <div class="flex items-center justify-between px-5 py-3.5 border-b border-[#f1f5f9] bg-[#fef2f2]">
            <div class="flex items-center gap-2">
              <span class="text-[18px]">☠️</span>
              <h2 class="text-[14px] font-bold text-[#991b1b]">Poisonous Scans</h2>
              <span class="text-[11px] font-semibold bg-[#fecaca] text-[#991b1b] px-2 py-0.5 rounded-full">
                {{ poisonousSelected.length }} / {{ candidates.poisonous.length }} selected
              </span>
            </div>
            <div class="flex gap-2">
              <button class="text-[12px] font-semibold text-[#dc2626] hover:underline" @click="selectAll('poisonous')">Select All</button>
              <span class="text-[#cbd5e1]">|</span>
              <button class="text-[12px] font-semibold text-[#64748b] hover:underline" @click="deselectAll('poisonous')">Clear</button>
            </div>
          </div>

          <div v-if="candidates.poisonous.length === 0" class="flex flex-col items-center justify-center py-14 gap-2 text-center">
            <span class="text-[40px]">💀</span>
            <p class="text-[13.5px] font-semibold text-[#0f172a]">No poisonous candidates yet</p>
            <p class="text-[12px] text-[#64748b]">Foragers need to consent to data sharing for their scans to appear here.</p>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 max-h-[420px] overflow-y-auto">
            <div
              v-for="scan in candidates.poisonous"
              :key="scan.id"
              class="relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:shadow-md group"
              :class="isSelected('poisonous', scan.id)
                ? 'border-[#ef4444] shadow-[0_0_0_2px_#fecaca]'
                : 'border-[#e2e8f0]'"
              @click="toggleSelect('poisonous', scan.id)"
            >
              <img
                :src="scan.image_url"
                :alt="scan.result_name"
                class="w-full h-[100px] object-cover"
              />
              <div
                class="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
                :class="isSelected('poisonous', scan.id) ? 'bg-[#ef4444]/30 opacity-100' : 'opacity-0 group-hover:opacity-100 bg-black/20'"
              >
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center text-[16px] font-bold"
                  :class="isSelected('poisonous', scan.id) ? 'bg-[#ef4444] text-white' : 'bg-white/80 text-[#64748b]'"
                >
                  {{ isSelected('poisonous', scan.id) ? '✓' : '+' }}
                </div>
              </div>
              <div class="p-2">
                <p class="text-[11.5px] font-semibold text-[#0f172a] truncate italic">{{ scan.result_name }}</p>
                <p class="text-[11px] text-[#94a3b8]">{{ scan.confidence }}% · {{ scan.scanned_at }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Retrain History ────────────────────────────────────────────────── -->
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
        <div class="px-5 py-3.5 border-b border-[#f1f5f9]">
          <h2 class="text-[14px] font-bold text-[#0f172a]">📋 Retraining History</h2>
        </div>

        <div v-if="history.length === 0" class="py-10 text-center">
          <p class="text-[13px] text-[#94a3b8]">No retraining runs yet.</p>
        </div>

        <table v-else class="w-full text-[13px]">
          <thead class="bg-[#f8fafc]">
            <tr>
              <th class="text-left px-5 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">Date</th>
              <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">Status</th>
              <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">✅ Edible</th>
              <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">☠️ Poisonous</th>
              <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">Train Acc.</th>
              <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">Val Acc.</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(run, i) in history"
              :key="i"
              class="border-t border-[#f1f5f9] hover:bg-[#f8fafc]"
            >
              <td class="px-5 py-3 text-[#334155]">{{ formatDate(run.started_at) }}</td>
              <td class="px-4 py-3">
                <span
                  class="text-[11.5px] font-semibold px-2.5 py-1 rounded-full"
                  :class="{
                    'bg-[#d1fae5] text-[#065f46]': run.status === 'done',
                    'bg-[#fee2e2] text-[#991b1b]': run.status === 'failed',
                    'bg-[#fef9c3] text-[#713f12]': run.status === 'running',
                  }"
                >{{ run.status }}</span>
              </td>
              <td class="px-4 py-3 text-[#334155]">{{ run.total_edible ?? '—' }}</td>
              <td class="px-4 py-3 text-[#334155]">{{ run.total_poisonous ?? '—' }}</td>
              <td class="px-4 py-3 font-semibold text-[#0f172a]">{{ run.train_accuracy != null ? run.train_accuracy + '%' : '—' }}</td>
              <td class="px-4 py-3 font-semibold text-[#0f172a]">{{ run.val_accuracy != null ? run.val_accuracy + '%' : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Privacy Note -->
      <p class="text-[12px] text-[#94a3b8] text-center">
        🔒 Only scan images from foragers who have opted in to data sharing (<code>allow_data_training = true</code>) are used for retraining.
      </p>

    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const api    = config.public.apiBase

// ── State ──────────────────────────────────────────────────────────────────────
const loading = ref(true)

interface ScanCandidate {
  id: number
  image_url: string
  image_path: string
  result_name: string
  confidence: number
  classification: string
  user: string
  scanned_at: string
}

const candidates = ref<{ edible: ScanCandidate[]; poisonous: ScanCandidate[] }>({
  edible: [],
  poisonous: [],
})

const summary = ref({ edible_count: 0, poisonous_count: 0, total: 0 })

// Selected IDs per class
const edibleSelected    = ref<number[]>([])
const poisonousSelected = ref<number[]>([])

const totalSelected = computed(() => edibleSelected.value.length + poisonousSelected.value.length)

// Retrain status
const retrainState  = ref<'idle' | 'running' | 'done' | 'failed' | 'unknown'>('idle')
const lastResult    = ref<any>(null)
const statusError   = ref<string | null>(null)
const history       = ref<any[]>([])

let statusInterval: ReturnType<typeof setInterval> | null = null

const statusMessage = computed(() => {
  if (retrainState.value === 'running') return 'Retraining in progress — this may take several minutes…'
  if (retrainState.value === 'done')    return `✅ Retraining completed successfully.`
  if (retrainState.value === 'failed')  return '❌ Retraining failed. See error below.'
  return ''
})

// ── Auth helper ────────────────────────────────────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

// ── Fetch candidate images ─────────────────────────────────────────────────────
async function fetchCandidates() {
  loading.value = true
  try {
    const data = await $fetch<any>(`${api}/admin/retrain/candidates`, {
      headers: authHeaders(),
    })
    candidates.value = { edible: data.edible, poisonous: data.poisonous }
    summary.value    = data.summary
    // Auto-select all by default
    edibleSelected.value    = data.edible.map((s: ScanCandidate) => s.id)
    poisonousSelected.value = data.poisonous.map((s: ScanCandidate) => s.id)
  } catch (err) {
    console.error('Failed to fetch retrain candidates:', err)
  } finally {
    loading.value = false
  }
}

// ── Selection helpers ──────────────────────────────────────────────────────────
function isSelected(cls: 'edible' | 'poisonous', id: number): boolean {
  return cls === 'edible'
    ? edibleSelected.value.includes(id)
    : poisonousSelected.value.includes(id)
}

function toggleSelect(cls: 'edible' | 'poisonous', id: number) {
  const arr = cls === 'edible' ? edibleSelected : poisonousSelected
  const idx = arr.value.indexOf(id)
  if (idx > -1) arr.value.splice(idx, 1)
  else arr.value.push(id)
}

function selectAll(cls: 'edible' | 'poisonous') {
  if (cls === 'edible') {
    edibleSelected.value = candidates.value.edible.map(s => s.id)
  } else {
    poisonousSelected.value = candidates.value.poisonous.map(s => s.id)
  }
}

function deselectAll(cls: 'edible' | 'poisonous') {
  if (cls === 'edible') edibleSelected.value = []
  else poisonousSelected.value = []
}

// ── Trigger retrain ────────────────────────────────────────────────────────────
async function startRetrain() {
  if (totalSelected.value === 0) return
  if (!confirm(`Start retraining with ${edibleSelected.value.length} edible and ${poisonousSelected.value.length} poisonous images?`)) return

  retrainState.value = 'running'
  statusError.value  = null

  try {
    await $fetch(`${api}/admin/retrain`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: {
        edible_ids:    edibleSelected.value,
        poisonous_ids: poisonousSelected.value,
      },
    })
    // Start polling for status
    startPolling()
  } catch (err: any) {
    retrainState.value = 'failed'
    statusError.value  = err?.data?.message || String(err)
  }
}

// ── Status polling ─────────────────────────────────────────────────────────────
async function fetchStatus() {
  try {
    const data = await $fetch<any>(`${api}/admin/retrain/status`, {
      headers: authHeaders(),
    })
    const current = data.current
    retrainState.value = current.state
    statusError.value  = current.error ?? null

    if (current.last_result) {
      lastResult.value = current.last_result
    }

    history.value = data.history ?? []

    if (current.state === 'done' || current.state === 'failed') {
      stopPolling()
    }
  } catch {
    // silently ignore status check errors
  }
}

function startPolling() {
  if (statusInterval) return
  statusInterval = setInterval(fetchStatus, 3000)
}

function stopPolling() {
  if (statusInterval) {
    clearInterval(statusInterval)
    statusInterval = null
  }
}

// ── Format helper ──────────────────────────────────────────────────────────────
function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Lifecycle ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  await fetchCandidates()
  await fetchStatus()  // check if a retrain is already running
  if (retrainState.value === 'running') startPolling()
})

onUnmounted(() => stopPolling())
</script>
