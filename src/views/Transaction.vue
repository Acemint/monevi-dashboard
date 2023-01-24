<template>
  <MainHeader v-bind:role="userAccount.role" v-bind:name="userAccount.fullname" />
  <div class="main-content">
    <TransactionTreasurerContent v-if="userAccount.role === 'ROLE_TREASURER'" />
    <TransactionChairmanContent v-else-if="userAccount.role === 'ROLE_CHAIRMAN'" />
    <TransactionSupervisorContent v-else />
  </div>
  <MainFooter />
</template>

<script lang="ts">
  import MainHeader from '@/components/header/MainHeader.vue';
  import MainFooter from '@/components/footer/MainFooter.vue';
  import TransactionTreasurerContent from '@/components/content/transaction/TransactionTreasurerContent.vue';
  import TransactionChairmanContent from '@/components/content/transaction/TransactionChairmanContent.vue';
  import TransactionSupervisorContent from '@/components/content/transaction/TransactionSupervisorContent.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

  export default {
    components: {
      MainHeader,
      TransactionTreasurerContent,
      TransactionSupervisorContent,
      TransactionChairmanContent,
      MainFooter,
    },

    data: function () {
      return {
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },
  };
</script>
