<template>
  <MainHeader v-bind:role="userAccount.role" v-bind:name="userAccount.fullname" />
  <div class="main-content">
    <ReportDetailsContent v-bind:organizationRegionId="userAccount.organizationRegionId" />
  </div>
  <MainFooter />
</template>

<script lang="ts">
  import MainHeader from '@/components/header/MainHeader.vue';
  import MainFooter from '@/components/footer/MainFooter.vue';
  import ReportDetailsContent from '@/components/content/ReportDetailsContent.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

  export default {
    components: {
      MainHeader,
      MainFooter,
      ReportDetailsContent,
    },

    data: function () {
      return {
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },
  };
</script>
