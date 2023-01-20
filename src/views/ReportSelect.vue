<template>
  <MainHeader v-bind:role="userAccount.role" v-bind:name="userAccount.fullname" />
  <div class="main-content">
    <ReportSelectContent />
  </div>
  <MainFooter />
</template>

<script lang="ts">
  import MainHeader from '@/components/header/MainHeader.vue';
  import ReportSelectContent from '@/components/content/ReportSelectContent.vue';
  import MainFooter from '@/components/footer/MainFooter.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
  import { FrontendPath } from '@/constants/path';

  export default {
    components: {
      MainHeader,
      ReportSelectContent,
      MainFooter,
    },

    beforeRouteEnter(to, from, next) {
      var userAccount = MoneviCookieHandler.getUserData();
      if (userAccount.role != 'ROLE_SUPERVISOR') {
        return next(FrontendPath.Report.ROOT + '/' + FrontendPath.Report.DETAILS);
      }
      return next();
    },

    data: function () {
      return {
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },
  };
</script>
