<template>
    <MainHeader
        v-bind:role="role"
        v-bind:name="name" />
    <div class="main-content">
        <ProgramTreasurerContent 
            v-if="role === 'ROLE_TREASURER'"
            v-bind:name="name" />
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

    beforeMount: function() {
        this.getUserData();
    }
}
</script>