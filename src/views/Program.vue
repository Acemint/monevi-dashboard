<template>
  <MainHeader
      v-bind:role="role"
      v-bind:name="name" />
      
  <MainFooter />
</template>

<script lang="ts">
import MainHeader from '@/components/header/MainHeader.vue'
import MainFooter from '@/components/footer/MainFooter.vue';
import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

export default {
  components: {
      MainHeader,
      MainFooter,
  },

  methods: {
      getUserData(): void {
          this.name = MoneviCookieHandler.getCookie("username");
          this.role = MoneviCookieHandler.getCookie("role");
      }
  },

  data: function() {
      return {
          name: "",
          role: "",
      }
  },

  mounted: function() {
      this.getUserData();
  }
}
</script>