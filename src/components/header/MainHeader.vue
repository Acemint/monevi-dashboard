<template>
    <div class="main-wrapper">
        <div class="navbar-bg"></div>
        <MainNavbar 
            v-bind:name="name"/>
        <div class="main-sidebar sidebar-style-2">
            <aside id="sidebar-wrapper">
                <div class="sidebar-brand">
                    <router-link to="/"><img src="@/assets/img/logo-full.svg" style="height: 19px;"></router-link>
                </div>
                <div class="sidebar-brand sidebar-brand-sm">
                    <router-link to="/"><img src="@/assets/img/logo.svg" style="height: 19px;"></router-link>
                </div>
                <TreasurerMenu
                    v-if="role === 'ROLE_TREASURER'" />
                <ChairmanMenu
                    v-if="role === 'ROLE_CHAIRMAN'" />
                <SupervisorMenu
                    v-if="role === 'ROLE_SUPERVISOR'" />
            </aside>
        </div>
    </div>
</template>

<script lang="ts">
import MainNavbar from './navbar/MainNavbar.vue';
import ChairmanMenu from '@/components/header/sidebar-menu/ChairmanMenu.vue';
import SupervisorMenu from '@/components/header/sidebar-menu/SupervisorMenu.vue';
import TreasurerMenu from '@/components/header/sidebar-menu/TreasurerMenu.vue';

export default {

    components: {
        MainNavbar,
        TreasurerMenu,
        SupervisorMenu,
        ChairmanMenu
    },

    props: {
        name: String,
        role: String
    }
}

</script>