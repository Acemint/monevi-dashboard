<template>
  <div class="main-wrapper">
    <div class="navbar-bg"></div>
    <MainNavbar v-bind:name="name" />
    <div class="main-sidebar sidebar-style-2">
      <aside id="sidebar-wrapper">
        <div class="sidebar-brand">
          <router-link to="/"
            ><img src="@/assets/img/logo-full.svg" style="height: 19px"
          /></router-link>
        </div>
        <div class="sidebar-brand sidebar-brand-sm">
          <router-link to="/"
            ><img src="@/assets/img/logo.svg" style="height: 19px"
          /></router-link>
        </div>
        <SidebarMenu v-bind:role="role" />
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import MainNavbar from "./navbar/MainNavbar.vue";
import SidebarMenu from "@/components/header/sidebar-menu/MainSidebarMenu.vue";

export default {
  components: {
    MainNavbar,
    SidebarMenu,
  },

  props: {
    name: String,
    role: String,
  },
};
</script>
