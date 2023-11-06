import { defineStore } from 'pinia'
import axios from '@axios'

export const useEmployeesStore = defineStore('EmployeesStore', {
  actions: {
    // 👉 Fetch all Countries
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
      for (let i = 0; i < data.roles.length; i++) {
        formData.append(`roles[${i}]`, data.roles[i])
      }

      return axios.post(`users` , formData)
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
      for (let i = 0; i < data.roles.length; i++) {
        formData.append(`roles[${i}]`, data.roles[i].id)
      }

      return axios.post(`users/${data.id}`, formData)
    },

    deleteEmployee(data) {
      return axios.delete(`users/${data.id}`)
    },
  },
})