<template>
    <MainHeader
        v-bind:role="userAccount.role"
        v-bind:name="userAccount.fullname" />
    <div class="main-content">
        <ProgramTreasurerContent 
            v-if="userAccount.role === 'ROLE_TREASURER'"
            v-bind:organizationRegionId="userAccount.organizationRegionId"/>
        <!-- <DashboardChairmanContent
            v-if="role === 'ROLE_CHAIRMAN'"
            v-bind:name="name" />
        <DashboardSupervisorContent
            v-if="role === 'ROLE_SUPERVISOR'"
            v-bind:name="name" /> -->
    </div>
    <MainFooter />
</template>

<script lang="ts">
import MainHeader from '@/components/header/MainHeader.vue'
import ProgramTreasurerContent from '@/components/content/program/ProgramTreasurerContent.vue';
import MainFooter from '@/components/footer/MainFooter.vue';
import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

export default {
    components: {
        MainHeader,
        ProgramTreasurerContent,
        MainFooter,
    },

    data: function() {
        return {
            userAccount: MoneviCookieHandler.getUserData(),
        }
    }
}
</script>