<script setup>
import { watch, ref, onMounted, Transition } from 'vue'
import Chart from 'chart.js/auto'
import weather from '@/api/weather'
import userIP from '@/api/userIP'
import { setStorage, getStorage } from '@/helpers/local'
import WarningModal from '../Modal/WarningModal.vue'
import Search from '../Search/Search.vue'
import ConfirmModal from '../Modal/ConfirmModal.vue'
import DaysButton from '../Button/DaysButton.vue'
import WeatherList from './WeatherList.vue'

const props = defineProps({
  canvasId: {
    type: Number,
    default: 0,
  },
  favorites: {
    type: Boolean,
    default: false,
  },
  blockCount: {
    type: Array,
    default: () => [],
  },
  city: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['deleteItem', 'deleteFromFav'])

const mainWeather = ref({})
const fiveDaysWeather = ref([])
const weatherChart = ref(null)
const warningModalState = ref(false)
const confirmModalState = ref(false)
const favCities = ref([])
const isFavorite = ref(false)
const oneDayState = ref(false)
const fiveDaysState = ref(false)
const searchError = ref({
  error: false,
  message: '',
})

const createNewChart = (labelsArray, dataArray) => {
  const chartValue = weatherChart.value.getContext('2d')

  const chartStatus = Chart.getChart(weatherChart.value.id)

  if (chartStatus !== undefined) {
    chartStatus.destroy()
  }

  new Chart(chartValue, {
    type: 'bar',
    data: {
      labels: labelsArray,
      datasets: [
        {
          label: 'temperature',
          data: dataArray,
          maxBarThickness: 60,
        },
      ],
    },
    options: {},
  })
}

const initChart = async () => {
  const dayTemp = await weather.getData(
    mainWeather.value.coord.lat,
    mainWeather.value.coord.lon
  )

  const temp = dayTemp.map((item) => item.temp)

  const time = dayTemp.map((item) => {
    const unix_timestamp = item.dt
    const date = new Date(unix_timestamp * 1000)
    const hours = date.getHours()
    return hours
  })

  const half = Math.ceil(time.length / 2)
  const firstHalf = time.slice(0, half)
  const oneDay = firstHalf.filter((item, index) => item <= 23 && index < item)
  const oneDayHours = oneDay.map((item) => item.toString() + ':00')

  createNewChart(oneDayHours, temp)
}

watch(mainWeather, () => {
  initChart()
})

const deleteItemHandler = () => {
  confirmModalState.value = true
}

const deleteItem = () => {
  emits('deleteItem', true)
}

const deleteFromFavHandler = () => {
  emits('deleteFromFav', true)
}

const isFavHandler = async () => {
  favCities.value = await getStorage('fav')
  if(!favCities.value) return
  isFavorite.value = favCities.value.some(
    (item) => item === mainWeather.value.name
  )
}

const changeCity = async (city) => {
  const cityWeather = await weather.getCityWeather(city)

  if (cityWeather?.cod === 200) {
    mainWeather.value = cityWeather
    await isFavHandler()

    searchError.value = {
      error: false,
      message: '',
    }
  } else {
    searchError.value = {
      error: true,
      message: cityWeather.response.data.message,
    }
  }
}

const toFavorites = async () => {
  const cities = await getStorage('fav')
  if (!cities) {
    setStorage('fav', [mainWeather.value.name])
  } else {
    const existedCity = cities.find((item) => item === mainWeather.value.name)
    if (!existedCity) {
      if (cities.length < 5) {
        cities.push(mainWeather.value.name)
        setStorage('fav', cities)
      } else {
        warningModalState.value = true
      }
    }
  }

  await isFavHandler()
}

const closeConfirmModal = () => {
  confirmModalState.value = false
}

const closeWarningModal = () => {
  warningModalState.value = false
}

const getFiveDaysHandler = async () => {
  const fiveDays = await weather.getFiveDays(
    mainWeather.value.coord.lat,
    mainWeather.value.coord.lon
  )

  const fiveDaysSpec = fiveDays.list.map((item) => {
    const day = {
      date: item.dt_txt.split('', 10).join(''),
      temp: item.main.temp,
      min: item.main.temp_min,
      max: item.main.temp_max,
      icon: item.weather[0].icon,
    }
    return day
  })

  const daysSortedObject = fiveDaysSpec.reduce((acc, current) => {
    acc[current.date] = acc[current.date] || []
    acc[current.date].push(current)
    return acc
  }, {})

  const finalResultDate = []
  const finalResultTemp = []
  const finalFiveDays = []

  for (const key in daysSortedObject) {
    const sum = daysSortedObject[key].reduce(
      (acc, current) => acc + current.temp,
      0
    )

    daysSortedObject[key].map((item) => {
      item.temp = Math.floor(sum / daysSortedObject[key].length).toFixed(0)
      return item
    })

    finalFiveDays.push(daysSortedObject[key][0])
    finalResultDate.push(daysSortedObject[key][0].date)
    finalResultTemp.push(daysSortedObject[key][0].temp)
  }

  finalResultDate.pop()
  finalResultTemp.pop()
  finalFiveDays.pop()
  fiveDaysWeather.value = finalFiveDays

  createNewChart(finalResultDate, finalResultTemp)

  fiveDaysState.value = true
  oneDayState.value = false
}

const getOneDayHandler = () => {
  fiveDaysWeather.value = []
  initChart()
  fiveDaysState.value = false
  oneDayState.value = true
}

const initCard = async () => {
  try {
    if (!props.city) {
      const ipAdress = await userIP.getUserIP()
      const location = await userIP.getUserLocation(ipAdress)
      if (ipAdress && location.city){
        mainWeather.value = await weather.getCityWeather(location.city)
      }else{
        mainWeather.value = await weather.getCityWeather('London')
      }
        
    } else {
      mainWeather.value = await weather.getCityWeather(props.city)
    }

    await isFavHandler()
  } catch (error) {
    console.log(error)
  } finally {
    fiveDaysState.value = false
    oneDayState.value = true
  }
}

onMounted(async () => {
  await initCard()
})
</script>
<template>
  <div :class="[isFavorite ? 'weather favorite' : 'weather']">
    <Transition>
      <div
        v-show="!mainWeather?.name"
        class="preloader"
      >
        ...loading
      </div>
    </Transition>

    <Search
      v-if="!props.favorites"
      :search-error="searchError"
      @change-city="changeCity"
    />

    <div class="weather__top">
      <h2 class="weather__title">
        {{ mainWeather?.name }}
      </h2>
      <div class="weather__btns">
        <DaysButton
          :state="oneDayState"
          @click="getOneDayHandler"
        >
          1 Day
        </DaysButton>
        <DaysButton
          :state="fiveDaysState"
          @click="getFiveDaysHandler"
        >
          5 Days
        </DaysButton>
      </div>
      <button
        v-if="!props.favorites && props.blockCount.length > 1"
        class="weather__remove"
        @click="deleteItemHandler"
      >
        -
      </button>
    </div>
    <div class="weather__buttons">
      <button
        v-if="!props.favorites && !isFavorite"
        class="weather__btn"
        @click="toFavorites"
      >
        to fav
      </button>
      <button
        v-if="props.favorites"
        class="weather__btn"
        @click="deleteFromFavHandler"
      >
        delete
      </button>
    </div>

    <div class="weather__content">
      <WeatherList
        v-if="mainWeather && Object.keys(mainWeather)?.length > 0"
        :five-days-array="fiveDaysWeather"
        :one-day-object="mainWeather"
      />
      <div class="weather__chart">
        <canvas
          :id="mainWeather.id + props.canvasId"
          ref="weatherChart"
          class="weather__canvas"
        />
      </div>
    </div>

    <Transition>
      <ConfirmModal
        v-show="confirmModalState"
        @close-modal="closeConfirmModal()"
        @delete-item="deleteItem"
      >
        Delete item?
      </ConfirmModal>
    </Transition>
    <Transition>
      <WarningModal
        v-show="warningModalState"
        @close-modal="closeWarningModal()"
      >
        Maximum 5 cities, to add remove city
      </WarningModal>
    </Transition>
  </div>
</template>
<style lang="scss" scoped>
.weather {
  position: relative;
  margin: 15px 0;
  border: 3px solid #343434;
  border-radius: 15px;
  padding: 10px;

  &.favorite {
    border: 3px solid yellowgreen;
  }

  &__num {
    width: 40px;
    height: 40px;
    margin-bottom: 20px;
    background-color: rgba(255, 255, 0, 0.3);
    border-radius: 50%;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__top {
    padding: 20px;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(128, 128, 128, 0.6);
  }

  &__btns {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  &__content {
    display: flex;
  }

  &__text {
    & + span {
      margin-left: 10px;
    }
  }

  &__chart {
    width: 70%;
    margin-bottom: 50px;
    padding: 0 5px;
    display: flex;
    justify-content: flex-end;
  }

  &__remove {
    font-size: 35px;
    font-weight: 700;

    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(209, 69, 69, 0.6);
    margin-left: 15px;
  }

  &__buttons {
    display: flex;
    align-items: center;
    margin: 0 20px;
  }

  &__btn {
    border: 1px solid #121212;
    border-radius: 3px 3px 0 0;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 10px;
    background-color: rgb(255, 165, 0);
    transition: all ease-out 0.6s;
    color: #fff;

    &:hover {
      background-color: rgb(255, 223, 0);
    }
  }
}

.preloader {
  position: absolute;
  top: 60px;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  font-size: 25px;
}

@media (max-width: 1155px) {
  .weather {
    &__top {
      flex-wrap: wrap;
    }

    &__content {
      flex-direction: column;
      align-items: center;
    }

    &__chart {
      width: 100%;
    }
  }
}

@media (max-width: 600px) {
  .weather {
    &__top {
      margin: 20px 10px;
      justify-content: center;
    }

    &__title {
      width: 100%;
      margin-bottom: 20px;
    }

    &__buttons {
      margin: 0 10px;
    }
  }
}
</style>
