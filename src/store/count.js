import { defineStore } from 'pinia'


export const countStore = defineStore('count', {
  state: () => {
    return {
      count: 0,
    }
  },

  getters: {
    doubleCount: (state) => {
      return state.count * 2
    },
  },

  actions: {
    increment() {
      this.count++
    },
  },
})