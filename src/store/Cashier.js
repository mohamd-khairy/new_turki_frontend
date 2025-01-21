import router from '@/router'
import axios from '@axios'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

export const useCashierStore = defineStore('cashier', {
  state: () => ({
    cart: [],
    usersSales: [],
    paymentTypes: [],
    isClicked: false,
    isCodeSubmitted: false,
    discount: 0,
    order: {},
    order_payments:"",
    orderList: [],
    orderInfo: {
      products: [],
      order: {},
    },
    orderListPaginated: {
      total: 0,
    },
    laterOrders: [],
    selectedOrder: {},
    ref_no: null,
    isLoading: false,
  }),
  actions: {
    async addToCart(item) {
      this.cart.push(item)
    },

    async removeItem(index) {
      this.cart.splice(index, 1)
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
    async editOrder(data) {
      this.isClicked = true

      try {
        const response = await axios.put(`/cashier-edit-order`, {
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
        this.order_payments = response.data.data.paid_payment_types

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
        this.orderListPaginated['total'] = response.data.data.last_page

        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async userSalesList(params) {
      try {
        this.isLoading = true

        const response = await axios.get(`/cashier-user-sales-details` , { params })

        this.usersSales = response.data.data
        this.paymentTypes = response.data.payment_types

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
        this.discount = response.data.data

        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)

        return error
      }
    },

    async changeOrderStatus(data) {

      try {
        const response = await axios.put(`/cashier-order-update/${data.id}`, {
          ...data,
        })


        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)

        return error
      }
    },

    async scanCode(code) {
      const numberStr = String(code)
      const product_id = numberStr.slice(0, 6)
      const part1 = numberStr.slice(6, 8)
      const part2 = numberStr.slice(8)
      const product_quantity = `${part1}.${part2}`

      try {
        const response = await axios.get(`/cashier-product-code/${product_id}`)

        const item = {
          quantity: product_quantity,
          price: response.data.data.sale_price,
          product_id: response.data.data.id,
          name: response.data.data.name_ar,
          total_price: product_quantity * response.data.data.sale_price, // Calculate total price
        }


        this.addToCart(item)

        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)

        return error
      }
    },

    async refundOrder(ref_no,data) {

      try {
        const response = await axios.post(`/cashier-refund-order/${ref_no}`,{
          ids: data,
        })

        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)

        return error
      }
    },

    async print(data) {

      try {
        const response = await axios.post(`/print`,{
          data: data,
        })

        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)

        return error
      }
    },
    async getLaterOrders() {
      try {
        const response = await axios.get(`/cashier-later-orders`)

        this.laterOrders = response.data.data

        return response.data.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    },

    async openOrderForEdit(data) {
      try {
        const response = await axios.get(`/cashier-order-details/${data}`)

        this.selectedOrder = response.data.data

        return response.data.data

      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    },

    openOrder (ref_no){
      this.isLoading = true
      this.ref_no = ref_no

      this.addQueryString('ref_no' , this.ref_no , '/cashier/categories')

      this.openOrderForEdit(this.ref_no).then(res => {
        if (res.order) {
          this.order = res.order
          this.cart = []
          let products = res.products
          for (let index = 0; index < products.length; index++) {
            const element = products[index]

            let new_item = {
              cut_id: element.cut?.id,
              size_id: element.size?.id,
              preparation_id: element.preparation?.id,
              price: element.size?.sale_price,
              total_price: parseFloat(element.size?.sale_price * element.quantity),
              product_id: element.product_id,
              name: element.product?.name_ar,
              quantity: element.quantity,
              is_Ras: element.is_Ras ? 1 : 0,
              is_lyh: element.is_lyh ? 1 : 0,
              is_kwar3: element.is_kwar3 ? 1 : 0,
              is_karashah: element.is_karashah ? 1 : 0,
              shalwata: element.shalwata ? 1 : 0,
            }

            this.cart.push(new_item)
            this.isLoading = false
          }
        }
      })
    },
    resetClient () {
      this.ref_no = null
      this.selectedOrder = null
      this.order = null
      this.cart = []
    },
    addQueryString (key, value , path) {
      router.push({
        path,
        query: { ...useRoute.query, [key]: value }, // Add or update the query parameter
      })
    },
  },
})
