<template>
  <div>
    <div>
      <v-breadcrumbs :items="items" divider=">"></v-breadcrumbs>
    </div>
    <!-- Users data tabel -->
    <v-data-table
      :headers="headers"
      :items="usersData"
      :search="search"
      loading loading-text="Loading... Please wait"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Управление пользователями</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-text-field
            v-model="search"
            label="Поиск"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <!-- Users detail popup window -->
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-img v-model="editedItem.avatar" label="Avatar" :src="editedItem.avatar" required></v-img>
                    </v-col>
                    <v-col cols="12" sm="6" md="7">
                      <v-text-field v-model="editedItem.nickname" label="User name" :rules="[v => !!v || 'Name is required']" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="editedItem.city.name" label="City" :rules="[v => !!v || 'City is required']" requires></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.phone" label="Phone" :rules="[v => !!v || 'Phone is required']" requires></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End New User block -->
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          small
          class="mr-2 display-1"
          @click="editItem(item)"
        >
          mdi-account-edit
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    valid: '',
    search: '',
    // page urls
    items: [
      {
        text: 'Dashboard',
        disabled: false,
        href: '/home',
      },
      {
        text: 'Users',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },
    ],
    // Data table column titles
    headers: [
      {
        text: 'Имя',
        align: 'left',
        sortable: false,
        value: 'nickname',
      },
      { text: 'City', value: 'city.name' },
      { text: 'Phone', value: 'phone' },
      { text: 'Actions', value: 'action', sortable: false },
    ],
    usersData: [],
    editedIndex: -1,
    editedItem: {
      avatar: '',
      nickname: '',
      city: '',
      phone: '',
    },
    defaultItem: {
      avatar: '',
      nickname: '',
      city: '',
      phone: '',
    },
    nameRules: [
      v => !!v || 'Name is required',
    ],
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New User' : 'User detail info'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  mounted () {
    axios.get('https://back.ontimeapp.club/users/all/', {headers: {'Authorization': "Token " + localStorage.getItem("token"), "Access-Control-Allow-Headers":"*"} })
    .then(r => {
      for (let i = 0; i < r.data.data.length; i++) {
        if (r.data.data[i].is_customer === true){
          r.data.data[i].avatar = 'https://back.ontimeapp.club' + r.data.data[i].avatar
        }
      }
      this.usersData = r.data.data
    });
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.usersData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close () {
      this.dialog = false
    },
  },
}
</script>