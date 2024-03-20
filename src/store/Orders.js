import axios from '@axios'
import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('OrdersStore', {
  actions: {
    // 👉 Fetch all Invoices
    
    exportOrderProducts(params) {
      return axios.get('orders/export-order-products', { params })
    },
    fetchOrders(params) {
      return axios.get('orders/get-order', { params })
    },
    fetchOrderStatus() {
      return axios.get('order-status')
    },
    fetchAllOrderStatus() {
      return axios.get('all-order-status')
    },

    // 👉 Fetch single banner
    storeOrder(data) {
      return axios.post(`orders/create-order`, data)
    },
    fetchOrder(refrence_id) {
      return axios.get(`/orders/get-one-order/${refrence_id}`)
    },
    removeDiscount(refrence_id){
      return axios.get(`/orders/remove-discount/${refrence_id}`)
    },
    editOrder(data) {
      return axios.post(`/orders/edit-order`, data)
    },
    editOrderProduct(data) {
      return axios.post(`/orders/edit-order-product`, data)
    },
    deleteOrderProduct(data) {
      return axios.post(`orders/delete-order-product`, data)
    },
    assignOrderDeligation(data) {
      return axios.post(`orders/assign-user-order`, data)
    },
    takeOrder(orderId) {
      return axios.get(`orders/take-order/${orderId}`)
    },
  },
})
