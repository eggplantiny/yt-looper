<template>
  <div
    class="dropdown inline-block relative"
  >
    <button
      class="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded inline-flex items-center justify-end"
      :style="computedStyle"
    >
      <span class="mr-2">
        <slot />
      </span>
      <svg
        class="fill-current h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
        />
      </svg>
    </button>
    <a-dropdown>
      <template
        v-for="(item, index) in items"
        :key="index"
      >
        <a-list-item
          :color="color"
          :text="text"
          @click="onClickItem(item)"
          class="list-item"
        >
          {{ item }}
        </a-list-item>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts">
import {
  computed,
  PropType,
  SetupContext
} from "vue"

import {
  Tailwind
} from "@/types"

import ADropdown from "@/components/atoms/ADropdown.vue"
import AListItem from "@/components/atoms/AListItem.vue"
import useModel from "@/compositions/useModel"
import {
  useColor, useSize
} from "@/compositions/useStyle"

const model = useModel()

export default {
  name: 'DropdownMenu',
  components: {
    AListItem,
    ADropdown
  },
  emits: {
    ...model.emits
  },
  props: {
    ...model.props,
    items: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    color: {
      type: String as PropType<Tailwind.Color>,
      default: 'indigo'
    },
    text: {
      type: String as PropType<Tailwind.Color>,
      default: 'gray'
    },
    buttonColor: {
      type: String as PropType<Tailwind.Color>,
      default: 'indigo'
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 45
    }
  },
  setup (props, context: SetupContext) {
    const computedClass = computed(() => {
      const bgClasses = [
        useColor('bg', props.color, 300),
        useColor('hover:bg', props.color, 500)
      ]

      const textClasses = [
        useColor('text', props.text, 700),
        useColor('hover:text', 'white')
      ]

      return [...bgClasses, ...textClasses]
    })


    const computedStyle = computed(() => {
      const minWidth = useSize(props.width)
      const width = useSize(100, '%')
      const height = `${props.height}px`

      return {
        minWidth,
        height,
        width
      }
    })


    const onClickItem = (item) => {
      context.emit('update:modelValue', item)
    }

    return {
      computedClass,
      computedStyle,
      onClickItem,
    }
  }
}
</script>

<style scoped>
.dropdown:hover {
  display: block;
}

.dropdown {
  z-index: 1000;
}

.list-item:first-child {
  border-top-left-radius: 0.5em;
  border-top-right-radius: 0.5em;
}

.list-item:last-child {
  border-bottom-left-radius: 0.5em;
  border-bottom-right-radius: 0.5em;
}

</style>
