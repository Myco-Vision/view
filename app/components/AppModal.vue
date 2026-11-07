<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
        :class="variant === 'dark' ? 'bg-black/70' : 'bg-slate-900/50'"
        @mousedown.self="onBackdrop"
      >
        <div
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          class="relative w-full max-h-[88vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden outline-none"
          :class="[sizeClass, variant === 'dark'
            ? 'bg-[#0d221b] border border-emerald-700/30 shadow-black/80 text-slate-100'
            : 'bg-white border border-slate-200 text-slate-900']"
          @keydown.tab="trapFocus"
        >
          <!-- Header -->
          <slot name="header">
            <div
              v-if="title || $slots.default"
              class="flex items-start justify-between gap-3 px-6 pt-5 pb-3"
            >
              <div class="min-w-0">
                <h2 :id="titleId" class="text-base font-bold leading-snug" :class="variant === 'dark' ? 'text-white' : 'text-slate-900'">{{ title }}</h2>
                <p v-if="subtitle" class="text-xs mt-0.5" :class="variant === 'dark' ? 'text-slate-400' : 'text-slate-500'">{{ subtitle }}</p>
              </div>
              <button
                v-if="!persistent"
                type="button"
                aria-label="Close"
                class="shrink-0 p-1 -mr-1 rounded-md bg-transparent border-none cursor-pointer transition-colors"
                :class="variant === 'dark' ? 'text-slate-400 hover:text-emerald-300' : 'text-slate-400 hover:text-slate-700'"
                @click="close"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </slot>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-2 text-sm">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 pt-3 pb-5">
            <slot name="footer" />
          </div>
          <div v-else class="pb-3" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// Reusable modal shell. Use it directly for custom content (forms, details),
// or use AppConfirmModal / useConfirm() for simple confirm dialogs.
const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'light' | 'dark'
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  /** Blocks every way of closing (e.g. while saving) */
  persistent?: boolean
}>(), {
  title: '',
  subtitle: '',
  size: 'md',
  variant: 'light',
  closeOnBackdrop: true,
  closeOnEsc: true,
  persistent: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const dialogRef = ref<HTMLElement | null>(null)
const titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`
let previouslyFocused: HTMLElement | null = null

const sizeClass = computed(() => ({
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}[props.size]))

function close() {
  if (props.persistent) return
  emit('update:modelValue', false)
  emit('close')
}

function onBackdrop() {
  if (props.closeOnBackdrop) close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue && props.closeOnEsc) close()
}

// Keep Tab focus inside the dialog
function trapFocus(e: KeyboardEvent) {
  const root = dialogRef.value
  if (!root) return
  const focusable = root.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  if (!focusable.length) { e.preventDefault(); return }
  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}

// Shared scroll lock so nested/stacked modals don't unlock the page too early
const lockKey = '__appModalLocks'
function lockScroll() {
  const w = window as any
  w[lockKey] = (w[lockKey] || 0) + 1
  document.body.style.overflow = 'hidden'
}
function unlockScroll() {
  const w = window as any
  w[lockKey] = Math.max(0, (w[lockKey] || 0) - 1)
  if (!w[lockKey]) document.body.style.overflow = ''
}

watch(() => props.modelValue, (open, wasOpen) => {
  if (typeof document === 'undefined') return
  if (open) {
    previouslyFocused = document.activeElement as HTMLElement | null
    lockScroll()
    nextTick(() => dialogRef.value?.focus())
  } else if (wasOpen) {
    unlockScroll()
    previouslyFocused?.focus?.()
  }
}, { immediate: true })

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (props.modelValue) unlockScroll()
})
</script>
