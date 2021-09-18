import {
  defineProps,
  defineEmits
} from "vue"

export default function useValue () {
  const props = defineProps(['modelValue'])
  const emits = defineEmits(['update:modelValue'])

  return {
    props,
    emits
  }
}
