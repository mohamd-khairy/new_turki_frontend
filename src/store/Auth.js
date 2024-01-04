import axios from '@axios';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('AuthStore', {
  state: () => {
    return {
      token: "",
      user: "",
    }
  },
  getters: {
    currentUser: (state) => {
      if(state.user) return state.user;

      // if(localStorage.getItem("najdUser")) {
      //   return JSON.parse(localStorage.getItem("najdUser"));
      // }

      return null
    }
  },
  actions: {
    login(data) {
      return axios.post('login', data)
    },
    updateUser(user) {
      this.user = user;
    }
  },
})
