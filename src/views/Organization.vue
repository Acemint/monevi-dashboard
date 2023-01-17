<template>
  <MainHeader v-bind:role="userAccount.role" v-bind:name="userAccount.fullname" />
  <div class="main-content">
    <OrganizationContent />
  </div>
  <MainFooter />
</template>

<script lang="ts">
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
  import OrganizationContent from '@/components/content/OrganizationContent.vue';
  import MainFooter from '@/components/footer/MainFooter.vue';
  import MainHeader from '@/components/header/MainHeader.vue';

  export default {
    components: {
      OrganizationContent,
      MainHeader,
      MainFooter,
    },

    data: function () {
      return {
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },
  };
</script>
