<script setup lang="ts"></script>
<template>
  <VContainer>
    <div class="py-6 flex flex-col gap-3">
      <h1>Lorem Ipsum</h1>
      <h2>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h2>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </p>
      <div class="flex gap-3 justify-center">
        <VBtn v-for="j in 3" :key="`${j}`" color="primary">Button {{ j }}</VBtn>
      </div>
    </div>
  </VContainer>
</template>

<style scoped></style>
