<template>
    <MainHeader
        v-bind:role="role"
        v-bind:name="name" />
    <div class="main-content">
        <DashboardTreasurerContent 
            v-if="role === 'ROLE_TREASURER'"
            v-bind:name="name" />
        <DashboardChairmanContent
            v-if="role === 'ROLE_CHAIRMAN'"
            v-bind:name="name" />
        <DashboardSupervisorContent
            v-if="role === 'ROLE_SUPERVISOR'"
            v-bind:name="name" />
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

    methods: {
        getUserData(): void {
            this.name = MoneviCookieHandler.getCookie("username");
            this.role = MoneviCookieHandler.getCookie("role");
        }
    },

    data: function() {
        return {
            name: "",
            role: "",
        }
    },

    mounted: function() {
        this.getUserData();
    }
}
</script>