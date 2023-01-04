<template>
    <div class="main-wrapper">
        <div class="navbar-bg"></div>
        <nav class="navbar navbar-expand-lg main-navbar">
            <form class="form-inline mr-auto">
                <ul class="navbar-nav mr-3">
                    <li><a href="#" data-toggle="sidebar" class="nav-link nav-link-lg"><i class="fas fa-bars"></i></a>
                    </li>
                </ul>
            </form>
            <ul class="navbar-nav navbar-right">
                <li class="dropdown"><a href="#" data-toggle="dropdown"
                        class="nav-link dropdown-toggle nav-link-lg nav-link-user">
                        <div class="d-sm-none d-lg-inline-block">Hi, Ujang Maman</div>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right">
                        <a href="#" class="dropdown-item has-icon text-danger">
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
                <MainMenu />
            </aside>
        </div>
    </div>
</template>

<script lang="ts">
import MainMenu from './MainMenu.vue';

export default {

    components: {
        MainMenu
    }
}

</script>