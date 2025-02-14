import axios from '@axios'
import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('NotificationsStore', {
  actions: {

    updateNotifications(data) {
      return axios.post(`update-notifications`, data)
    },

    pushNotifications(data) {
      return axios.post(`direct-notifications`, data)
    },

    getAll(params) {
      return axios.get('notifications', { params })
    },
    getOne(params) {
      return axios.get(`notification`, { params })
    },
    delete(data) {
      return axios.delete(`notification/${data.id}`)
    },



    update(data) {
      return axios.put(`notification/${data.id}`, data)
    },


  },
})
