<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCardStore } from '@/stores/CardStore'
import BaseCard from '@/components/BaseCard.vue'
import BaseColorPicker from '@/components/BaseColorPicker.vue'
import { shallowRef, watch } from 'vue'

const route = useRoute()
const cardStore = useCardStore()

const localCard = shallowRef<{
  name: string
  description: string
  style: {
    backgroundColor: string
    borderColor: string
    stampActiveColor: string
    stampInactiveColor: string
    color: string
    borderWidth: number
  }
}>({
  name: '',
  description: '',
  style: {
    backgroundColor: '',
    borderColor: '',
    stampActiveColor: '',
    stampInactiveColor: '',
    color: '',
    borderWidth: 0
  }
})

cardStore.fetchCard(route.params.id as string)

// const saveCard = () => {
//   cardStore.upsertCard(route.params.id as string, {
//     name: name.value,
//     description: description.value
//   })
// }

watch(
  () => cardStore.card,
  (card) => {
    localCard.value = card
  }
)
</script>
<template>
  <VContainer>
    <div class="flex gap-4">
      <BaseCard :card="localCard" />
      <div>
        <h1>Style</h1>
        <div v-if="localCard.style" class="flex flex-wrap gap-2">
          <div class="flex flex-col gap-4">
            <h2>General</h2>
            <BaseColorPicker v-model="localCard.style.backgroundColor">Background</BaseColorPicker>
            <BaseColorPicker v-model="localCard.style.color">text</BaseColorPicker>
          </div>
          <div class="flex flex-col gap-4">
            <h2>Border</h2>
            <BaseColorPicker v-model="localCard.style.borderColor">Border</BaseColorPicker>
            <!-- <VTextField
              v-model="localCard.style.borderWidth"
              label="Border width"
              type="number"
              suffix="px"
            /> -->
          </div>
          <div class="flex flex-col gap-4">
            <h2>Stamp</h2>
            <BaseColorPicker v-model="localCard.style.stampActiveColor">
              Active stamp
            </BaseColorPicker>
            <BaseColorPicker v-model="localCard.style.stampInactiveColor">
              Default stamp
            </BaseColorPicker>
          </div>
        </div>
      </div>
    </div>

    <VTextField v-model="localCard.name" label="Name" required />
    <VTextarea v-model="localCard.description" label="Description" counter="500" noResize />
  </VContainer>
</template>

<style scoped></style>
