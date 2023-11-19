<script setup>
import { onMounted, ref } from 'vue'
import search from '@/assets/images/search.svg'

const props = defineProps({
  searchError: {
    type: Object,
    default: () => {},
  },
})

const placeholder = ref('search')
const searchInput = ref(null)
const autocomplete = ref({})

const emit = defineEmits(['changeCity'])

const placeholderHandler = ({ target }) => {
  target === searchInput.value
    ? (placeholder.value = '')
    : (placeholder.value = 'search')
}

const changeCity = (city) => {
  emit('changeCity', city)
}

const cityHandler = async () => {
  autocomplete.value.addListener('place_changed', async () => {
    const place = await autocomplete.value.getPlace()
    const city = place.name.split(',')[0]
    searchInput.value.value = city
    changeCity(city)
  })
}

const changeCityOnBtn = () => {
  if (!searchInput.value.value) return
  changeCity(searchInput.value.value)
}

onMounted(async () => {
  autocomplete.value = new google.maps.places.Autocomplete(searchInput.value)
  autocomplete.value.setFields(['name'])
  autocomplete.value.setTypes(['(cities)'])
})
</script>
<template>
  <form
    class="search"
    @submit.prevent="cityHandler"
  >
    <input
      ref="searchInput"
      name="search-input"
      type="text"
      :placeholder="placeholder"
      autocomplete="on"
      class="search__input"
      @click="placeholderHandler"
      @input="cityHandler"
    />
    <button
      class="search__btn"
      type="button"
      @click="changeCityOnBtn"
    >
      <img
        :src="search"
        alt="search button"
      />
    </button>
    <Transition>
      <span
        v-show="searchError.error"
        class="search__error"
      >
        {{ searchError.message }}
      </span>
    </Transition>
  </form>
</template>
<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  &__input {
    max-width: 300px;
    width: 100%;
    height: 50px;
    outline-color: #012301;
    outline-width: 0.5px;
    border: 1px solid #012301;
    border-radius: 20px 0px 0px 20px;
    padding: 5px 20px;
  }

  &__btn {
    height: 50px;
    width: 50px;
    border: 1px solid #012301;
    border-radius: 0px 20px 20px 0px;
    border-left: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__error {
    margin-left: 20px;
    color: rgba(255, 0, 0, 0.5);
  }
}
</style>
