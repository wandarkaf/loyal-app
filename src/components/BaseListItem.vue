<script setup lang="ts">
const emit = defineEmits(['stamp', 'redeem'])

defineProps({
  user: {
    type: Object,
    required: true
  },
  loyalty: {
    type: Object,
    required: true
  },
  card: {
    type: Object,
    required: true
  }
})
</script>
<template>
  <v-list-item :title="user.name" :subtitle="user.email">
    <template v-slot:prepend>
      <v-avatar>
        <v-img :src="user.avatar" :alt="user.name"></v-img>
      </v-avatar>
    </template>

    <template v-slot:append>
      <template v-if="!(loyalty.count >= card.maxCount)">
        <v-btn class="text-none" stacked variant="text" @click="emit('stamp')">
          <v-badge color="info" :content="loyalty.count">
            <v-icon>mdi-stamper</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-btn v-if="loyalty.canBeRedeem" variant="text" color="warning" @click="emit('redeem')">
        Can be redeem
      </v-btn>
      <v-chip v-if="loyalty.redeem" color="success" text-color="white">Claimed!</v-chip>
    </template>
  </v-list-item>
</template>

<style scoped></style>
