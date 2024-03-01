import axios from '@axios'
import { defineStore } from 'pinia'

export const useCustomersStore = defineStore('CustomersStore', {
  actions: {
    getAll(params) {
      return axios.get('customers', { params })
    },

    getOne(id) {
      return axios.get(`/customers/${id}`)
    },

    getAddresses(customerId) {
      return axios.get(`/customers-address/${customerId}`)
    },

    storeAddress(data) {
      return axios.post(`customers-address/store` , data)
    },

    store(data) {
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
    edit(data) {
      const formData = new FormData()

      // formData.append("_method", "PUT")
      // formData.append("username", data.username)
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("mobile", data.mobile)
      formData.append("wallet", data.wallet)

      return axios.post(`customers/${data.id}`, formData)
    },

    delete(data) {
      return axios.delete(`customers/${data.id}`)
    },
  },
})
