import { defineStore } from 'pinia'
import axios from '@axios'

export const useProductsStore = defineStore('ProductsStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchProducts(params) {
      return axios.get('products', { params })
    },

    // 👉 Fetch single banner
    storeProduct(data) {
      const formData = new FormData()
      let cty_ids = " "
      Object.values(data.city_ids).map(ctid => {
        cty_ids = cty_ids + ',' + ctid
      })

      let prep_ids = " "
      Object.values(data.preparation_ids).map(prpid => {
        prep_ids = prep_ids + ',' + prpid
      })

      let size_ids = " "
      Object.values(data.size_ids).map(prpid => {
        size_ids = size_ids + ',' + prpid
      })

      let cut_ids = " "
      Object.values(data.cut_ids).map(prpid => {
        cut_ids = cut_ids + ',' + prpid
      })

      let payment_ids = " "
      Object.values(data.payment_type_ids).map(prpid => {
        payment_ids = payment_ids + ',' + prpid
      })

      formData.append("name_ar", data.name_ar)
      formData.append("name_en", data.name_en)
      formData.append("weight", data.weight)
      formData.append("calories", data.calories)
      formData.append("description_ar", data.description_ar)
      formData.append("description_en", data.description_en)
      formData.append("sale_price", data.sale_price)
      formData.append("price", data.price)
      formData.append("is_active", data.is_active === true ? 1 : 0)
      formData.append("is_available", data.is_available === true ? 1 : 0)
      formData.append("is_kwar3", data.is_kwar3 === true ? 1 : 0)
      formData.append("is_Ras", data.is_Ras === true ? 1 : 0)
      formData.append("is_lyh", data.is_lyh === true ? 1 : 0)
      formData.append("is_karashah", data.is_karashah === true ? 1 : 0)
      formData.append("category_id", data.category_id)
      formData.append("sub_category_id", data.sub_category_id)
      formData.append("is_shalwata", data.is_shalwata === true ? 1 : 0)
      formData.append("is_delivered", data.is_delivered === true ? 1 : 0)
      formData.append("is_picked_up", data.is_picked_up === true ? 1 : 0)
      formData.append("preparation_ids", prep_ids.split(" ,")[1])
      formData.append("size_ids", size_ids.split(" ,")[1])
      formData.append("cut_ids", cut_ids.split(" ,")[1])
      formData.append("payment_type_ids", payment_ids.split(" ,")[1])
      formData.append("city_ids", cty_ids.split(" ,")[1])

      return axios.post(`products/add-products`, formData)
    },

    editProduct(data) {
      const formData = new FormData()
      let cty_ids = " "
      Object.values(data.city_ids).map(ctid => {
        if(typeof ctid == 'object') {
          cty_ids = cty_ids + ',' + ctid.id
        }
        else {
          cty_ids = cty_ids + ',' + ctid
        }
      })

      let prep_ids = " "
      Object.values(data.preparation_ids).map(prpid => {
        if(typeof prpid == 'object') {
          prep_ids = prep_ids + ',' + prpid.id
        }
        else {
          prep_ids = prep_ids + ',' + prpid
        }
        // prep_ids = prep_ids + ',' + prpid
      })

      let size_ids = " "
      Object.values(data.size_ids).map(prpid => {
        // size_ids = size_ids + ',' + prpid
        if(typeof prpid == 'object') {
          size_ids = size_ids + ',' + prpid.id
        }
        else {
          size_ids = size_ids + ',' + prpid
        }
      })

      let cut_ids = " "
      Object.values(data.cut_ids).map(prpid => {
        // cut_ids = cut_ids + ',' + prpid
        if(typeof prpid == 'object') {
          cut_ids = cut_ids + ',' + prpid.id
        }
        else {
          cut_ids = cut_ids + ',' + prpid
        }
      })

      let payment_ids = " "
      Object.values(data.payment_type_ids).map(prpid => {
        if(typeof prpid == 'object') {
          payment_ids = payment_ids + ',' + prpid.id
        }
        else {
          payment_ids = payment_ids + ',' + prpid
        }
        // payment_ids = payment_ids + ',' + prpid.id
      })

      formData.append("name_ar", data.name_ar)
      formData.append("name_en", data.name_en)
      formData.append("weight", data.weight)
      formData.append("calories", data.calories)
      formData.append("description_ar", data.description_ar)
      formData.append("description_en", data.description_en)
      formData.append("sale_price", data.sale_price)
      formData.append("price", data.price)
      formData.append("is_active", data.is_active === true ? 1 : 0)
      formData.append("is_available", data.is_available === true ? 1 : 0)
      formData.append("is_kwar3", data.is_kwar3 === true ? 1 : 0)
      formData.append("is_Ras", data.is_Ras === true ? 1 : 0)
      formData.append("is_lyh", data.is_lyh === true ? 1 : 0)
      formData.append("is_karashah", data.is_karashah === true ? 1 : 0)
      formData.append("category_id", data.category_id.id)
      formData.append("sub_category_id", data.sub_category_id.id)
      formData.append("is_shalwata", data.is_shalwata === true ? 1 : 0)
      formData.append("is_delivered", data.is_delivered === true ? 1 : 0)
      formData.append("is_picked_up", data.is_picked_up === true ? 1 : 0)
      formData.append("preparation_ids", prep_ids.split(" ,")[1])
      formData.append("size_ids", size_ids.split(" ,")[1])
      formData.append("cut_ids", cut_ids.split(" ,")[1])
      formData.append("payment_type_ids", payment_ids.split(" ,")[1])
      formData.append("city_ids", cty_ids.split(" ,")[1])

      return axios.post(`products/update-products/${data.id}`, formData)
    },

    deleteProduct(data) {
      return axios.delete(`products/delete-product/${data.id}`)
    },
  },
})
