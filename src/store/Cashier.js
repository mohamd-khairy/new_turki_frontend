import axios from '@axios'
import { defineStore } from 'pinia'

export const useCashierStore = defineStore('cashier', {
  state: () => ({
    cart: [],
  }),
  actions: {
    async addToCart(item) {
      this.cart.push(item)
    },
    async getAllCategories(params) {
      try {
        const response = await axios.get('/cashier-categories', {
          params,
        })

        return response.data.data
      } catch (error) {
        console.error('Error fetching categories:', error)
        throw error
      }
    },
    async getAllSubCategories({ id, search }) {
      try {
        const response = await axios.get(`/cashier-subcategories/${id}`, {
          params: { search }, 
        })

        return response.data.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    },
    async getAllProducts({ id, search }) {
      try {
        const response = await axios.get(`/cashier-products/${id}`, {
          params: { search }, 
        })

        return response.data.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    },
  },
})
