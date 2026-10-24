// Global confirm-dialog composable — replaces native window.confirm()
// Usage:
//   const { confirm } = useConfirm()
//   const ok = await confirm({ title: 'Delete scan?', message: '...', tone: 'danger', confirmText: 'Delete' })
//   if (!ok) return
export type ConfirmTone = 'danger' | 'warning' | 'info' | 'success'

export interface ConfirmOptions {
  title: string
  message?: string
  tone?: ConfirmTone
  confirmText?: string
  cancelText?: string
  /** If set, the user must type this exact text before the confirm button is enabled */
  requireText?: string
  /** Optional async work to run on confirm; the button shows a spinner until it settles */
  onConfirm?: () => Promise<unknown> | unknown
}

const open = ref(false)
const loading = ref(false)
const options = ref<ConfirmOptions>({ title: '' })
let resolver: ((value: boolean) => void) | null = null

function settle(value: boolean) {
  open.value = false
  loading.value = false
  resolver?.(value)
  resolver = null
}

export function useConfirm() {
  function confirm(opts: ConfirmOptions): Promise<boolean> {
    // If a dialog is already open, cancel it first
    if (resolver) resolver(false)
    options.value = { tone: 'danger', confirmText: 'Confirm', cancelText: 'Cancel', ...opts }
    loading.value = false
    open.value = true
    return new Promise<boolean>((resolve) => { resolver = resolve })
  }

  async function accept() {
    if (loading.value) return
    const action = options.value.onConfirm
    if (!action) return settle(true)
    loading.value = true
    try {
      await action()
      settle(true)
    } catch (e) {
      // Keep the dialog usable if the action fails; callers show their own error toast
      loading.value = false
      settle(false)
      throw e
    }
  }

  function cancel() {
    if (loading.value) return
    settle(false)
  }

  return {
    confirm,
    // internal state for AppConfirmModal
    state: { open, loading, options },
    accept,
    cancel,
  }
}
