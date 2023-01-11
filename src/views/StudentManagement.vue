<template>
  <MainHeader 
    v-bind:role="userAccount.role"
    v-bind:name="userAccount.fullname"/>
  <div class="main-content">
    <StudentManagementContent 
      v-bind:regionId="userAccount.regionId"/>
  </div>
  <MainFooter />
</template>

<script lang="ts">
import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
import MainFooter from '@/components/footer/MainFooter.vue';
import MainHeader from '@/components/header/MainHeader.vue';
import StudentManagementContent from '@/components/content/StudentManagementContent.vue';

export default {
  components: {
    MainHeader,
    StudentManagementContent,
    MainFooter
},

  data: function() {
      return {
        userAccount: MoneviCookieHandler.getUserData()
      }
  }
}
</script>