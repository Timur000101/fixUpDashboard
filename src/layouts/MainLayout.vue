<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-row justify="center" align="center">
          <v-list-item>
            <v-img
              src="../assets/F2_2.png"
              max-height="200"
              max-width="200"
              class="ma-5"
            ></v-img>
          </v-list-item>
        </v-row>

        <v-list-item st-item v-for="link in links" :key="link.url" :to="link.url" :exact="link.exact" link>
          <v-list-item-action>
            <v-icon color="pink accent-3">{{link.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{link.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="pink accent-3" dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>FixUP - Admin Dashboard</v-toolbar-title>
      <v-btn icon  @click="logout()" class="float-right"><v-icon>mdi-account</v-icon></v-btn>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Home from '../views/Home.vue'
export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    links: [
      {title: 'Панель', url: '/home', exact: true, icon: 'mdi-view-dashboard'},
      {title: 'Специалисты', url: '/specialists', icon: 'mdi-truck-fast'},
      {title: 'Пользователи', url: '/users', icon: 'mdi-account-multiple'},
    ],
  }),
  methods: {
    logout() {
      this.$router.push('/')
    }
  }
}
</script>
