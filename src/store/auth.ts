import { defineStore } from "pinia";
import { login, logout } from "@/api/auth";
import router from "@/router";  // Adjust import path as needed

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as null | { name: string; email: string },
    token: localStorage.getItem("token") || null,
  }),
  
  actions: {
    async loginUser(email: string, password: string) {
      const data = await login(email, password);
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem("token", data.token);
    },
    
    async logoutUser() {
      try {
        // Only attempt to call logout API if token exists
        if (this.token) {
          await logout();
        }
        
        // Clear store state
        this.token = null;
        this.user = null;
        
        // Remove token from localStorage
        localStorage.removeItem("token");
        
        // Redirect to login page
        router.push('/login');
      } catch (error) {
        console.error('Logout failed', error);
        
        // Even if logout fails, clear local state
        this.token = null;
        this.user = null;
        localStorage.removeItem("token");
        
        // Redirect to login page
        router.push('/login');
      }
    },
  },
});