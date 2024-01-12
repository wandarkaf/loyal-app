<script setup lang="ts">
defineProps({
  inputId: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'File input'
  },
  imageSource: {
    type: String,
    required: true
  }
})
</script>
<template>
  <div>
    <label :for="inputId" class="cursor-pointer">
      <v-img v-if="imageSource" :src="imageSource" width="100" height="100" class="m-auto" />
    </label>
    <v-file-input
      :id="inputId"
      v-show="!imageSource"
      :label="label"
      @change="$emit('change', $event)"
      accept="image/*"
    />
  </div>
</template>

<style scoped></style>
