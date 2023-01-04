<template>
    <MainHeader />
    <div class="main-content">
        <IndexContent />
    </div>
    <MainFooter />
</template>

<script lang="ts">
import MainHeader from '../components/header/MainHeader.vue'
import MainFooter from '../components/footer/MainFooter.vue';
import IndexContent from '../components/content/IndexContent.vue';

export default {
    components: {
        MainHeader,
        MainFooter,
        IndexContent
    }
}
</script>