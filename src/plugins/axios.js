import axios from 'axios'

const token = localStorage.getItem("najdToken") || ""

const axiosIns = axios.create({
// You can add your headers here
// ================================
  baseURL: 'http://new-turki-project-api-v2.test/api/v2',

  // baseURL: 'https://almaraacompany.com/dashboard/api/v2', // production api

  // baseURL: 'https://turki.almaraacompany.com/admin/api/v2', // test api
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    Type: `dashboard`,
  },
})

axiosIns.interceptors.response.use(
  response => {

    const token = localStorage.getItem("najdToken") || ""

    axiosIns.defaults.headers.Authorization = `Bearer ${token}`

    return response
  },
  error => {
    if (error.response && error.response.status === 400 && error.response?.message) {

      settingsListStore.alertMessage = error.response.message

      settingsListStore.alertColor = "error"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    }

    if (error.response && error.response.status === 404 && error.response?.data?.errors) {

      const errs = Object.keys(error.response.data.errors)

      errs.forEach(err => {
        settingsListStore.alertMessage = error.response.data.errors[err][0] ?? "error"
      })

      settingsListStore.alertColor = "error"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    }

    if (error.response && error.response.status === 401) {
      // localStorage.removeItem("najdToken")
      // localStorage.removeItem("najdUser")
      // location.reload()

      return Promise.reject('Unauthorized')
    }

    // Handle other errors here
    return Promise.reject(error)
  },
)

export default axiosIns
