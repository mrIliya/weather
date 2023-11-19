<script setup>
const emits = defineEmits(['closeModal'])

const closeModalHandler = () => {
  emits('closeModal', true)
}

</script>
<template>
  <div class="modal">
    <div class="modal__content">
      <button
        class="modal__close"
        @click="closeModalHandler()"
      >
        close
      </button>
      <h3 class="modal__text">
        <slot />
      </h3>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
