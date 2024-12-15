import axios from '@axios'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('SettingsStore', {
  state: () => {
    return {
      isAlertShow: false,
      alertColor: "",
      alertMessage: "",
    }
  },
  actions: {
    fetchProductTags(params) {
      return axios.get('tags', { params })
    },
    fetchDelivery_Periods(params) {
      return axios.get('delivery-period', { params })
    },
    fetchNotDelivery_Periods(params) {
      return axios.get('not-delivery-date', { params })
    },
    fetchPaymentTypes(params) {
      return axios.get('payment-types', { params })
    },
    fetchProductShalwata(params) {
      return axios.get('product-shlwatas', { params })
    },
    fetchProductPerparation(params) {
      return axios.get('Product-preparations', { params })
    },
    fetchProductSize(params) {
      return axios.get('product-sizes', { params })
    },
    fetchProductCut(params) {
      return axios.get('product-cuts', { params })
    },
    fetchProductPerparationByID(id) {
      return axios.get(`Product-preparations/${id}`)
    },
    fetchProductSizeByID(id) {
      return axios.get(`product-sizes/${id}`)
    },
    fetchProductCutByID(id) {
      return axios.get(`product-cuts/${id}`)
    },

    storeProductTags(data) {
      return axios.post(`tags`, data)
    },
    storeDeliveryTime(data) {
      return axios.post(`delivery-period/add-period`, data)
    },
    storeNotDeliveryDate(data) {
      return axios.post(`not-delivery-date`, data)
    },
    storeProductCut(data) {
      return axios.post(`product-cuts/add-cut`, data)
    },
    storePaymentType(data) {
      return axios.post(`payment-types/add-payment-type`, data)
    },
    storeProductShalwata(data) {
      return axios.post(`product-shlwatas/add-product-shlwatas`, data)
    },
    storeProductPerparation(data) {
      return axios.post(`Product-preparations/add-preparations`, data)
    },
    storeProductSize(data) {
      return axios.post(`product-sizes/add-size`, data)
    },

    editProductTags(data) {
      return axios.put(`tags/${data.id}`, data)
    },
    editNotDeliveryDate(data) {
      return axios.put(`not-delivery-date/${data.id}`, data)
    },
    editDeliveryTime(data) {
      return axios.post(`delivery-period/update-period`, data)
    },
    editProductCut(data) {
      return axios.post(`product-cuts/update-cut/${data.id}`, data)
    },
    editPaymentType(data) {
      return axios.post(`payment-types/update-payment-type/${data.id}`, data)
    },
    editProductShalwata(data) {
      return axios.post(`product-shlwatas/update-product-shlwatas/${data.id}`, data)
    },
    editProductPerparation(data) {
      return axios.post(`Product-preparations/update-preparations/${data.id}`, data)
    },
    editProductSize(data) {
      return axios.post(`product-sizes/update-size/${data.id}`, data)
    },

    deleteProductTags(data) {
      return axios.delete(`tags/${data.id}`, data)
    },
    deleteDeliveryTime(data) {
      return axios.post(`delivery-period/delete/${data.id}`)
    },
    deleteNotDeliveryDate(data) {
      return axios.delete(`not-delivery-date/${data.id}`)
    },
    deleteProductCut(data) {
      return axios.post(`product-cuts/delete-productCut/${data.id}`, data)
    },
    deletePaymentType(data) {
      return axios.post(`payment-types/delete-payment-type/${data.id}`)
    },
    deleteProductShalwata(data) {
      return axios.post(`product-shlwatas/delete-product-shlwatas/${data.id}`, data)
    },
    deleteProductPerparation(data) {
      return axios.post(`Product-preparations/delete-preparations/${data.id}`, data)
    },
    deleteProductSize(data) {
      return axios.post(`product-sizes/delete-size/${data.id}`)
    },
    fetchStockLogs(params) {
      return axios.get('stock-logs', { params })
    },
  },
})
