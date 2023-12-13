<script setup lang="ts">
defineProps({
  items: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Array,
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <!-- <h2 class="text-h6 mb-2">Choose filters</h2> -->

  <v-chip-group
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    column
    multiple
    mandatory
  >
    <v-chip v-for="item in items" :key="item as string" :value="item" filter variant="outlined">
      {{ item }}
    </v-chip>
  </v-chip-group>
</template>

<style scoped></style>
