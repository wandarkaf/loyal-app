<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
userStore.fetchUsers()

const payload = ref({
  name: 'Alonso Limon',
  username: 'alonso.limon',
  email: 'lamas.alonso@gmail.com'
})

const createUser = () => {
  userStore.createUser(payload.value)
}

const upsertUser = (id: string) => {
  userStore.upsertUser(id, {
    ...payload.value,
    avatar: 'https://cdn.vuetifyjs.com/images/john.jpg'
  })
}

const deleteUser = (id: string) => {
  userStore.deleteUser(id)
}
</script>

<template>
  <VContainer>
    <v-btn icon="mdi-account-plus" @click="createUser"></v-btn>
    <v-virtual-scroll :items="userStore.users" height="300">
      <template v-slot:default="{ item }">
        <v-list-item :title="item.name" :subtitle="item.email">
          <template v-slot:prepend>
            <v-avatar>
              <v-img :src="item.avatar" :alt="item.name"></v-img>
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-btn icon="mdi-account-edit" variant="text" @click="upsertUser(item.id)"></v-btn>

            <v-btn icon="mdi-delete" variant="text" @click="deleteUser(item.id)"></v-btn>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </VContainer>
</template>
