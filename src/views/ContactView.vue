<script setup lang="ts">
import { shallowRef } from 'vue'

const name = shallowRef('')
const phone = shallowRef('')
const subject = shallowRef('')
const body = shallowRef('')

const nameRules = shallowRef([
  (value: string) => {
    if (value?.length > 3) return true

    return 'Name must be at least 3 characters.'
  }
])

const phoneRules = shallowRef([
  (value: string) => {
    if (value) return true

    return 'Phone number is requred.'
  },
  (value: string) => {
    if (/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(value)) return true

    return 'Phone number must be valid.'
  }
])

const subjectRules = shallowRef([
  (value: string) => {
    if (value?.length > 3) return true

    return 'Subject must be at least 3 characters.'
  }
])

const messageRules = shallowRef([
  (value: string) => {
    if (value?.length > 3) return true

    return 'Subject must be at least 3 characters.'
  }
])

function submit() {
  const formattedBody = encodeURIComponent(
    `Name: ${name.value}\nPhone number: ${phone.value}\n\n${body.value}`
  )
  window.open(`mailto:lamas.alonso@gmail.com?subject=${subject.value}!&body=${formattedBody}`)
}
</script>
<template>
  <VContainer>
    <h1>Contact form</h1>
    <v-form fast-fail @submit.prevent="submit">
      <v-text-field v-model="name" label="Name" :rules="nameRules"></v-text-field>
      <v-text-field v-model="phone" label="Phone number" :rules="phoneRules"></v-text-field>
      <v-text-field v-model="subject" label="Subject" :rules="subjectRules"></v-text-field>
      <v-textarea v-model="body" label="Message" :rules="messageRules"></v-textarea>
      <v-btn type="submit" block class="mt-2">Submit</v-btn>
    </v-form>
  </VContainer>
</template>

<style scoped></style>
