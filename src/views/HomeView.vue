<script setup>
import { ref } from 'vue'
import WeatherCard from '../components/WeatherCard/WeatherCard.vue'

const blocks = ref([0])
const blockCount = ref(0)

const addItem = () => {
  if (blocks.value.length === 5) return
  blocks.value.push(blockCount.value = blockCount.value + 1)
}

const deleteItem = (index) => {
  if (blocks.value.length === 1) return
  blocks.value.splice( blocks.value.findIndex((item) => item === index) , 1)
}
</script>

<template>
  <section class="home section">
    <button
      v-if="blocks.length < 5"
      class="home__add"
      @click="addItem"
    >
      +
    </button>

    <div class="home__content">
      <keep-alive>
        <WeatherCard
          v-for="block in blocks"
          :id="block"
          :key="block"
          :canvas-id="block"
          :block-count="blocks"
          @delete-item="deleteItem(block)"
        />
      </keep-alive>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home {
  position: relative;

  &__add {
    width: 40px;
    height: 40px;
    font-size: 35px;
    font-weight: 700;
    background-color: rgb(0, 128, 0, 0.5);
    border-radius: 50%;

    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: -35px;
    right: 10px;
  }
}

@media (max-width: 415px) {
  .home {
    &__add {
         
      right: 20px;
    }
  }
}
</style>
