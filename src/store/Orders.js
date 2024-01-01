import axios from '@axios'
import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('OrdersStore', {
  actions: {
    // 👉 Fetch all Invoices
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
      let order = {
        customer_id: data.customer_id,
        country_id: data.country_id,
        city_id: data.city_id,
        delivery_date: data.delivery_date,
        delivery_period_id: data.delivery_period_id,
        using_wallet: data.using_wallet,
        address_id: data.address_id,
        discount_code: data.discount_code,
        notes: data.notes,
        products: data.products,
      }

      // data.products.map((pd, ind) => {
      //   order[`products[${ind}][product_id]`] = pd.product_id
      //   order[`products[${ind}][quantity]`] = pd.quantity
      //   order[`products[${ind}][cut_id]`] = pd.cut_id
      //   order[`products[${ind}][size_id]`] = pd.size_id
      //   order[`products[${ind}][preparation_id]`] = pd.preparation_id
      // })

      // const formData = new FormData()
      //
      // formData.append('customer_id', data.customer_id)
      // formData.append('country_id', data.country_id)
      // formData.append('city_id', data.city_id)
      // formData.append('delivery_date', data.delivery_date)
      // formData.append('delivery_period_id', data.delivery_period_id)
      // formData.append('using_wallet', data.using_wallet)
      // formData.append('address_id', data.address_id)
      // formData.append('discount_code', data.discount_code)

      return axios.post(`orders/create-order`, order)
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
  },
})
