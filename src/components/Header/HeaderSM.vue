<script setup>
const links = [
  { id: 'home', name: 'Home' },
  { id: 'favorites', name: 'Favorites' },
]
</script>
<template>
  <header class="header">
    <nav class="header-nav">
      <ul class="header-nav__list">
        <li
          v-for="link in links"
          :key="link.id"
          class="header-nav__line"
        >
          <router-link
            active-class="active-link"
            :to="{ name: link.name, hash: link.hash }"
          >
            <button class="header-nav__link">
              {{ link.name }}
            </button>
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>
<style lang="scss" scoped>
.header-nav {
  &__list {
    height: 50px;
    display: flex;
  }

  &__line {
    & + li {
      margin-left: 20px;
    }
  }

  &__link {
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.daylight0 {
  --clr-bg: #fff;
  --text-main: #000;
}

.moonlight0 {
  --clr-bg: rgba(10, 18, 36, 0.8);
  --text-main: #fff;
}

.active-link {
  .header-nav__link {
    color: var(--text-main);
  }
}
</style>
