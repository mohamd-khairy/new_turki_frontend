import axios from '@axios'
import { defineStore } from 'pinia'

export const useWelcomeStore = defineStore('WelcomeStore', {
  actions: {
    fetchWelcomes(params) {
      return axios.get('welcome', { params })
    },
    fetchWelcome(id) {
      return axios.get(`/welcome/${id}`)
    },
    updateWelcomeStatus(id, data) {
      return axios.post(`update-welcome-status/${id}` , data)
    },
    storeWelcome(data) {
      return axios.post(`welcome` , data)
    },
    editWelcome(data) {
      return axios.put(`welcome/${data.id}` , data)
    },
    deleteWelcome(data) {
      return axios.delete(`welcome/${data.id}`)
    },
  },
})
