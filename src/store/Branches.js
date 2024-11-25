import axios from '@axios'
import { defineStore } from 'pinia'

export const useBranchesStore = defineStore('BranchesStore', {
  actions: {
    // 👉 Fetch all Countries
    fetchBranches(params) {
      return axios.get('branch', { params })
    },
    fetchActiveBranches(params) {
      return axios.get('active-branches', { params })
    },
    fetchBranch(id) {
      return axios.get(`/branch/${id}`)
    },
    storeBranch(data) {
      return axios.post(`branch` , data)
    },
    editBranch(data) {
      return axios.put(`branch/${data.id}` , data)
    },
    deleteBranch(data) {
      return axios.delete(`branch/${data.id}`)
    },
    changeStatus(id, data) {
      return axios.post(`update-branch-status/${id}` , data)
    },
  },
})
