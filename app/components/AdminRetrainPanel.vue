<template>
  <div class="flex flex-col gap-[22px]">
    <!-- Action bar -->
    <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-[15px] font-bold text-[#0f172a]">AI Model Retraining</h2>
        <p class="text-[12.5px] text-[#64748b] mt-0.5">
          Improve the mushroom classifier using consented scan images from foragers.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
        <button
          type="button"
          class="py-2 px-3 rounded-lg border border-[#e2e8f0] bg-white text-[12.5px] font-medium text-[#475569] cursor-pointer hover:bg-[#f1f5f9] inline-flex items-center justify-center gap-1.5"
          :disabled="loading"
          @click="refreshAll"
        >
          <AppIcon name="refresh" class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" />
          <span>Refresh</span>
        </button>
        <button
          type="button"
          class="py-2 px-3 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] text-[12.5px] font-semibold text-[#047857] cursor-pointer hover:bg-[#dcfce7] inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
          :disabled="refreshingMl || retrainState === 'running'"
          title="Reload Stage-1 & Stage-2 ML models on Render so new scans run against the latest weights"
          @click="refreshMlService"
        >
          <AppIcon name="sparkles" class="w-3.5 h-3.5" :class="{ 'animate-pulse': refreshingMl }" />
          <span>{{ refreshingMl ? 'Warming ML…' : 'Refresh ML' }}</span>
        </button>
        <button
          id="btn-start-retrain"
          :disabled="retrainState === 'running' || totalSelected === 0"
          class="flex-1 sm:flex-initial justify-center py-2 px-[22px] rounded-lg text-[13.5px] font-semibold text-white transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          :class="retrainState === 'running'
            ? 'bg-[#64748b] cursor-not-allowed'
            : 'bg-gradient-to-br from-[#10b981] to-[#059669] hover:opacity-90'"
          @click="startRetrain"
        >
          <span v-if="retrainState === 'running'" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
          <AppIcon v-else name="brain" class="w-4 h-4" />
          <span>{{ retrainState === 'running' ? 'Training in progress…' : `Retrain with ${totalSelected} image${totalSelected !== 1 ? 's' : ''}` }}</span>
        </button>
      </div>
    </div>

    <!-- Loading candidates -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-[3px] border-[#e2e8f0] border-t-[#10b981] rounded-full animate-spin" />
    </div>

    <template v-else>
      <!-- Status Banner -->
      <div
        v-if="retrainState !== 'idle'"
        class="rounded-[14px] border px-5 py-4 flex items-start gap-4"
        :class="{
          'bg-[#fffbeb] border-[#fde68a]': retrainState === 'running',
          'bg-[#f0fdf4] border-[#bbf7d0]': retrainState === 'done',
          'bg-[#fef2f2] border-[#fecaca]': retrainState === 'failed' || retrainState === 'unknown',
        }"
      >
        <div class="mt-0.5">
          <AppIcon
            :name="retrainState === 'running' ? 'cog' : retrainState === 'done' ? 'check-circle' : 'x-circle'"
            class="w-6 h-6"
            :class="{
              'text-[#d97706] animate-spin': retrainState === 'running',
              'text-[#059669]': retrainState === 'done',
              'text-[#dc2626]': retrainState === 'failed' || retrainState === 'unknown',
            }"
          />
        </div>
        <div class="flex flex-col gap-0.5 flex-1">
          <p
            class="text-[14px] font-semibold"
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

      <!-- Warning if too few images -->
      <div
        v-if="summary.total < 20"
        class="rounded-[14px] bg-[#fffbeb] border border-[#fde68a] px-5 py-4 flex items-start gap-3"
      >
        <AppIcon name="warning" class="w-5 h-5 text-[#d97706] mt-0.5" />
        <div>
          <p class="text-[13.5px] font-semibold text-[#92400e]">Low image count</p>
          <p class="text-[12.5px] text-[#78350f] mt-0.5">
            Only <strong>{{ summary.total }}</strong> consented images are available.
            We recommend at least <strong>20</strong> images (10 per class) for meaningful retraining.
            Fewer images may reduce model accuracy.
          </p>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-[#f0fdf4] text-[#059669] flex items-center justify-center"><AppIcon name="mushroom" class="w-6 h-6" /></div>
          <div>
            <p class="text-[24px] font-bold text-[#0f172a] leading-none">{{ summary.total }}</p>
            <p class="text-[12px] text-[#64748b] mt-1">Total Candidate Images</p>
          </div>
        </div>
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-[#f0fdf4] text-[#10b981] flex items-center justify-center"><AppIcon name="check-circle" class="w-6 h-6" /></div>
          <div>
            <p class="text-[24px] font-bold text-[#0f172a] leading-none">{{ summary.edible_count }}</p>
            <p class="text-[12px] text-[#64748b] mt-1">Edible Images</p>
          </div>
        </div>
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-[#fef2f2] text-[#dc2626] flex items-center justify-center"><AppIcon name="skull" class="w-6 h-6" /></div>
          <div>
            <p class="text-[24px] font-bold text-[#0f172a] leading-none">{{ summary.poisonous_count }}</p>
            <p class="text-[12px] text-[#64748b] mt-1">Poisonous Images</p>
          </div>
        </div>
      </div>

      <!-- Queue Switcher: Ready vs Already Trained -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="inline-flex rounded-xl border border-[#e2e8f0] bg-white p-1 gap-1">
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            :class="queueView === 'ready' ? 'bg-[#0f172a] text-white' : 'text-[#64748b] hover:text-[#0f172a]'"
            @click="queueView = 'ready'"
          >
            <span>Ready for Training</span>
            <span
              class="text-[11px] px-1.5 py-0.5 rounded-full font-bold"
              :class="queueView === 'ready' ? 'bg-white/20 text-white' : 'bg-[#f1f5f9] text-[#475569]'"
            >{{ summary.total }}</span>
          </button>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            :class="queueView === 'trained' ? 'bg-[#0f172a] text-white' : 'text-[#64748b] hover:text-[#0f172a]'"
            @click="queueView = 'trained'"
          >
            <span>Already Trained</span>
            <span
              class="text-[11px] px-1.5 py-0.5 rounded-full font-bold"
              :class="queueView === 'trained' ? 'bg-white/20 text-white' : 'bg-[#f1f5f9] text-[#475569]'"
            >{{ retrainedSummary.total }}</span>
          </button>
        </div>

        <div v-if="queueView === 'trained' && retrainedSummary.total > 0" class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            :disabled="restoring || totalSelectedInView === 0"
            class="py-1.5 px-3.5 rounded-lg bg-[#059669] text-white text-[12.5px] font-semibold hover:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            @click="restoreScans(false)"
          >
            {{ restoring ? 'Restoring…' : `Restore Selected (${totalSelectedInView})` }}
          </button>
          <button
            type="button"
            :disabled="restoring"
            class="py-1.5 px-3.5 rounded-lg border border-[#e2e8f0] bg-white text-[#475569] text-[12.5px] font-semibold hover:bg-[#f8fafc] disabled:opacity-50 cursor-pointer"
            @click="restoreScans(true)"
          >
            Restore All to Queue
          </button>
        </div>
      </div>

      <!-- Dual Panels: Edible | Poisonous -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="panel in classPanels"
          :key="panel.cls"
          class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden"
        >
          <div class="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-[#f1f5f9]" :class="panel.headerBg">
            <div class="flex items-center gap-2">
              <AppIcon :name="panel.icon" class="w-[18px] h-[18px]" :class="panel.iconClass" />
              <h3 class="text-[14px] font-bold" :class="panel.titleClass">{{ panel.title }}</h3>
              <span class="shrink-0 whitespace-nowrap text-[11px] font-semibold px-2 py-0.5 rounded-full" :class="panel.badgeClass">
                {{ selectedIds(panel.cls).length }} / {{ visibleList(panel.cls).length }} selected
              </span>
            </div>
            <div class="flex gap-2">
              <button class="text-[12px] font-semibold hover:underline cursor-pointer" :class="panel.selectBtnClass" @click="selectAll(panel.cls)">Select All</button>
              <span class="text-[#cbd5e1]">|</span>
              <button class="text-[12px] font-semibold text-[#64748b] hover:underline cursor-pointer" @click="deselectAll(panel.cls)">Clear</button>
            </div>
          </div>

          <div v-if="visibleList(panel.cls).length === 0" class="flex flex-col items-center justify-center py-14 gap-2 text-center px-4">
            <AppIcon :name="panel.emptyIcon" class="w-10 h-10" :class="panel.emptyIconClass" />
            <p class="text-[13.5px] font-semibold text-[#0f172a]">
              {{ queueView === 'trained' ? `No trained ${panel.cls} scans yet` : panel.emptyTitle }}
            </p>
            <p class="text-[12px] text-[#64748b]">
              {{ queueView === 'trained'
                ? 'Images successfully used in completed retrain runs will appear here.'
                : (retrainedSummary[panel.cls === 'edible' ? 'edible_count' : 'poisonous_count'] > 0
                    ? 'Previously trained images can be viewed or restored in the Already Trained tab.'
                    : 'Foragers need to consent to data sharing for their scans to appear here.') }}
            </p>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 max-h-[420px] overflow-y-auto">
            <div
              v-for="scan in visibleList(panel.cls)"
              :key="scan.id"
              class="relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:shadow-md group"
              :class="isSelected(panel.cls, scan.id) ? panel.selectedBorder : 'border-[#e2e8f0]'"
              @click="toggleSelect(panel.cls, scan.id)"
            >
              <div v-if="brokenImages[scan.id]" class="w-full h-[100px] bg-[#f1f5f9] flex flex-col items-center justify-center text-[#94a3b8] gap-1">
                <AppIcon name="mushroom" class="w-6 h-6" />
                <span class="text-[10px]">Unavailable</span>
              </div>
              <img
                v-else
                :src="getImageUrl(scan.image_url || scan.image_path)"
                :alt="scan.result_name"
                class="w-full h-[100px] object-cover bg-[#f8fafc]"
                @error="brokenImages[scan.id] = true"
              />
              <div
                class="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
                :class="isSelected(panel.cls, scan.id) ? panel.selectedOverlay : 'opacity-0 group-hover:opacity-100 bg-black/20'"
              >
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center text-[16px] font-bold"
                  :class="isSelected(panel.cls, scan.id) ? panel.selectedCheck : 'bg-white/80 text-[#64748b]'"
                >
                  {{ isSelected(panel.cls, scan.id) ? '✓' : '+' }}
                </div>
              </div>
              <div class="p-2">
                <p class="text-[11.5px] font-semibold text-[#0f172a] truncate italic">{{ scan.result_name }}</p>
                <p class="text-[11px] text-[#94a3b8]">
                  {{ scan.confidence }}% · {{ queueView === 'trained' && scan.retrained_at ? `Trained ${scan.retrained_at}` : scan.scanned_at }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Retrain History -->
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
        <div class="px-5 py-3.5 border-b border-[#f1f5f9]">
          <h3 class="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
            <AppIcon name="clipboard" class="w-4 h-4 text-[#64748b]" />
            <span>Retraining History</span>
          </h3>
        </div>

        <div v-if="history.length === 0" class="py-10 text-center">
          <p class="text-[13px] text-[#94a3b8]">No retraining runs yet.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[680px] text-[13px]">
            <thead class="bg-[#f8fafc]">
              <tr>
                <th class="text-left px-5 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">Date</th>
                <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">Status</th>
                <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide"><span class="inline-flex items-center gap-1"><AppIcon name="check-circle" class="w-3.5 h-3.5 text-[#059669]" />Edible</span></th>
                <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide"><span class="inline-flex items-center gap-1"><AppIcon name="skull" class="w-3.5 h-3.5 text-[#dc2626]" />Poisonous</span></th>
                <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">Train Acc.</th>
                <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">Val Acc.</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(run, i) in history"
                :key="run.id ?? i"
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
                  <p v-if="run.status === 'failed' && run.error" class="text-[11px] text-[#dc2626] mt-1 max-w-[260px] truncate" :title="run.error">
                    {{ run.error }}
                  </p>
                </td>
                <td class="px-4 py-3 text-[#334155]">{{ run.total_edible ?? run.new_edible ?? '—' }}</td>
                <td class="px-4 py-3 text-[#334155]">{{ run.total_poisonous ?? run.new_poisonous ?? '—' }}</td>
                <td class="px-4 py-3 font-semibold text-[#0f172a]">{{ run.train_accuracy != null ? run.train_accuracy + '%' : '—' }}</td>
                <td class="px-4 py-3 font-semibold text-[#0f172a]">{{ run.val_accuracy != null ? run.val_accuracy + '%' : '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Privacy Note -->
      <p class="text-[12px] text-[#94a3b8] text-center flex items-center justify-center gap-1.5">
        <AppIcon name="lock" class="w-3.5 h-3.5 text-[#64748b]" />
        <span>Only scan images from foragers who have opted in to data sharing (<code>allow_data_training = true</code>) are used for retraining.</span>
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
interface ScanCandidate {
  id: number
  image_url: string
  image_path?: string
  result_name: string
  confidence: number
  classification: 'edible' | 'poisonous'
  user: string
  scanned_at: string
  retrained_at?: string | null
}

const emit = defineEmits<{
  'update:count': [count: number]
  'update:state': [state: string]
}>()

const config = useRuntimeConfig()
const api = config.public.apiBase
const { confirm } = useConfirm()

const classPanels: Array<{
  cls: 'edible' | 'poisonous'
  title: string
  icon: string
  iconClass: string
  headerBg: string
  titleClass: string
  badgeClass: string
  selectBtnClass: string
  emptyIcon: string
  emptyIconClass: string
  emptyTitle: string
  selectedBorder: string
  selectedOverlay: string
  selectedCheck: string
}> = [
  {
    cls: 'edible',
    title: 'Edible Scans',
    icon: 'check-circle',
    iconClass: 'text-[#059669]',
    headerBg: 'bg-[#f0fdf4]',
    titleClass: 'text-[#065f46]',
    badgeClass: 'bg-[#bbf7d0] text-[#065f46]',
    selectBtnClass: 'text-[#059669]',
    emptyIcon: 'leaf',
    emptyIconClass: 'text-[#10b981]',
    emptyTitle: 'No edible candidates yet',
    selectedBorder: 'border-[#10b981] shadow-[0_0_0_2px_#d1fae5]',
    selectedOverlay: 'bg-[#10b981]/30 opacity-100',
    selectedCheck: 'bg-[#10b981] text-white',
  },
  {
    cls: 'poisonous',
    title: 'Poisonous Scans',
    icon: 'skull',
    iconClass: 'text-[#dc2626]',
    headerBg: 'bg-[#fef2f2]',
    titleClass: 'text-[#991b1b]',
    badgeClass: 'bg-[#fecaca] text-[#991b1b]',
    selectBtnClass: 'text-[#dc2626]',
    emptyIcon: 'skull',
    emptyIconClass: 'text-[#ef4444]',
    emptyTitle: 'No poisonous candidates yet',
    selectedBorder: 'border-[#ef4444] shadow-[0_0_0_2px_#fecaca]',
    selectedOverlay: 'bg-[#ef4444]/30 opacity-100',
    selectedCheck: 'bg-[#ef4444] text-white',
  },
]

const loading = ref(true)
const restoring = ref(false)
const refreshingMl = ref(false)
const { success: toastSuccess, error: toastError } = useToast()
const queueView = ref<'ready' | 'trained'>('ready')
const brokenImages = ref<Record<number, boolean>>({})

const candidates = ref<{ edible: ScanCandidate[]; poisonous: ScanCandidate[] }>({
  edible: [],
  poisonous: [],
})
const retrainedCandidates = ref<{ edible: ScanCandidate[]; poisonous: ScanCandidate[] }>({
  edible: [],
  poisonous: [],
})
const summary = ref({ total: 0, edible_count: 0, poisonous_count: 0 })
const retrainedSummary = ref({ total: 0, edible_count: 0, poisonous_count: 0 })

const edibleSelected = ref<number[]>([])
const poisonousSelected = ref<number[]>([])
const trainedSelected = ref<{ edible: number[]; poisonous: number[] }>({ edible: [], poisonous: [] })

const totalSelected = computed(() => edibleSelected.value.length + poisonousSelected.value.length)
const totalSelectedInView = computed(() =>
  queueView.value === 'trained'
    ? trainedSelected.value.edible.length + trainedSelected.value.poisonous.length
    : totalSelected.value
)

const retrainState = ref<'idle' | 'running' | 'done' | 'failed' | 'unknown'>('idle')
const lastResult = ref<any>(null)
const statusError = ref<string | null>(null)
const history = ref<any[]>([])
let statusInterval: ReturnType<typeof setInterval> | null = null

watch(() => summary.value.total, n => emit('update:count', n), { immediate: true })
watch(retrainState, s => emit('update:state', s), { immediate: true })

const statusMessage = computed(() => {
  if (retrainState.value === 'running') return 'Retraining in progress — this may take several minutes…'
  if (retrainState.value === 'done') return 'Retraining completed successfully.'
  if (retrainState.value === 'failed') return 'Retraining failed. See error below.'
  if (retrainState.value === 'unknown') return 'ML service status unavailable.'
  return ''
})

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` }
}

function getImageUrl(path?: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${api.replace(/\/api\/?$/, '')}/storage/${path.replace(/^\/+/, '')}`
}

function visibleList(cls: 'edible' | 'poisonous'): ScanCandidate[] {
  return queueView.value === 'trained' ? retrainedCandidates.value[cls] : candidates.value[cls]
}

function selectionBucket(cls: 'edible' | 'poisonous'): number[] {
  if (queueView.value === 'trained') return trainedSelected.value[cls]
  return cls === 'edible' ? edibleSelected.value : poisonousSelected.value
}

function selectedIds(cls: 'edible' | 'poisonous') {
  return selectionBucket(cls)
}

function isSelected(cls: 'edible' | 'poisonous', id: number) {
  return selectedIds(cls).includes(id)
}

function toggleSelect(cls: 'edible' | 'poisonous', id: number) {
  const arr = selectionBucket(cls)
  const idx = arr.indexOf(id)
  if (idx > -1) arr.splice(idx, 1)
  else arr.push(id)
}

function selectAll(cls: 'edible' | 'poisonous') {
  const ids = visibleList(cls).map(s => s.id)
  if (queueView.value === 'trained') {
    trainedSelected.value[cls] = ids
  } else if (cls === 'edible') {
    edibleSelected.value = ids
  } else {
    poisonousSelected.value = ids
  }
}

function deselectAll(cls: 'edible' | 'poisonous') {
  if (queueView.value === 'trained') {
    trainedSelected.value[cls] = []
  } else if (cls === 'edible') {
    edibleSelected.value = []
  } else {
    poisonousSelected.value = []
  }
}

async function fetchCandidates() {
  loading.value = true
  try {
    const data = await $fetch<any>(`${api}/admin/retrain/candidates`, { headers: authHeaders() })
    candidates.value = { edible: data.edible || [], poisonous: data.poisonous || [] }
    retrainedCandidates.value = {
      edible: data.retrained_edible || [],
      poisonous: data.retrained_poisonous || [],
    }
    summary.value = data.summary || { total: 0, edible_count: 0, poisonous_count: 0 }
    retrainedSummary.value = data.retrained_summary || { total: 0, edible_count: 0, poisonous_count: 0 }

    edibleSelected.value = candidates.value.edible.map((s: ScanCandidate) => s.id)
    poisonousSelected.value = candidates.value.poisonous.map((s: ScanCandidate) => s.id)
    trainedSelected.value = { edible: [], poisonous: [] }
    brokenImages.value = {}
  } catch (err) {
    console.error('Failed to fetch retrain candidates:', err)
  } finally {
    loading.value = false
  }
}

async function restoreScans(all: boolean) {
  const ids = [...trainedSelected.value.edible, ...trainedSelected.value.poisonous]
  if (!all && ids.length === 0) return

  restoring.value = true
  try {
    await $fetch(`${api}/admin/retrain/restore`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: all ? { all: true } : { scan_ids: ids },
    })
    await fetchCandidates()
    queueView.value = 'ready'
  } catch (err: any) {
    statusError.value = err?.data?.message || 'Failed to restore scan images.'
  } finally {
    restoring.value = false
  }
}

async function fetchStatus() {
  const previousState = retrainState.value
  try {
    const data = await $fetch<any>(`${api}/admin/retrain/status`, { headers: authHeaders() })
    const current = data.current || { state: 'idle' }
    retrainState.value = current.state
    statusError.value = current.error ?? null
    if (current.last_result) lastResult.value = current.last_result
    history.value = data.history ?? []

    if (current.state === 'done' || current.state === 'failed') {
      stopPolling()
    }
    if (data.scans_updated || (previousState === 'running' && current.state === 'done')) {
      await fetchCandidates()
    }
  } catch {
    // silently ignore transient polling errors
  }
}

async function refreshAll() {
  await Promise.all([fetchCandidates(), fetchStatus()])
}

async function refreshMlService() {
  refreshingMl.value = true
  try {
    const res = await $fetch<any>(`${api}/admin/retrain/refresh`, {
      method: 'POST',
      headers: authHeaders(),
    })
    toastSuccess(res?.message || 'ML inference models refreshed and ready for new scans.')
    await fetchStatus()
  } catch (err: any) {
    toastError(err?.data?.message || 'Could not reach ML service.')
  } finally {
    refreshingMl.value = false
  }
}

async function startRetrain() {
  if (totalSelected.value === 0) return
  const ok = await confirm({
    title: 'Start AI Model Retraining?',
    message: `Train the model using ${edibleSelected.value.length} edible and ${poisonousSelected.value.length} poisonous scan images.`,
    tone: 'info',
    confirmText: 'Start Retrain',
  })
  if (!ok) return

  retrainState.value = 'running'
  statusError.value = null

  try {
    await $fetch(`${api}/admin/retrain`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: {
        edible_ids: edibleSelected.value,
        poisonous_ids: poisonousSelected.value,
      },
    })
    await fetchStatus()
    startPolling()
  } catch (err: any) {
    retrainState.value = 'failed'
    statusError.value = err?.data?.message || String(err)
    await fetchStatus()
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

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(async () => {
  await refreshAll()
  if (retrainState.value === 'running') startPolling()
})

onUnmounted(() => stopPolling())
</script>

