import axios from 'axios'

const token = localStorage.getItem("najdToken") || ""

const axiosIns = axios.create({
// You can add your headers here
// ================================
  baseURL: 'https://najdiya.com.sa/laravel/public/api/api/v2',
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
