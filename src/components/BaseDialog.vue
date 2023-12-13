<script setup lang="ts">
import { shallowRef } from 'vue'
import { useElementSize } from '@vueuse/core'

const cardRef = shallowRef<HTMLElement>()
const toolbarRef = shallowRef<HTMLElement>()

const { width: cardWidth, height: cardHeight } = useElementSize(cardRef)
const { height: toolbarHeight } = useElementSize(toolbarRef)

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <v-dialog
    :modelValue="modelValue"
    fullscreen
    transition="dialog-bottom-transition"
    :scrim="false"
    @update:model-value="updateModelValue"
  >
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props"> {{ title }}</v-btn>
    </template>
    <v-card ref="cardRef">
      <v-toolbar ref="toolbarRef">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon @click="$emit('update:modelValue', false)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <slot :dimensions="{ width: cardWidth, height: cardHeight - toolbarHeight }"></slot>
    </v-card>
  </v-dialog>
</template>
<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
</style>
