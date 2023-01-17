<template>
  <MainHeader v-bind:role="userAccount.role" v-bind:name="userAccount.fullname" />
  <div class="main-content">
    <TransactionContent v-bind:organizationRegionId="userAccount.organizationRegionId" v-bind:role="userAccount.role" />
  </div>
  <MainFooter />
</template>

<script lang="ts">
  import MainHeader from '@/components/header/MainHeader.vue';
  import MainFooter from '@/components/footer/MainFooter.vue';
  import TransactionContent from '@/components/content/TransactionContent.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

  export default {
    components: {
      MainHeader,
      TransactionContent,
      MainFooter,
    },

    data: function () {
      return {
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },
  };
</script>
