<template>
  <IndexHeader />
  <div class="main-content">
    <IndexHeader />
  </div>
  <IndexFooter />
</template>

<script lang="ts">
  import IndexHeader from '@/components/header/IndexHeader.vue';
  import IndexFooter from '@/components/footer/IndexFooter.vue';
  import IndexContent from '@/components/content/IndexContent.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

  export default {
    components: {
      IndexHeader,
      IndexFooter,
      IndexContent,
    },

    data: function () {
      return {
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },
  };
</script>
