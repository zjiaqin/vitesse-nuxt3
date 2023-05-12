import { defineStore } from 'pinia'

function initState() {
  return {
    userInfo: null,
  }
}

const useUser = defineStore({
  id: 'user',
  state: initState,
  actions: {},
  persist: {
    storage: persistedState.localStorage,
    paths: ['userInfo'],
  },
})

export {
  useUser,
}
