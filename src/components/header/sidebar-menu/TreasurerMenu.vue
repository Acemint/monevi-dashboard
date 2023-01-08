<template>
  <ul class="sidebar-menu">
    <li v-for="item in dashboardItems" v-bind:class="[item.active ? 'active' : '']">
      <span>{{ updateActiveDashboardItem }}</span>
      <router-link class="nav-link" v-bind:to="item.path">
        <i v-bind:class="item.class"></i>
        <span> {{ item.name }} </span>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import Path from '@/path';

export default {

  data: function() {
    return {
      dashboardItems: [
        { name: 'Dashboard', path: Path.DASHBOARD, class: 'fas fa-fire', active: false},
        { name: 'Program Kerja', path: Path.PROGRAM, class: 'fas fa-briefcase', active: false},
        { name: 'Laporan', path: Path.REPORT, class: 'fas fa-wallet', active: false}
      ]
    }
  },
  
  computed: {
    updateActiveDashboardItem() {
      for (let item of this.dashboardItems) {
        console.log(item.path, this.$router.currentRoute.value.path);  
        if (item.path === this.$router.currentRoute.value.path) {
          item.active = true;
        } else {
          item.active = false;
        }
      }
    }

  }
}

export type DashboardItem = {
  name: string,
  path: string,
  class: string,
  active: boolean
}

</script>