import { createToast } from 'mosha-vue-toastify'

export default function useNotify() {
  const transition = 'zoom'

  return {
    success(message: string) {
      createToast(message, {
        transition,
        type: 'success',
        toastBackgroundColor: '#6366F1',
      })
    },
    warning(message: string) {
      createToast(message, {
        transition,
        type: 'warning',
      })
    },
    danger(message: string) {
      createToast(message, {
        transition,
        type: 'danger',
      })
    },
    info(message: string) {
      createToast(message, {
        transition,
        type: 'info',
      })
    },
  }
}
