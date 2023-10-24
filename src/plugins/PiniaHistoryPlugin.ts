import { ref, reactive } from 'vue'
import type { PiniaPluginContext } from 'pinia'

import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    historyEnabled?: boolean
  }
  export interface PiniaCustomProperties {
    history: string[]
    future: string[]
    undo: void
    redo: void
  }
}

export function PiniaHistoryPlugin({ store, options }: PiniaPluginContext):
  | {
      history: string[]
      future: string[]
      undo: void
      redo: void
    }
  | {} {
  if (!options.historyEnabled) return {}
  const history = reactive<string[]>([])
  const future = reactive<string[]>([])
  const doingHistory = ref(false)
  history.push(JSON.stringify(store.$state))

  store.$subscribe((mutation, state) => {
    if (!doingHistory.value) {
      history.push(JSON.stringify(state))
      future.splice(0, future.length)
    }
  })
  return {
    history,
    future,
    undo: () => {
      if (history.length === 1) return
      doingHistory.value = true
      future.push(history.pop()!)
      store.$state = JSON.parse(history[history.length - 1])
      doingHistory.value = false
    },
    redo: () => {
      const latestState = future.pop()
      if (!latestState) return
      doingHistory.value = true
      history.push(latestState)
      store.$state = JSON.parse(latestState)
      doingHistory.value = false
    }
  }
}
