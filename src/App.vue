<template>
  <router-view></router-view>
</template>
<script lang="ts">
  import 'jquery';
  import 'bootstrap';
  import { moneviAxios } from './api/configuration/monevi-axios';
  import { MoneviCookieHandler } from './api/methods/monevi-cookie-handler';

  export default {
    beforeMount() {
      var token = MoneviCookieHandler.getUserData();
      if (token.accessToken == '' || token.accessToken == undefined) {
        moneviAxios.defaults.headers.common['Authorization'] = null;
      } else {
        moneviAxios.defaults.headers.common['Authorization'] = `${token.type} ${token.accessToken}`;
      }
    },
  };
</script>
