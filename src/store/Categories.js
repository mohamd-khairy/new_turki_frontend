import axios from '@axios'
import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('CategoriesStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchCategories(params) {
      return axios.get('categories', { params })
    },
    fetchSubCategories(params) {
      return axios.get('sub-categories', { params })
    },

    // 👉 Fetch single banner
    fetchCategory(id) {
      return axios.get(`/categories/${id}`)
    },
    fetchSubCategory(id) {
      return axios.get(`/sub-categories/${id}`)
    },
    fetchSubCategoryByCategory(id) {
      return axios.get(`/sub-categories/by-category-id/${id}`)
    },

    storeCategory(data) {
      const formData = new FormData()
      let cty_ids = " "
      Object.values(data.city_ids).map(ctid => {
        cty_ids = cty_ids + ',' + ctid
      })

      formData.append("type_ar", data.type_ar)
      formData.append("type_en", data.type_en)
      formData.append("description", data.description)
      formData.append("backgroundColor", data.backgroundColor)
      formData.append("color", data.color)
      formData.append("city_ids", cty_ids.split(" ,")[1])
      formData.append("image", data.image[0])

      return axios.post(`/categories/add-category`, formData)
    },
    storeSubCategory(data) {
      const formData = new FormData()

      let cty_ids = " "
      Object.values(data.city_ids).map(ctid => {
        cty_ids = cty_ids + ',' + ctid
      })

      formData.append("type_ar", data.type_ar)
      formData.append("type_en", data.type_en)
      formData.append("description", data.description)
      formData.append("category_id", data.category_id)
      formData.append("city_ids", cty_ids.split(" ,")[1])
      if (data.image !== {} && data.image !== undefined) {
        formData.append("image", data.image[0] ?? {})
      }

      return axios.post(`/sub-categories/add-sub-category`, formData)
    },
    editSubCategory(data) {
      const formData = new FormData()


      let cty_ids = " "
      Object.values(data.city_ids).map(ctid => {
        // cty_ids = cty_ids + ',' + ctid.id
        if (typeof ctid == "object") {
          cty_ids = cty_ids.length == 0 ? `${ctid.id}` : cty_ids + ',' + ctid.id
        } else {
          cty_ids = cty_ids.length == 0 ? `${ctid}` : cty_ids + ',' + ctid
        }
      })

      formData.append("type_ar", data.type_ar)
      formData.append("type_en", data.type_en)
      formData.append("description", data.description)
      formData.append("category_id", data.category_id)
      formData.append("city_ids", cty_ids.split(" ,")[1])
      if (data.image !== {} && data.image !== undefined) {
        formData.append("image", data.image[0] ?? {})
      }

      return axios.post(`/sub-categories/update-sub-category/${data.id}`, formData)
    },

    editCategory(data) {
      const formData = new FormData()
      let cty_ids = " "
      Object.values(data.city_ids).map(ctid => {
        if (typeof ctid == "object") {
          cty_ids = cty_ids.length == 0 ? `${ctid.id}` : cty_ids + ',' + ctid.id
        } else {
          cty_ids = cty_ids.length == 0 ? `${ctid}` : cty_ids + ',' + ctid
        }
      })

      formData.append("type_ar", data.type_ar)
      formData.append("type_en", data.type_en)
      formData.append("description", data.description)
      formData.append("backgroundColor", data.backgroundColor)
      formData.append("color", data.color)
      formData.append("city_ids", cty_ids.split(" ,")[1])
      if (data.image !== {} && data.image !== undefined) {
        formData.append("image", data.image[0] ?? {})
      }

      return axios.post(`/categories/update-category/${data.id}`, formData)
    },

    deleteCategory(data) {
      return axios.delete(`/categories/delete-category/${data.id}`)
    },
    deleteSubCategory(data) {
      return axios.delete(`/sub-categories/delete-sub-category/${data.id}`)
    },
  },
})
