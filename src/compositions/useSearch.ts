import {
  YouTubeURLParser,
} from '@iktakahiro/youtube-url-parser'
import { ref } from 'vue'
import {
  useRouter,
} from 'vue-router'
import useNotify from './useNotify'

export function useSearch() {
  const searchValue = ref<string>('')
  const router = useRouter()
  const notify = useNotify()

  const search = () => {
    if (searchValue.value.length === 0)
      return notify.danger('Please enter something 😯')

    const parser = new YouTubeURLParser(searchValue.value)

    let videoId = searchValue.value
    if (parser.isValid())
      videoId = parser.getId()

    router.push(`/${videoId}`)
  }

  return {
    searchValue,
    search,
  }
}
