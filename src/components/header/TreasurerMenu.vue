<template>
  <ul class="sidebar-menu">
    <li class="menu-header">Dashboard</li>
    <li v-for="item in dashboardItems">
      <router-link class="nav-link" v-bind:to="item.path">
        <i v-bind:class="item.class"></i>
        <span> {{ item.name }} </span>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
export default {

  data: function() {
    return {
      dashboardItems: [
        { name: 'Index', path: '/index', class: 'fas fa-fire'},
        { name: 'Program Kerja', path: '/proker', class: 'fas fa-briefcase'},
        { name: 'Laporan', path: '/transaction', class: 'fas fa-wallet'}
      ]
    }
  },

  computed: {
    currentPage() {
      
    }
  }

}
</script>