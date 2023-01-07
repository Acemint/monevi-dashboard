<template>
    <router-view></router-view>
</template>

<style>
    @import "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css";
    @import "https://use.fontawesome.com/releases/v5.7.2/css/all.css";
    @import "../node_modules/jqvmap/dist/jqvmap.min.css";
    @import "../node_modules/weather-icons/css/weather-icons.min.css";
    @import "../node_modules/summernote/dist/summernote-bs4.css";
    @import "@/assets/css/style.css";
    /* @import "./assets/css/component.css"; */
    /* @import "@/assets/css/custom.css"; */
</style>

<script lang="ts">
export default {

    mounted() {
        this.$loadScript('https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js')
            .then(() => {
                this.$loadScript('./src/assets/js/stisla.js');
                this.$loadScript('./src/assets/js/custom.js');
            });
        this.$loadScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js');
        this.$loadScript('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js');
        this.$loadScript('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js');
    }
}
</script>