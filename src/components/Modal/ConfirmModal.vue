<script setup>
const emits = defineEmits(['closeModal', 'deleteItem'])

const closeModalHandler = () => {
  emits('closeModal', true)
}
const deleteItemHandler = () => {
  emits('deleteItem', true)
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
      <div class="modal__buttons">
        <button
          class="modal__btn"
          @click="deleteItemHandler()"
        >
          delete
        </button>
        <button
          class="modal__btn"
          @click="closeModalHandler()"
        >
          cancel
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
