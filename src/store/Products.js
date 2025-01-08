import axios from '@axios'
import { defineStore } from 'pinia'

export const useProductsStore = defineStore('ProductsStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchProducts(params) {
      return axios.get('products', { params })
    },
    fetchProductsAll(params) {
      return axios.get('products/all', { params })
    },
    fetchProduct(id) {
      return axios.get(`products/${id}`)
    },
    fetchSizes(params) {
      return axios.get(`product-sizes`, { params })
    },

    addNewProduct(data){
      return axios.post(`orders/add-order-product`, data)
    },

    // 👉 Fetch single banner
    storeProduct(data) {
      const formData = new FormData()
      let cty_ids = " "
      if (data.city_ids.length > 0) {
        Object.values(data.city_ids).map(ctid => {
          if (typeof ctid == "object") {
            cty_ids = cty_ids.length == 0 ? `${ctid.id}` : cty_ids + ',' + ctid.id
          } else {
            cty_ids = cty_ids.length == 0 ? `${ctid}` : cty_ids + ',' + ctid
          }
        })
      } else {
        cty_ids = ""
      }

      let prep_ids = " "
      if (data.preparation_ids.length > 0) {
        Object.values(data.preparation_ids).map(prpid => {
          if (typeof prpid == "object") {
            prep_ids = prep_ids.length == 0 ? `${prpid.id}` : prep_ids + ',' + prpid.id
          } else {
            prep_ids = prep_ids.length == 0 ? `${prpid}` : prep_ids + ',' + prpid
          }
        })
      } else {
        prep_ids = ""
      }

      let size_ids = " "
      if (data.size_ids.length > 0) {
        Object.values(data.size_ids).map(prpid => {
          if (typeof prpid == "object") {
            size_ids = size_ids.length == 0 ? `${prpid.id}` : size_ids + ',' + prpid.id
          } else {
            size_ids = size_ids.length == 0 ? `${prpid}` : size_ids + ',' + prpid
          }
        })
      } else {
        size_ids = ""
      }

      let cut_ids = " "
      if (data.cut_ids.length > 0) {
        Object.values(data.cut_ids).map(prpid => {
          // cut_ids = cut_ids + ',' + prpid
          if (typeof prpid == "object") {
            cut_ids = cut_ids.length == 0 ? `${prpid.id}` : cut_ids + ',' + prpid.id
          } else {
            cut_ids = cut_ids.length == 0 ? `${prpid}` : cut_ids + ',' + prpid
          }
        })
      } else {
        cut_ids = ""
      }

      let payment_ids = " "
      if (data.payment_type_ids.length > 0) {
        Object.values(data.payment_type_ids).map(prpid => {
          // payment_ids = payment_ids + ',' + prpid
          if (typeof prpid == "object") {
            payment_ids = payment_ids.length == 0 ? `${prpid.id}` : payment_ids + ',' + prpid.id
          } else {
            payment_ids = payment_ids.length == 0 ? `${prpid}` : payment_ids + ',' + prpid
          }
        })
      } else {
        payment_ids = ""
      }

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
      formData.append("preparation_ids", prep_ids.split(" ,")[1] ?? "")
      formData.append("size_ids", size_ids.split(" ,")[1] ?? "")
      formData.append("cut_ids", cut_ids.split(" ,")[1] ?? "")
      formData.append("payment_type_ids", payment_ids.split(" ,")[1] ?? "")
      formData.append("city_ids", cty_ids.split(" ,")[1] ?? "")

      if(data.shalwata_id){
        formData.append("shalwata_id", data.shalwata_id ?? null)
      }

      for (let i = 0; i < data.images.length; i++) {
        formData.append(`images[${i}]`, data.images[i])
      }

      return axios.post(`products/add-products`, formData)
    },

    editProduct(data) {
      const formData = new FormData()

      let cty_ids = " "
      Object.values(data.city_ids).map(ctid => {
        if (typeof ctid == "object") {
          cty_ids = cty_ids.length == 0 ? `${ctid.id}` : cty_ids + ',' + ctid.id
        } else {
          cty_ids = cty_ids.length == 0 ? `${ctid}` : cty_ids + ',' + ctid
        }
      })

      let prep_ids = " "
      Object.values(data.preparation_ids).map(prpid => {
        if (typeof prpid == "object") {
          prep_ids = prep_ids.length == 0 ? `${prpid.id}` : prep_ids + ',' + prpid.id
        } else {
          prep_ids = prep_ids.length == 0 ? `${prpid}` : prep_ids + ',' + prpid
        }
      })

      let size_ids = " "
      Object.values(data.size_ids).map(prpid => {
        if (typeof prpid == "object") {
          size_ids = size_ids.length == 0 ? `${prpid.id}` : size_ids + ',' + prpid.id
        } else {
          size_ids = size_ids.length == 0 ? `${prpid}` : size_ids + ',' + prpid
        }
      })

      let cut_ids = " "
      Object.values(data.cut_ids).map(prpid => {
        // cut_ids = cut_ids + ',' + prpid
        if (typeof prpid == "object") {
          cut_ids = cut_ids.length == 0 ? `${prpid.id}` : cut_ids + ',' + prpid.id
        } else {
          cut_ids = cut_ids.length == 0 ? `${prpid}` : cut_ids + ',' + prpid
        }
      })

      let payment_ids = " "
      Object.values(data.payment_type_ids).map(prpid => {
        // payment_ids = payment_ids + ',' + prpid
        if (typeof prpid == "object") {
          payment_ids = payment_ids.length == 0 ? `${prpid.id}` : payment_ids + ',' + prpid.id
        } else {
          payment_ids = payment_ids.length == 0 ? `${prpid}` : payment_ids + ',' + prpid
        }
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
      formData.append("category_id", typeof data.category_id == 'object' ? data.category_id.id : data.category_id)
      formData.append("sub_category_id", typeof data.sub_category_id == 'object' ? data.sub_category_id.id : data.sub_category_id)
      formData.append("is_shalwata", data.is_shalwata === true ? 1 : 0)
      formData.append("is_delivered", data.is_delivered === true ? 1 : 0)
      formData.append("is_picked_up", data.is_picked_up === true ? 1 : 0)
      formData.append("preparation_ids", prep_ids.split(" ,")[1] ?? "")
      formData.append("size_ids", size_ids.split(" ,")[1] ?? "")
      formData.append("cut_ids", cut_ids.split(" ,")[1] ?? "")
      formData.append("payment_type_ids", payment_ids.split(" ,")[1] ?? "")
      formData.append("city_ids", cty_ids.split(" ,")[1] ?? "")

      if(data.shalwata_id){
        formData.append("shalwata_id", data.shalwata_id ?? null)
      }
      if(data.images !== []) {
        data.images.map((img, ind) => {
          formData.append(`images[${ind}]`, img)
        })
      }

      return axios.post(`products/update-products/${data.id}`, formData)
    },

    deleteProduct(data) {
      return axios.delete(`products/delete-product/${data.id}`)
    },
  },
})
