<script setup lang="ts">
import { shallowRef, reactive } from 'vue'
import { useVuelidate, type ErrorObject } from '@vuelidate/core'
import { required, minLength, maxLength, helpers } from '@vuelidate/validators'

const initialState = {
  name: '',
  phone: '',
  subject: '',
  body: ''
}

const loading = shallowRef(false)

const phoneValidator = (value: string): boolean =>
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(value)

const contactFormState = reactive({ ...initialState })
const contactRules = {
  name: { required },
  phone: {
    required,
    phoneValidator: helpers.withMessage('This must be a valid phone number', phoneValidator)
  },
  subject: { required },
  body: { required, minLength: minLength(30), maxLength: maxLength(500) }
}

const v$ = useVuelidate(contactRules, contactFormState)

function errorMessages(errors: ErrorObject[]): string[] {
  return errors.map((e) => e.$message) as string[]
}

function clearForm() {
  v$.value.$reset()
  contactFormState.name = ''
  contactFormState.phone = ''
  contactFormState.subject = ''
  contactFormState.body = ''
}

async function submitForm() {
  loading.value = true
  const isFormCorrect = await v$.value.$validate()
  loading.value = false

  if (!isFormCorrect) return

  const formattedBody = encodeURIComponent(
    `Name: ${contactFormState.name}\nPhone number: ${contactFormState.phone}\n\n${contactFormState.body}`
  )
  window.open(
    `mailto:lamas.alonso@gmail.com?subject=${contactFormState.subject}!&body=${formattedBody}`
  )
}
</script>
<template>
  <VForm @submit.prevent class="my-10 flex flex-col gap-4">
    <div class="flex flex-row gap-4">
      <div class="basis-1/2">
        <VTextField
          v-model="contactFormState.name"
          :errorMessages="errorMessages(v$.name.$errors)"
          label="Name"
          required
          @input="v$.name.$touch"
          @blur="v$.name.$touch"
        />
      </div>
      <div class="basis-1/2">
        <VTextField
          v-model="contactFormState.phone"
          :errorMessages="errorMessages(v$.phone.$errors)"
          label="Phone number"
          required
          @input="v$.phone.$touch"
          @blur="v$.phone.$touch"
        />
      </div>
    </div>
    <VTextField
      v-model="contactFormState.subject"
      :errorMessages="errorMessages(v$.subject.$errors)"
      label="Subject"
      required
      @input="v$.subject.$touch"
      @blur="v$.subject.$touch"
    />
    <VTextarea
      v-model="contactFormState.body"
      :errorMessages="errorMessages(v$.body.$errors)"
      label="Message"
      required
      counter="500"
      noResize
      @input="v$.body.$touch"
      @blur="v$.body.$touch"
    />
    <div class="flex gap-4 justify-end">
      <VBtn @click="clearForm">Clear</VBtn>
      <VBtn @click="submitForm" color="primary" :loading="loading">Submit</VBtn>
    </div>
  </VForm>
</template>

<style scoped></style>
