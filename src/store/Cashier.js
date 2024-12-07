import axios from '@axios'
import { defineStore } from 'pinia'

export const useCashierStore = defineStore('cashier', {
  state: () => ({
    cart: [],
    isClicked: false,
    isCodeSubmitted: false,
    discount: 0,
    order: {},
    orderList: [],
    orderInfo: {
      products: [],
      order: {},
    },
    orderListPaginated: {
      total: 0,
    },
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
    async searchProducts({ search }) {
      try {
        const response = await axios.get(`/cashier-products`, {
          params: { search }, 
        })

        return response.data.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    },

    async getAllPaymentTypes() {
      try {
        const response = await axios.get(`cashier-payment-types`)
        
        return response.data.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      } 

    },

    async createOrder(data) {
      this.isClicked = true

      try {
        const response = await axios.post(`/cashier-create-order`, {
          ...data,
        })

        this.order = response.data.data
        
        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)
        
        return error
      } finally {
        this.isClicked = false
      }
    },
    async storePayment(data) {
      this.isClicked = true

      try {
        const response = await axios.post(`/cashier-store-payment`, {
          ...data,
        })

        this.cart = []
        this.order = {}
        
        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)
        
        return error
      } finally {
        this.isClicked = false
      }
    },
    async orderDetails(data) {
      try {
        const response = await axios.get(`/cashier-order-details/${data}`)

        this.orderInfo = response.data.data
        
        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    },
    async cancelOrder(data) {
      try {
        const response = await axios.delete(`/cashier-delete-order/${data}`)

        this.order = {}
        
        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    },
    async ordersList(params) {
      try {
        this.isLoading = true

        const response = await axios.get(`/cashier-orders`, { params })

        this.orderList = response.data.data.data
        console.log(this.orderList)
        this.orderListPaginated['total'] = response.data.data.last_page
        
        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async userSalesList() {
      try {
        this.isLoading = true

        const response = await axios.get(`/cashier-user-sales-details`)


        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async hasCoupon(data) {
      
      try {
        const response = await axios.post(`/cashier-discount-code-details`,{
          ...data,
        })

        this.isCodeSubmitted = true
        this.discount = response.data
        
        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)
        
        return error
      }
    },
  },
})
