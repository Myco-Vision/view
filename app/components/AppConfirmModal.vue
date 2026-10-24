<template>
  <AppModal
    :model-value="state.open.value"
    size="sm"
    :variant="variant"
    :persistent="state.loading.value"
    @update:model-value="(v: boolean) => { if (!v) cancel() }"
  >
    <template #header><span /></template>

    <div class="flex flex-col items-center text-center gap-3 pt-5 pb-1">
      <div class="w-12 h-12 rounded-2xl flex items-center justify-center" :class="toneStyles.icon">
        <svg v-if="tone === 'danger'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
        <svg v-else-if="tone === 'warning'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <svg v-else-if="tone === 'success'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
        </svg>
        <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      <div>
        <h3 class="text-base font-bold" :class="variant === 'dark' ? 'text-white' : 'text-slate-900'">{{ opts.title }}</h3>
        <p v-if="opts.message" class="text-[13px] mt-1.5 leading-relaxed" :class="variant === 'dark' ? 'text-slate-400' : 'text-slate-500'">{{ opts.message }}</p>
      </div>

      <!-- Type-to-confirm (for destructive actions) -->
      <div v-if="opts.requireText" class="w-full text-left mt-1">
        <label class="text-[12px] font-medium" :class="variant === 'dark' ? 'text-slate-300' : 'text-slate-600'">
          Type <strong class="font-bold">{{ opts.requireText }}</strong> to confirm
        </label>
        <input
          v-model="typed"
          type="text"
          autocomplete="off"
          class="mt-1.5 w-full py-2 px-3 rounded-lg border text-[13px] focus:outline-none focus:ring-2"
          :class="variant === 'dark'
            ? 'bg-stone-950/80 border-emerald-800/40 text-white focus:border-emerald-400 focus:ring-emerald-400/20'
            : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20'"
          @keyup.enter="submit"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3">
        <button
          type="button"
          class="flex-1 py-2.5 px-4 rounded-xl text-[13px] font-semibold border cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="variant === 'dark'
            ? 'bg-transparent border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/30'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
          :disabled="state.loading.value"
          @click="cancel"
        >
          {{ opts.cancelText }}
        </button>
        <button
          ref="confirmBtn"
          type="button"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="toneStyles.button"
          :disabled="state.loading.value || !canSubmit"
          @click="submit"
        >
          <span v-if="state.loading.value" class="w-[14px] h-[14px] border-2 border-white/40 border-t-white rounded-full animate-spin" />
          {{ opts.confirmText }}
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
// Single global confirm dialog — mounted once in app.vue and driven by useConfirm().
withDefaults(defineProps<{ variant?: 'light' | 'dark' }>(), { variant: 'light' })

const { state, accept, cancel } = useConfirm()
const opts = computed(() => state.options.value)
const tone = computed(() => opts.value.tone ?? 'danger')
const typed = ref('')

const toneStyles = computed(() => ({
  danger:  { icon: 'bg-red-100 text-red-600',         button: 'bg-red-600 text-white hover:bg-red-700' },
  warning: { icon: 'bg-amber-100 text-amber-600',     button: 'bg-amber-500 text-white hover:bg-amber-600' },
  success: { icon: 'bg-emerald-100 text-emerald-600', button: 'bg-emerald-600 text-white hover:bg-emerald-700' },
  info:    { icon: 'bg-emerald-100 text-emerald-600', button: 'bg-emerald-600 text-white hover:bg-emerald-700' },
}[tone.value]))

const canSubmit = computed(() => !opts.value.requireText || typed.value === opts.value.requireText)

function submit() {
  if (!canSubmit.value) return
  accept().catch(() => { /* the caller handles its own error toast */ })
}

// Reset the typed text each time the dialog opens
watch(() => state.open.value, (open) => { if (open) typed.value = '' })
</script>
