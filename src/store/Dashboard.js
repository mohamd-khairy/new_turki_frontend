import axios from '@axios'
import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('DashboardStore', {
  actions: {
    // 👉 Fetch all Countries
    fetchDashboard(params) {
      return axios.get('dashboard', { params })
    },
    fetchCartsDashboard(params) {
      return axios.get('cart-chart', { params })
    },
    fetchProfitsDashboard(params){
      return axios.get('profit-chart', { params })
    },
    fetchProductsDashboard(params){
      return axios.get('product-chart', { params })
    },
    fetchCustomersDashboard(params){
      return axios.get('customer-chart', { params })
    },
  },
})
