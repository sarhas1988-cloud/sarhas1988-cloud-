type ToastType = 'success' | 'error'
type Listener = (message: string, type: ToastType) => void

const listeners: Listener[] = []

export function onToast(fn: Listener) {
  listeners.push(fn)
  return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1) }
}

export function showToast(message: string, type: ToastType = 'success') {
  listeners.forEach((fn) => fn(message, type))
}
