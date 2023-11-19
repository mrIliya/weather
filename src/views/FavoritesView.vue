<script setup>
import { onMounted, ref, Transition, TransitionGroup } from 'vue'
import { setStorage, getStorage } from '../helpers/local'
import weather from '../api/weather'
import WeatherCard from '../components/WeatherCard/WeatherCard.vue'
import ConfirmModal from '../components/Modal/ConfirmModal.vue'

const favCities = ref([])
const weatherData = ref([])
const confirmationModal = ref(false)
const itemToDelete = ref('')

const initFavList = async () => {
  favCities.value = await getStorage('fav')
  if(!favCities.value) return
  for (const city of favCities.value) {
    await weather
      .getCityWeather(city)
      .then((res) => weatherData.value.push(res))
  }
}

const deleteFromFav = async (name) => {
  confirmationModal.value = true
  itemToDelete.value = name
}

const confirmDeleting = () => {
  confirmationModal.value = false

  const cities = getStorage('fav')

  const cityList = cities.filter((item) => item !== itemToDelete.value)
  weatherData.value = weatherData.value.filter(
    (item) => item.name !== itemToDelete.value
  )
  setStorage('fav', cityList)
}

const closeModal = () => {
  confirmationModal.value = false
}

onMounted(async () => {
  await initFavList()
})
</script>
<template>
  <section class="favorites section">
    <div
      v-if="weatherData.length === 0"
      class="favorites__message"
    >
      no favorites yet
    </div>
    <TransitionGroup>
      <WeatherCard
        v-for="currentWeather in weatherData"
        :id="currentWeather.id"
        :key="currentWeather.id"
        :canvas-id="currentWeather.id"
        :favorites="true"
        :city="currentWeather.name"
        @delete-from-fav="deleteFromFav(currentWeather.name)"
      />
    </TransitionGroup>
    <Transition>
      <ConfirmModal
        v-show="confirmationModal"
        @close-modal="closeModal()"
        @delete-item="confirmDeleting()"
      >
        Delete from favorites?
      </ConfirmModal>
    </Transition>
  </section>
</template>
<style lang="scss" scoped>
.favorites {
  &__message {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: capitalize;
  }
}
</style>
