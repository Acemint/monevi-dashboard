<template>
  <ul class="sidebar-menu">
    <template v-for="item in dashboardItems">
      <li v-if="item.dropdownProps != null" v-bind:class="[item.active ? 'active show' : '', 'nav-item dropdown']">
        <a class="nav-link has-dropdown" data-toggle="dropdown">
          <i v-bind:class="item.logo"></i>
          <span> {{ item.name }} </span>
        </a>
        <ul v-bind:class="[item.active ? 'show' : '', 'dropdown-menu']">
          <li v-for="childItem in item.dropdownProps" v-bind:class="[childItem.active ? 'active' : '']">
            <router-link class="nav-link" v-bind:to="{ name: childItem.routeName }">
              {{ childItem.name }}
            </router-link>
          </li>
        </ul>
      </li>

      <li v-else v-bind:class="[item.active ? 'active' : '']">
        <router-link class="nav-link" v-bind:to="{ name: item.routeName }">
          <i v-bind:class="item.logo"></i>
          <span> {{ item.name }} </span>
        </router-link>
      </li>
    </template>
  </ul>
</template>

<script lang="ts">
  import { FrontendRouteName } from '@/constants/path';
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
              routeName: FrontendRouteName.DASHBOARD,
              logo: 'fas fa-fire',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Organisasi',
              routeName: FrontendRouteName.ORGANIZATION,
              logo: 'fas fa-sitemap',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Kelola Pengurus',
              routeName: FrontendRouteName.STUDENT_MANAGEMENT,
              logo: 'fas fa-user-alt',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Program Kerja',
              routeName: FrontendRouteName.Program.ROOT,
              logo: 'fas fa-briefcase',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Laporan',
              routeName: FrontendRouteName.Report.ROOT,
              logo: 'fas fa-file-alt',
              active: false,
              dropdownProps: null,
            },
          ];
        } else if (this.role === Role.TREASURER) {
          this.dashboardItems = [
            {
              name: 'Dashboard',
              routeName: FrontendRouteName.DASHBOARD,
              logo: 'fas fa-fire',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Program Kerja',
              routeName: FrontendRouteName.Program.DETAILS,
              logo: 'fas fa-briefcase',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Transaksi',
              routeName: '',
              logo: 'fas fa-wallet',
              active: false,
              dropdownProps: [
                {
                  name: 'Transaksi',
                  routeName: FrontendRouteName.Transaction.ROOT,
                  active: false,
                },
                {
                  name: 'Laporan',
                  routeName: FrontendRouteName.Report.DETAILS,
                  active: false,
                },
              ],
            },
          ];
        } else if (this.role === Role.CHAIRMAN) {
          this.dashboardItems = [
            {
              name: 'Dashboard',
              routeName: FrontendRouteName.DASHBOARD,
              logo: 'fas fa-fire',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Program Kerja',
              routeName: FrontendRouteName.Program.DETAILS,
              logo: 'fas fa-briefcase',
              active: false,
              dropdownProps: null,
            },
            {
              name: 'Laporan',
              routeName: '',
              logo: 'fas fa-file-alt',
              active: false,
              dropdownProps: [
                {
                  name: 'Laporan',
                  routeName: FrontendRouteName.Report.DETAILS,
                  active: false,
                },
                {
                  name: 'Detail Transaksi',
                  routeName: FrontendRouteName.Transaction.ROOT,
                  active: false,
                },
              ],
            },
          ];
        }
      },

      updateActiveDashboardItemStyling() {
        for (let item of this.dashboardItems) {
          if (item.routeName === this.$route.name) {
            item.active = true;
          } else {
            item.active = false;
          }
          if (item.dropdownProps == undefined) {
            continue;
          }
          for (let child of item.dropdownProps) {
            if (child.routeName === this.$route.name) {
              item.active = true;
              child.active = true;
            } else {
              child.active = false;
            }
          }
        }
      },
    },
  };

  export type DashboardItem = {
    name: string;
    routeName: string;
    logo: string;
    active: boolean;
    dropdownProps: Array<ChildDashboardItem> | null;
  };

  export type ChildDashboardItem = {
    name: string;
    routeName: string;
    active: boolean;
  };
</script>
