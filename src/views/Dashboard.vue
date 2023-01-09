<template>
    <MainHeader
        v-bind:role="userAccount.role"
        v-bind:name="userAccount.fullname" />
    <div class="main-content">
        <DashboardTreasurerContent 
            v-if="userAccount.role === 'ROLE_TREASURER'"/>
        <DashboardChairmanContent
            v-if="userAccount.role === 'ROLE_CHAIRMAN'"/>
        <DashboardSupervisorContent
            v-if="userAccount.role === 'ROLE_SUPERVISOR'"/>
    </div>
    <MainFooter />
</template>

<script lang="ts">
import MainHeader from '@/components/header/MainHeader.vue'
import MainFooter from '@/components/footer/MainFooter.vue';
import DashboardChairmanContent from '@/components/content/dashboard/DashboardChairmanContent.vue';
import DashboardTreasurerContent from '@/components/content/dashboard/DashboardTreasurerContent.vue';
import DashboardSupervisorContent from '@/components/content/dashboard/DashboardSupervisorContent.vue';
import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

export default {
    components: {
        MainHeader,
        DashboardChairmanContent,
        DashboardSupervisorContent,
        DashboardTreasurerContent,
        MainFooter,
    },

    data: function() {
        return {
            userAccount: MoneviCookieHandler.getUserData(),
        }
    },

}
</script>