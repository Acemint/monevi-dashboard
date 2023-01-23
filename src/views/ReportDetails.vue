<template>
  <MainHeader v-bind:role="userAccount.role" v-bind:name="userAccount.fullname" />
  <div class="main-content">
    <ReportDetailsStudentContent v-if="userAccount.role === 'ROLE_TREASURER' || userAccount.role === 'ROLE_CHAIRMAN'" />
    <ReportDetailsSupervisorContent v-else />
  </div>
  <MainFooter />
</template>

<script lang="ts">
  import MainHeader from '@/components/header/MainHeader.vue';
  import MainFooter from '@/components/footer/MainFooter.vue';
  import ReportDetailsStudentContent from '@/components/content/report/ReportDetailsStudentContent.vue';
  import ReportDetailsSupervisorContent from '@/components/content/report/ReportDetailsSupervisorContent.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

  export default {
    components: {
      MainHeader,
      MainFooter,
      ReportDetailsStudentContent,
      ReportDetailsSupervisorContent,
    },

    data: function () {
      return {
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },
  };
</script>
