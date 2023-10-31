<script setup lang="ts">
import { shallowRef, reactive } from 'vue'
import { useVuelidate, type ErrorObject } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { useAuthStore } from '@/stores/AuthStore'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const initialState = {
  email: '',
  password: ''
}

const loading = shallowRef(false)

const signInFormState = reactive({ ...initialState })
const signInRules = {
  email: {
    required,
    email
  },
  password: { required }
}

const v$ = useVuelidate(signInRules, signInFormState)

function errorMessages(errors: ErrorObject[]) {
  return errors.map((e) => e.$message) as string[]
}

function clearForm() {
  v$.value.$reset()
  signInFormState.email = ''
  signInFormState.password = ''
}

async function submitForm() {
  loading.value = true
  const isFormCorrect = await v$.value.$validate()
  loading.value = false

  if (!isFormCorrect) return
  await authStore.signInUser(signInFormState)
  successRedirect()
}

function successRedirect() {
  console.log('redirecting')
  const redirectTo = (route.query.redirectTo as string) || { name: 'loyaltiy' }
  router.push(redirectTo)
}
</script>

<template>
  <v-container>
    <VForm @submit.prevent class="my-10 flex flex-col gap-4">
      <VTextField
        v-model="signInFormState.email"
        :errorMessages="errorMessages(v$.email.$errors)"
        label="email"
        required
        @input="v$.email.$touch"
        @blur="v$.email.$touch"
      />
      <VTextField
        v-model="signInFormState.password"
        :errorMessages="errorMessages(v$.password.$errors)"
        label="Password"
        type="password"
        required
        @input="v$.password.$touch"
        @blur="v$.password.$touch"
      />
      <div class="flex gap-4 justify-end">
        <VBtn @click="clearForm">Clear</VBtn>
        <VBtn @click="submitForm" color="primary" :loading="loading">Signin</VBtn>
      </div>
    </VForm>
  </v-container>
</template>
<style scoped></style>
