<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  headers: {
    type: Array,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['stamp', 'redeem'])

const getColor = (calories: number) => {
  if (calories > 100) return 'red'
  else if (calories > 50) return 'orange'
  else return 'green'
}

const search = ref('')
</script>
<template>
  <div class="flex flex-col gap-4">
    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table :headers="headers" :items="items" :search="search">
      <!-- <template v-slot:item.calories="{ value }">
        <v-chip :color="getColor(value)">
          {{ value }}
        </v-chip>
      </template> -->
      <template v-slot:item.actions="{ item }">
        <v-btn
          v-if="!(item.count >= item.cardMaxCount)"
          class="text-none"
          stacked
          variant="text"
          @click="emit('stamp', item)"
        >
          <v-badge color="info" :content="item.count">
            <v-icon>mdi-stamper</v-icon>
          </v-badge>
        </v-btn>
        <v-btn v-if="item.canBeRedeem" variant="text" color="warning" @click="emit('redeem', item)">
          Can be redeem
        </v-btn>
        <v-chip v-if="item.redeem" color="success" text-color="white">Claimed!</v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<style scoped></style>
