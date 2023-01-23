<template>
  <MainHeader v-bind:role="userAccount.role" v-bind:name="userAccount.fullname" />
  <div class="main-content">
    <TransactionStudentContent v-if="userAccount.role === 'ROLE_TREASURER' || userAccount.role === 'ROLE_CHAIRMAN'" />
    <TransactionSupervisorContent v-else />
  </div>
  <MainFooter />
</template>

<script lang="ts">
  import MainHeader from '@/components/header/MainHeader.vue';
  import MainFooter from '@/components/footer/MainFooter.vue';
  import TransactionStudentContent from '@/components/content/transaction/TransactionStudentContent.vue';
  import TransactionSupervisorContent from '@/components/content/transaction/TransactionSupervisorContent.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

  export default {
    components: {
      MainHeader,
      TransactionSupervisorContent,
      TransactionStudentContent,
      MainFooter,
    },

    data: function () {
      return {
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },
  };
</script>
