<script setup lang="ts">
const links = ['Home', 'About Us', 'Team', 'Services', 'Blog', 'Contact Us']
</script>
<template>
  <VFooter>
    <VRow justify="center" no-gutters>
      <VBtn v-for="link in links" :key="link" variant="text" class="mx-2" rounded="xl">
        {{ link }}
      </VBtn>
      <VCol class="text-center mt-4" cols="12">
        {{ new Date().getFullYear() }} — <strong>Company</strong>
      </VCol>
    </VRow>
  </VFooter>
</template>

<style scoped></style>
