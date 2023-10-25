<script setup lang="ts">
import { shallowRef, reactive } from 'vue'
import { useVuelidate, type ErrorObject } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const initialState = {
  name: '',
  email: '',
  username: '',
  avatar: '',
  password: ''
}

const loading = shallowRef(false)

const registerFormState = reactive({ ...initialState })
const contactRules = {
  name: { required },
  email: {
    required,
    email
  },
  username: { required },
  password: { required }
}

const v$ = useVuelidate(contactRules, registerFormState)

function errorMessages(errors: ErrorObject[]) {
  return errors.map((e) => e.$message) as string[]
}

function clearForm() {
  v$.value.$reset()
  registerFormState.name = ''
  registerFormState.email = ''
  registerFormState.username = ''
  registerFormState.avatar = ''
}

async function submitForm() {
  loading.value = true
  const isFormCorrect = await v$.value.$validate()
  loading.value = false

  if (!isFormCorrect) return

  console.log('submitForm')
  await userStore.registerUserWithEmailAndPassword(registerFormState)
  router.push('/')
}
</script>

<template>
  <v-container>
    <VForm @submit.prevent class="my-10 flex flex-col gap-4">
      <div class="flex flex-row gap-4">
        <div class="basis-1/2">
          <VTextField
            v-model="registerFormState.name"
            :errorMessages="errorMessages(v$.name.$errors)"
            label="Name"
            required
            @input="v$.name.$touch"
            @blur="v$.name.$touch"
          />
        </div>
        <div class="basis-1/2">
          <VTextField
            v-model="registerFormState.username"
            :errorMessages="errorMessages(v$.username.$errors)"
            label="Username"
            required
            @input="v$.username.$touch"
            @blur="v$.username.$touch"
          />
        </div>
      </div>
      <VTextField
        v-model="registerFormState.email"
        :errorMessages="errorMessages(v$.email.$errors)"
        label="email"
        required
        @input="v$.email.$touch"
        @blur="v$.email.$touch"
      />
      <VTextField
        v-model="registerFormState.password"
        :errorMessages="errorMessages(v$.password.$errors)"
        label="Password"
        type="password"
        required
        @input="v$.password.$touch"
        @blur="v$.password.$touch"
      />
      <!-- <VTextarea
        v-model="registerFormState.avatar"
        :errorMessages="errorMessages(v$.avatar.$errors)"
        label="Message"
        required
        counter="500"
        noResize
        @input="v$.avatar.$touch"
        @blur="v$.avatar.$touch"
      /> -->
      <div class="flex gap-4 justify-end">
        <VBtn @click="clearForm">Clear</VBtn>
        <VBtn @click="submitForm" color="primary" :loading="loading">Register</VBtn>
      </div>
    </VForm>
  </v-container>
</template>
<style scoped></style>
