<template>
  <ul class="sidebar-menu">
    <li v-for="item in dashboardItems" 
        v-bind:class="[item.active ? 'active' : '']">
      <router-link class="nav-link" v-bind:to="item.path">
        <i v-bind:class="item.class"></i>
        <span> {{ item.name }} </span>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import Path from '@/constants/path';
import Role from '@/constants/role';

export default {

  data() {
    return {
      dashboardItems: new Array<DashboardItem>()
    }
  },

  props: {
    role: String
  },

  beforeMount() { 
    this.selectDashboardItem();
    this.updateActiveDashboardItemStyling();
  },

  methods: {
    selectDashboardItem(): void  {
      if (this.role === Role.CHAIRMAN) {
        this.dashboardItems = [

        ];
      }
      else if (this.role === Role.TREASURER) {
        this.dashboardItems = [
          { name: 'Dashboard', path: Path.DASHBOARD, class: 'fas fa-fire', active: false},
          { name: 'Program Kerja', path: Path.PROGRAM, class: 'fas fa-briefcase', active: false},
          { name: 'Laporan', path: Path.REPORT, class: 'fas fa-wallet', active: false}
        ];
      }
      else if (this.role === Role.SUPERVISOR) {
        this.dashboardItems = [

        ];
      }
    },
    
    updateActiveDashboardItemStyling() {
      for (let item of this.dashboardItems) {
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