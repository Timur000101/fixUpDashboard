<template>
  <v-app id="inspire">
    <div class="vld-parent">
        <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :on-cancel="onCancel"
        :is-full-page="fullPage"></loading>
    </div>
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <img src="@/assets/F2_2.png" class="app-logo" style="width: 70px; height: 70px;" alt="">
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="6"
            sm="4"
            md="6"
          >
            <img src="@/assets/banner-slide.png" alt="">
          </v-col>
          <v-col
            cols="6"
            sm="6"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="pink accent-3"
                dark
                flat
              >
                <v-toolbar-title>Войти в админ панель</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Login"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    :rules="[v => !!v || 'Login is request']"
                    v-model="phone"
                  />

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock-question"
                    type="password"
                    :rules="[v => !!v || 'Password is request']"
                    v-model="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="pink accent-3 white--text" @click="login()">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>


<script>
import Loading from 'vue-loading-overlay';
export default {
  data: () => ({
    phone: '',
    password: '',
    isLoading: false,
    fullPage: true
  }),
  components: {
    Loading
  },
  props: {
    source: String,
  },
  methods: {
    login() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false
      }, 10000)
      axios.post('https://back.ontimeapp.club/users/admin_login/', {
        phone: this.phone,
        password: this.password
      })
      .then((response) => {
        if(response.data.key && response.data.uid) {
          localStorage.setItem('token', response.data.key)
          localStorage.setItem('uid', response.data.uid)
          this.$router.push('/home');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },


  },
  
}
</script>



<style scoped>
  .vld-parent {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 45%;
    right: 48%;
    z-index: 99999;
    text-align: center;
  }
  .app-logo {
    position: relative;
    right: 0;
  }
</style>