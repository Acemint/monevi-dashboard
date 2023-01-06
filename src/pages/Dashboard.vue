<template>
    <MainHeader />
    <div class="main-content" v-if="role === 'ROLE_TREASURER'">
        <DashboardTreasurerContent 
            v-bind:name="name" />
    </div>
    <div class="main-content" v-if="role === 'ROLE_CHAIRMAN'">
        <DashboardChairmanContent
            v-bind:name="name" />
    </div>
    <MainFooter />
</template>

<script lang="ts">
import MainHeader from '../components/header/MainHeader.vue'
import MainFooter from '../components/footer/MainFooter.vue';
import DashboardTreasurerContent from '../components/content/DashboardTreasurerContent.vue';
import DashboardChairmanContent from '../components/content/DashboardChairmanContent.vue';
import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

export default {
    components: {
        MainHeader,
        MainFooter,
        DashboardChairmanContent, 
        DashboardTreasurerContent
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