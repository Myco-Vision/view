// Global toast/notification composable — replaces all alert() calls
interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  function show(message: string, type: Toast['type'] = 'info', duration = 3500) {
    const id = ++nextId
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
  }

  function remove(id: number) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  return {
    toasts: readonly(toasts),
    remove,
    success: (msg: string, dur?: number) => show(msg, 'success', dur),
    error:   (msg: string, dur?: number) => show(msg, 'error',   dur),
    warning: (msg: string, dur?: number) => show(msg, 'warning', dur),
    info:    (msg: string, dur?: number) => show(msg, 'info',    dur),
  }
}
