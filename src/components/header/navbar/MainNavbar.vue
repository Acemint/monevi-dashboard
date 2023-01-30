<template>
  <nav class="navbar navbar-expand-lg main-navbar">
    <form class="form-inline mr-auto">
      <ul class="navbar-nav mr-3">
        <li>
          <a href="#" data-toggle="sidebar" class="nav-link nav-link-lg"><i class="fas fa-bars"></i></a>
        </li>
      </ul>
    </form>
    <ul class="navbar-nav navbar-right">
      <li class="dropdown">
        <a href="#" data-toggle="dropdown" class="nav-link dropdown-toggle nav-link-lg nav-link-user">
          <div class="d-sm-none d-lg-inline-block">{{ name }}</div>
        </a>
        <div class="dropdown-menu dropdown-menu-right">
          <a v-on:click="logout()" class="dropdown-item has-icon text-danger">
            <i class="fas fa-sign-out-alt"></i> Logout
          </a>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
  import { authorizationApi } from '@/api/service/authorization-api';
  import { FrontendRouteName } from '@/constants/path';

  export default {
    props: {
      name: String,
    },

    methods: {
      logout(): void {
        authorizationApi.logout();
        this.$router.push({ name: FrontendRouteName.LOGIN });
      },
    },
  };
</script>
