<script setup>
import getDayOfTheWeek from '@/helpers/dayOfTheWeek'
import { onMounted, ref } from 'vue'
const props = defineProps({
  fiveDaysArray: {
    type: Array,
    default: () => [],
  },
  oneDayObject: {
    type: Object,
    default: () => {},
  },
})

const weatherValues = ref({})

const renameValues = () => {
  if (!props.oneDayObject.main) return
  weatherValues.value = Object.entries(props.oneDayObject.main).map(
    ([key, value]) => {
      if (
        key === 'temp' ||
        key === 'feels_like' ||
        key === 'temp_min' ||
        key === 'temp_max'
      ) {
        if (key === 'temp') key = 'temperature'
        if (key === 'feels_like') key = 'feels like'
        if (key === 'temp_min') key = 'min'
        if (key === 'temp_max') key = 'max'
        return [
          { type: key, temp: Math.floor(value).toFixed(0) + '\u00B0' + 'C' },
        ]
      }
      return [{ type: key, temp: value }]
    }
  )
}

onMounted(() => {
  renameValues()
})
</script>
<template>
  <div class="weather__lists">
    <ul
      v-if="fiveDaysArray?.length > 0"
      class="weather__list"
    >
      <li
        v-for="weatherData in fiveDaysArray"
        :key="weatherData.date"
        class="weather__line"
      >
        <strong class="weather__text">
          {{ getDayOfTheWeek(weatherData.date) }}
        </strong>
        <span class="weather__text">
          average temp: {{ weatherData.temp }}&deg;C
        </span>
        <span class="weather__text">min: {{ weatherData.min }}&deg;C </span>
        <span class="weather__text">max: {{ weatherData.max }}&deg;C </span>
        <img
          :src="`http://openweathermap.org/img/w/${weatherData.icon}.png`"
          alt="weather icon"
        />
      </li>
    </ul>

    <ul
      v-if="fiveDaysArray?.length === 0"
      class="weather__list"
    >
      <li
        v-for="oneDayValue in weatherValues"
        :key="oneDayValue"
        class="weather__line"
      >
        <span
          v-for="value in oneDayValue"
          :key="value"
          class="weather__text"
        >
          {{ value.type }}
          {{ value.temp }}
        </span>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.weather {
  &__line {
    margin-bottom: 20px;
    border: 1px solid rgba(14, 1, 66, 0.7);
    border-radius: 10px;
    padding: 10px;
  }

  &__list {
    padding: 30px;
    border-radius: 3px;
  }

  &__text {
    margin-right: 10px;
    display: block;
  }
}

@media (max-width: 1155px) {
  .weather {
    &__lists {
      width: 100%;
    }
    &__list {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      padding: 30px 0;
    }

    &__line{
      margin: 10px;
    }
  }
}
</style>
