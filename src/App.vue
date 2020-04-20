<template>
  <!-- <v-app> -->
    <component :is="layout">
      <router-view></router-view>
    </component>
  <!-- </v-app> -->
  
  <!-- 87473513102 -->
  <!-- 123456ak    -->
</template>



<script>

import MainLayout from '@/layouts/MainLayout'
import EmptyLayout from '@/layouts/EmptyLayout'
export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || 'main') + '-layout'
    }
  },
  components: {
    MainLayout,
    EmptyLayout
  }
};
</script>
