export const setItem = (key, data) => {
    try {
        localStorage.setItem(key, data)
    } catch (error) {
        console.log(`Error data: ${error}`)
    }
}

export const getItem = (key) => {
    try {
        return localStorage.getItem(key)
    } catch (error) {
        console.log(`Error getItem: ${error}`)
    }
}


export const removeItem = (key) => {
    try {
        localStorage.removeItem(key)
    } catch (error) {
        console.log(`Error removeing token`)
    }
}