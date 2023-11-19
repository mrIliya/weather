<script setup>
const props = defineProps({
  state: {
    type: Boolean,
    default: false,
  },
})
</script>
<template>
  <button :class="!state ? 'days-button five-days' : 'days-button one-day'">
    <slot />
  </button>
</template>
<style lang="scss" scoped>
.days-button {
  min-width: 70px;
  border: 1px solid #012301;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  padding: 5px;
  user-select: none;
  transition: all ease-out 0.6s;

  &.one-day {
    background-color: rgba(255, 255, 66, 0.8);
    pointer-events: none;
  }
  &.five-days {
    background-color: rgba(58, 58, 245, 0.8);
    pointer-events: all;
    color: #fff;
    
    &:hover {
      background-color: rgba(255, 255, 66, 0.8);
      color: #000;
    }
  }

  &:nth-of-type(1) {
    border-radius: 10px 0 0 10px;
  }
  &:nth-of-type(2) {
    border-radius: 0px 10px 10px 0;
  }
}
</style>
