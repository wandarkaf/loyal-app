<script setup lang="ts">
import { onMounted } from 'vue'
import { useDark } from '@vueuse/core'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = useDark()

function toggleDarkMode() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  isDark.value = !isDark.value
}

onMounted(() => {
  theme.global.name.value = isDark.value ? 'dark' : 'light'
})
</script>
<template>
  <VBtn @click="toggleDarkMode" color="primary" icon><VIcon>mdi-theme-light-dark</VIcon></VBtn>
</template>

<style scoped></style>
