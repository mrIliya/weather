const getStorage = (key) => {
    return JSON.parse(window.localStorage.getItem(key))
}

const removeStorage = (key) => {
    window.localStorage.removeItem(key)
}

const setStorage = (key, data) => {
    window.localStorage.setItem(key, JSON.stringify(data))
}

export { setStorage, getStorage, removeStorage }