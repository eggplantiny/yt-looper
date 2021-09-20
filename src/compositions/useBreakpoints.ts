import {
  computed,
  ref,
  onMounted,
  onUnmounted
} from "vue"

export default function useBreakpoints () {
  let windowWidth = ref(window.innerWidth)
  
  const onWidthChange = () => windowWidth.value = window.innerWidth
  onMounted(() => window.addEventListener('resize', onWidthChange))
  onUnmounted(() => window.removeEventListener('resize', onWidthChange))

  const type = computed(() => {
    if (windowWidth.value < 550) return 'xs'
    if (windowWidth.value > 549 && windowWidth.value < 1200) return 'md'
    if (windowWidth.value > 1199) return 'lg'
  })
  
  const width = computed(() => windowWidth.value)
  
  return { width, type }
}
