export interface IPlayerVars {
  autoplay?: 0 | 1 | undefined
  cc_lang_pref?: string | undefined
  cc_load_policy?: 1 | undefined
  color?: 'red' | 'white' | undefined
  controls?: 0 | 1 | undefined
  disablekb?: 0 | 1 | undefined
  enablejsapi?: 0 | 1 | undefined
  end?: number | undefined
  fs?: 0 | 1 | undefined
  hl?: string | undefined
  iv_load_policy?: 1 | 3 | undefined
  list?: string | undefined
  listType?: 'playlist' | 'search' | 'user_uploads' | undefined
  loop?: 0 | 1 | undefined
  modestbranding?: 1 | undefined
  origin?: string | undefined
  playlist?: string | undefined
  playsinline?: 0 | 1 | undefined
  rel?: 0 | 1 | undefined
  start?: number | undefined
  widget_referrer?: string | undefined
}

export declare namespace Youtube {
  type PlaybackRate = 0.25 | 0.50 | 0.75 | 1.0 | 1.25 | 1.50 | 1.75 | 2.0
}

export declare namespace Tailwind {
  type ColorLevel = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  type Color = 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'black' | 'white'
}

export declare namespace Style {
  type Size = 'em' | 'ex' | 'px' | '%'
}

export interface Loop {
  start: number
  end: number
  url: string
  createdAt: number
  id: string
  name?: string
}

export declare namespace Components {
  interface Item {
    key: string
    value: any
  }
}

export interface ISize {
  width: number
  height: number
}
