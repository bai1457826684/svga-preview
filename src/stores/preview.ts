import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePreviewStore = defineStore('preview', () => {
  const isAccurate = ref(localStorage.getItem('isAccurate') === 'true' ? true : false)

  const switchAccurate = () => {
    isAccurate.value = !isAccurate.value
    localStorage.setItem('isAccurate', isAccurate.value.toString())
  }

  return { isAccurate, switchAccurate }
})
