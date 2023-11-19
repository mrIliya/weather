# weather

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
<!-- API Docs -->
### Autocomplete
### For Google Autocomplete we using (https://developers.google.com/maps/documentation/javascript/place-autocomplete), which we connect in HTML using the script tag, is used exclusively in the search component.

### User IP
### To get user IP we using (https://www.ipify.org/) method getUserIP from (./src/api/userIP.js), 
### Data from getUserIP we pass in getUserLocation method from (./src/api/userIP.js), more info (https://geo.ipify.org/docs)
### Both methods calls each time component WeatherCard mounted except when it mounted in FavoritesView, data from getUserLocation we pass in mainWeather variable.

### Weather data (https://openweathermap.org/api)
### Most common method - getCityWeather  from (./src/api/weather.js), we call it in WeatherCard from start and also when we change city using search, it requires city name, we pass name from search or from FavoritesView using props.Value from it we pass in mainWeather variable.

### To get hourly weather for one day we using getData method from (./src/api/weather.js), we using it for Charts, it requires city coords from mainWeather variable.

### To get five days forecast we using getFiveDays method from (./src/api/weather.js), we using it only when user press "5 days" button.It requires city coords from mainWeather variable.

### Some methods reqires keys from .env file

