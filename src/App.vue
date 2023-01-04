<template>
    <router-view></router-view>
</template>

<style>
    @import "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css";
    @import "https://use.fontawesome.com/releases/v5.7.2/css/all.css";
    @import "@/assets/css/style.css";
</style>

<script lang="ts">
export default {

    mounted() {
        let jqueryScript = document.createElement('jqueryScript');
        jqueryScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js');
        document.head.appendChild(jqueryScript);

        let popperJsScript = document.createElement('popperJsScript');
        popperJsScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js');
        document.head.appendChild(popperJsScript);

        let bootstrapScript = document.createElement('bootstrapScript');
        bootstrapScript.setAttribute('src', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js');
        document.head.appendChild(bootstrapScript);

        let momentJsScript = document.createElement('momentJsScript');
        momentJsScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js');
        document.head.appendChild(momentJsScript);

        let stislaScript = document.createElement('stislaScript');
        stislaScript.setAttribute('src', './assets/js/stisla.js');
        document.head.appendChild(stislaScript);

        let customScript = document.createElement('customScript');
        customScript.setAttribute('src', '.assets/js/custom.js');
        document.head.appendChild(customScript);
    }
}
</script>