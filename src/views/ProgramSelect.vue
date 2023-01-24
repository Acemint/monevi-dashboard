<template>
  <MainHeader v-bind:role="userAccount.role" v-bind:name="userAccount.fullname" />
  <div class="main-content">
    <ProgramSelectContent v-bind:regionId="userAccount.regionId" />
  </div>
  <MainFooter />
</template>

<script lang="ts">
  import MainHeader from '@/components/header/MainHeader.vue';
  import ProgramSelectContent from '@/components/content/ProgramSelectContent.vue';
  import MainFooter from '@/components/footer/MainFooter.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
  import { FrontendPath } from '@/constants/path';

  export default {
    components: {
      MainHeader,
      ProgramSelectContent,
      MainFooter,
    },

    beforeRouteEnter(to, from, next) {
      var userAccount = MoneviCookieHandler.getUserData();
      if (userAccount.role != 'ROLE_SUPERVISOR') {
        return next(FrontendPath.Program.ROOT + '/' + FrontendPath.Program.DETAILS);
      }
      next();
    },

    data: function () {
      return {
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },
  };
</script>
