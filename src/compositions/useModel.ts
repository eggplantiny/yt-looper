import {
  SetupContext,
  computed
} from 'vue'

export default function <T> (context: SetupContext) {
  return computed({
    get () {
      return context.attrs.value as T
    },
    set (value: T) {
      context.emit('input', value)
    }
  })
}
