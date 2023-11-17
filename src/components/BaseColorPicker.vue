<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <v-btn>
    <slot>color</slot>
    <template v-slot:append>
      <v-icon :color="modelValue">mdi-circle</v-icon>
    </template>
    <v-menu activator="parent" :closeOnContentClick="false">
      <v-color-picker
        :modelValue="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
      ></v-color-picker>
    </v-menu>
  </v-btn>
</template>

<style scoped></style>
