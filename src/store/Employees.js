import axios from '@axios'
import { defineStore } from 'pinia'

export const useEmployeesStore = defineStore('EmployeesStore', {
  actions: {
    fetchEmployees(params) {
      return axios.get('users', { params })
    },

    fetchCustomers(params) {
      return axios.get('customers', { params })
    },

    // 👉 Fetch Single Country
    fetchEmployee(id) {
      return axios.get(`/users/${id}`)
    },

    // 👉 Store Single Country countries/add-countries
    storeEmployee(data) {
      const formData = new FormData()

      formData.append("username", data.username)
      formData.append("email", data.email)
      formData.append("password", data.password)
      formData.append("avatar", data.avatar)
      formData.append("mobile", data.mobile)
      formData.append("gender", data.gender)
      formData.append("age", data.age)
      formData.append("is_active", data.is_active)
      formData.append("country_code", data.country_code)

      for (let i = 0; i < data.roles.length; i++) {
        formData.append(`roles[${i}]`, data.roles[i])
      }

      return axios.post(`users` , formData)
    },

    storeAddress(data) {
      return axios.post(`customers-address/store` , data)
    },

    storeCustomer(data) {
      const formData = new FormData()

      formData.append("mobile", data.mobile)
      formData.append("name", data.name)
      formData.append("address", data.address)
      // formData.append("mobile_country_code", data.mobile_country_code)
      // formData.append("email", data.email)
      // formData.append("avatar", data.avatar)
      // formData.append("age", data.age)
      // formData.append("gender", data.gender)
      // formData.append("nationality", data.nationality)
      // formData.append("is_active", data.is_active)
      // formData.append("wallet", data.wallet)

      return axios.post(`customers/store` , formData)
    },

    editEmployee(data) {

      const formData = new FormData()

      formData.append("_method", "PUT")
      formData.append("username", data.username)
      formData.append("email", data.email)
      if(data.password != null){
        formData.append("password", data.password)
      }
      if(data.avatar != {}){
        formData.append("avatar", data.avatar)
      }
      formData.append("mobile", data.mobile)
      formData.append("gender", data.gender)
      formData.append("age", data.age)
      formData.append("country_code", data.country_code)
      formData.append("is_active", data.is_active)

      Object.values(data.roles).map((role, index) => {
        formData.append(`roles[${index}]`, role)
      })

      // for (let i = 0; i < data.roles.length; i++) {
      //   formData.append(`roles[${i}]`, data[i].id)
      // }      

      return axios.post(`users/${data.id}`, formData)
    },
    editCustomer(data) {
      const formData = new FormData()

      // formData.append("_method", "PUT")
      // formData.append("username", data.username)
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("mobile", data.mobile)
      formData.append("wallet", data.wallet)

      return axios.post(`customers/${data.id}`, formData)
    },

    deleteEmployee(data) {
      return axios.delete(`users/${data.id}`)
    },
    deleteCustomer(data) {
      return axios.delete(`customers/${data.id}`)
    },
  },
})
