<template>
  <MainHeader v-bind:role="userAccount.role" v-bind:name="userAccount.fullname" />
  <div class="main-content">
    <ProgramDetailsContent v-bind:role="userAccount.role" v-bind:organizationRegionId="userAccount.organizationRegionId" />
  </div>
  <MainFooter />
</template>

<script lang="ts">
  import MainHeader from '@/components/header/MainHeader.vue';
  import ProgramDetailsContent from '@/components/content/ProgramDetailsContent.vue';
  import MainFooter from '@/components/footer/MainFooter.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

  export default {
    components: {
      MainHeader,
      ProgramDetailsContent,
      MainFooter,
    },

    data: function () {
      return {
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },
  };
</script>
