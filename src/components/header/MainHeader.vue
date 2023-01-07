<template>
    <div class="main-wrapper">
        <div class="navbar-bg"></div>
        <nav class="navbar navbar-expand-lg main-navbar">
            <form class="form-inline mr-auto">
                <ul class="navbar-nav mr-3">
                    <li>
                        <a href="#" data-toggle="sidebar" class="nav-link nav-link-lg"><i class="fas fa-bars"></i></a>
                    </li>
                </ul>
            </form>
            <ul class="navbar-nav navbar-right">
                <li class="dropdown"><a href="#" data-toggle="dropdown"
                        class="nav-link dropdown-toggle nav-link-lg nav-link-user">
                        <div class="d-sm-none d-lg-inline-block"> {{name}} </div>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right">
                        <a v-on:click="logout()" class="dropdown-item has-icon text-danger">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                </li>
            </ul>
        </nav>
        <div class="main-sidebar sidebar-style-2">
            <aside id="sidebar-wrapper">
                <div class="sidebar-brand">
                    <router-link to="/"><img src="@/assets/img/logo-full.svg" style="height: 19px;"></router-link>
                </div>
                <div class="sidebar-brand sidebar-brand-sm">
                    <router-link to="/"><img src="@/assets/img/logo.svg" style="height: 19px;"></router-link>
                </div>
                <TreasurerMenu 
                    v-bind:name="name"
                    v-if="role === 'ROLE_TREASURER'" />
                <ChairmanMenu 
                    v-bind:name="name"
                    v-if="role === 'ROLE_CHAIRMAN'" />
                <SupervisorMenu 
                    v-bind:name="name"
                    v-if="role === 'ROLE_SUPERVISOR'" />
            </aside>
        </div>
    </div>
</template>

<script lang="ts">
import { MoneviAPI } from '@/api/methods/monevi-api';
import ChairmanMenu from './ChairmanMenu.vue';
import SupervisorMenu from './SupervisorMenu.vue';
import TreasurerMenu from './TreasurerMenu.vue';

export default {

    components: {
        TreasurerMenu,
        SupervisorMenu,
        ChairmanMenu
    },

    data: function() {
        return {
            monevi_api: new MoneviAPI()
        }
    },
    
    props: {
        name: String,
        role: String
    },

    methods: {
        logout(): void {
            this.monevi_api.logout();
            this.$router.push('/login');
        }
    }
}

</script>