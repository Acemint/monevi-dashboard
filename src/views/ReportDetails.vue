<template>
  <MainHeader v-bind:role="userAccount.role" v-bind:name="userAccount.fullname" />
  <div class="main-content">
    <ReportDetailsTreasurerContent v-if="userAccount.role === 'ROLE_TREASURER'" />
    <ReportDetailsChairmanContent v-else-if="userAccount.role === 'ROLE_CHAIRMAN'" />
    <ReportDetailsSupervisorContent v-else />
  </div>
  <MainFooter />
</template>

<script lang="ts">
  import MainHeader from '@/components/header/MainHeader.vue';
  import MainFooter from '@/components/footer/MainFooter.vue';
  import ReportDetailsChairmanContent from '@/components/content/report/ReportDetailsChairmanContent.vue';
  import ReportDetailsTreasurerContent from '@/components/content/report/ReportDetailsTreasurerContent.vue';
  import ReportDetailsSupervisorContent from '@/components/content/report/ReportDetailsSupervisorContent.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

  export default {
    components: {
      MainHeader,
      MainFooter,
      ReportDetailsChairmanContent,
      ReportDetailsTreasurerContent,
      ReportDetailsSupervisorContent,
    },

    data: function () {
      return {
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },
  };
</script>
