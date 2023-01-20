<template>
  <ul class="sidebar-menu">
    <template v-for="item in dashboardItems">
      <li v-if="item.dropdownProps != null" v-bind:class="[item.active ? 'active show' : '', 'nav-item dropdown']">
        <a href="#" class="nav-link has-dropdown" data-toggle="dropdown">
          <i v-bind:class="item.logo"></i>
          <span> {{ item.name }} </span>
        </a>
        <ul v-bind:class="[item.active ? 'show' : '', 'dropdown-menu']">
          <li v-for="childItem in item.dropdownProps" v-bind:class="[childItem.active ? 'active' : '']">
            <router-link class="nav-link" v-bind:to="childItem.path">
              {{ childItem.name }}
            </router-link>
          </li>
        </ul>
      </li>

      <li v-else v-bind:class="[item.active ? 'active' : '']">
        <router-link class="nav-link" v-bind:to="item.path">
          <i v-bind:class="item.logo"></i>
          <span> {{ item.name }} </span>
        </router-link>
      </li>
    </template>
  </ul>
</template>

<script lang="ts">
  import Path, { FrontendPath } from '@/constants/path';
  import Role from '@/constants/role';

  export default {
    data() {
      return {
        dashboardItems: new Array<DashboardItem>(),
      };
    },

    props: {
      role: String,
    },

    beforeMount() {
      this.selectDashboardItem();
      this.updateActiveDashboardItemStyling();
    },

    methods: {
      selectDashboardItem(): void {
        if (this.role === Role.SUPERVISOR) {
          this.dashboardItems = [
            {
              name: 'Dashboard',
              path: Path.DASHBOARD,
              logo: 'fas fa-fire',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Organisasi',
              path: Path.ORGANIZATION,
              logo: 'fas fa-sitemap',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Kelola Pengurus',
              path: Path.STUDENT_MANAGEMENT,
              logo: 'fas fa-user-alt',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Program Kerja',
              path: FrontendPath.Program.ROOT,
              logo: 'fas fa-briefcase',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Laporan',
              path: FrontendPath.Report.ROOT,
              logo: 'fas fa-file-alt',
              active: false,
              dropdownProps: null,
            },
          ];
        } else if (this.role === Role.TREASURER) {
          this.dashboardItems = [
            {
              name: 'Dashboard',
              path: Path.DASHBOARD,
              logo: 'fas fa-fire',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Program Kerja',
              path: FrontendPath.Program.ROOT,
              logo: 'fas fa-briefcase',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Transaksi',
              path: '',
              logo: 'fas fa-wallet',
              active: false,
              dropdownProps: [
                {
                  name: 'Transaksi',
                  path: FrontendPath.Transaction.ROOT,
                  active: false,
                },
                {
                  name: 'Laporan',
                  path: FrontendPath.Report.ROOT,
                  active: false,
                },
              ],
            },
          ];
        } else if (this.role === Role.CHAIRMAN) {
          this.dashboardItems = [
            {
              name: 'Dashboard',
              path: Path.DASHBOARD,
              logo: 'fas fa-fire',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Program Kerja',
              path: FrontendPath.Program.ROOT,
              logo: 'fas fa-briefcase',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Laporan',
              path: '',
              logo: 'fas fa-file-alt',
              active: false,
              dropdownProps: [
                {
                  name: 'Laporan',
                  path: FrontendPath.Report.ROOT,
                  active: false,
                },
                {
                  name: 'Detail Transaksi',
                  path: FrontendPath.Transaction.ROOT,
                  active: false,
                },
              ],
            },
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
      },
    },
  };

  export type DashboardItem = {
    name: string;
    path: string;
    logo: string;
    active: boolean;
    dropdownProps: Array<ChildDashboardItem> | null;
  };

  export type ChildDashboardItem = {
    name: string;
    path: string;
    active: boolean;
  };
</script>
