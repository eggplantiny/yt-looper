import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'

type BreakPoint = 'xs' | 'md' | 'lg' | 'xl'

export default function useBreakpoints() {
  const windowWidth = ref(window.innerWidth)

  const onWidthChange = () => windowWidth.value = window.innerWidth
  onMounted(() => window.addEventListener('resize', onWidthChange))
  onUnmounted(() => window.removeEventListener('resize', onWidthChange))

  const type = computed<BreakPoint>(() => {
    if (windowWidth.value < 550)
      return 'xs'
    if (windowWidth.value > 549 && windowWidth.value < 1200)
      return 'md'
    if (windowWidth.value > 1199)
      return 'lg'
    return 'xl'
  })

  const width = computed(() => windowWidth.value)

  return { width, type }
}
