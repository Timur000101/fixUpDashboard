<template>
  <div>
    <div>
      <v-breadcrumbs :items="items" divider=">"></v-breadcrumbs>
    </div>

    <v-data-table
      :headers="headers"
      :items="courierData"
      :search="search"
      sort-by="nickname"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Управление специалистами</v-toolbar-title>
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
          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ on }">
              <v-btn color="pink accent-3" dark class="mb-2" v-on="on">Новый специалист</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <div style="display: flex; justify-content: space-between;">
                      <div class="imageBlock">
                        <img 
                          :src="editedItem.avatar"
                          width="200"
                          class="previewer-demo-img"
                          style="margin-right: 30px;"
                          id="img" 
                          @click="show()"
                        />
                      </div>
                      <div class="imageBlock">
                        <img 
                          :src="editedItem.front_passport"
                          width="200"
                          class="previewer-demo-img"
                          style="margin-right: 30px;" 
                          id="img2" 
                          @click="show2()"
                        />
                      </div>
                      <div class="imageBlock">
                        <img 
                          :src="editedItem.back_passport"
                          width="200"
                          class="previewer-demo-img"
                          id="img3" 
                          @click="show3()"
                        />
                      </div>
                      <!-- <previewer ref="previewer" :list="list" :options="options"> </previewer> -->
                    </div>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field  v-model="editedItem.nickname" label="nickname"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.speciality" label="speciality"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.phone" label="Phone"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.country.name" label="Country"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        ref="menu1"
                        v-model="menu1"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="editedItem.birth_date"
                            label="Date"
                            hint="MM/DD/YYYY format"
                            persistent-hint
                            @blur="editedItem.birth_date = parseDate(editedItem.birth_date)"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="editedItem.birth_date" no-title @input="menu1 = false"></v-date-picker>
                      </v-menu>
                      {{editedItem.birth_date}}
                    </v-col>
                    <v-col cols="12" sm="8" md="6">
                      <v-textarea v-model="editedItem.about" label="About Me"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <div v-if="editedItem.is_checked == false">
                        <v-text-field v-model="checked.is_notChecked"></v-text-field>
                      </div>
                      <div v-else>
                        <v-text-field v-model="checked.is_checked"></v-text-field>
                      </div>
                      <v-checkbox
                        v-model="editedItem.is_checked"
                        :color="color"
                        @change="toggleChange(editedItem.id)"
                        label="Change status"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <!-- <v-btn color="blue darken-1" text @click="save">Save</v-btn> -->
              </v-card-actions>
            </v-card>
          </v-dialog>
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
        <!-- <v-icon
          small
          class="display-1"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon> -->
      </template>
    </v-data-table>
  </div>
</template>


<script>
import { get } from 'http';
export default {
  data: () => ({
    color: 'accent',
    dialog: false,
    search: '',
    count: 0,
    count2: 0,
    count3: 0,
    items: [
      {
        text: 'Dashboard',
        disabled: false,
        href: '/home',
      },
      {
        text: 'Specialists',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },
    ],
    menu1: false,
    menu2: false,
    headers: [
      {
        text: 'nickname',
        align: 'left',
        sortable: true,
        value: 'nickname',
      },
      { text: 'Phone', value: 'phone' },
      { text: 'Status', value: 'is_checked' },
      { text: 'Actions', value: 'action', sortable: false },
    ],
    courierData: [],
    editedIndex: -1,
    editedItem: {
      id: '',
      nickname: '',
      country: '',
      region: '',
      // city: {
      //   name: ''
      // },
      phone: '',
      speciality: '',
      avatar: ' ',
      front_passport: '',
      back_passport: '',
      birth_date: '',
      is_checked: false,
      about: '',
    },
    checked: {
      isChecked: false,
      is_checked: 'Checked',
      is_notChecked: 'Not checked'
    },
    defaultItem: {
      nickname: '',
      country: '',
      region: '',
      // city: {
      //   name: ''
      // },
      phone: '',
      speciality: '',
      avatar: '',
      front_passport: '',
      back_passport: '',
      birth_date: '',
      is_checked: false,
      about: '',
    },
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: '',
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Specialist' : 'About Specialist'
    },
    computedDateFormatted () {
      return this.formatDate(this.date)
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    }
  },

  mounted () {
    axios.get('https://back.ontimeapp.club/users/all/ ', {headers: {'Authorization': "Token " + localStorage.getItem("token"), "Access-Control-Allow-Headers":"*"}})
    .then(r => {
      console.log(r.data.data[5]);
      
      let arr = []
      for (let i = 0; i < r.data.data.length; i++) {
        if (r.data.data[i].is_worker === true){
          r.data.data[i].avatar = 'https://back.ontimeapp.club' + r.data.data[i].avatar
          r.data.data[i].front_passport = 'https://back.ontimeapp.club' + r.data.data[i].front_passport
          r.data.data[i].back_passport = 'https://back.ontimeapp.club' + r.data.data[i].back_passport
          arr.push(r.data.data[i])
          
        }

        if(r.data.data[i].is_checked == true) {
          console.log(r.data.data[i]);
          
        }
      }
      this.courierData = arr
    });
  },

  methods: {
    toggleChange(id) {
        let data = {
          'id': id,
          'checked': ''
        }
        if (this.editedItem.is_checked == true) {
          data.checked = 'True'
        } else {
          data.checked = 'False'
        }
        axios.post('https://back.ontimeapp.club/users/checked/', data, {headers: {'Authorization': "Token " + localStorage.getItem("token"), "Access-Control-Allow-Headers":"*"}})
        .then(r => {
          console.log(r.data);
        })
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    show() {
      if (this.count % 2 == 0) {
        document.getElementById('img').style.cssText = `
          position: absolute;
          width: 700px;
          height: 450px;
          top: 15%;
          left: 15%;
          z-index: 9999;
          transition: .8s;
        `
      } else {
        document.getElementById('img').style.cssText = `
          position: static;
          width: 200px;
          transition: .8s;
        `
      }
      this.count++
    },
    show2() {
      if (this.count2 % 2 == 0) {
        document.getElementById('img2').style.cssText = `
          position: absolute;
          width: 700px;
          height: 450px;
          top: 15%;
          left: 15%;
          z-index: 9999;
          transition: .8s;
        `
      } else {
        document.getElementById('img2').style.cssText = `
          position: static;
          width: 200px;
          transition: .8s;
          margin: 0 20px;
        `
      }
      this.count2++
    },
    show3() {
      if (this.count3 % 2 == 0) {
        document.getElementById('img3').style.cssText = `
          position: absolute;
          width: 700px;
          height: 450px;
          top: 15%;
          left: 15%;
          z-index: 9999;
          transition: .8s;
        `
      } else {
        document.getElementById('img3').style.cssText = `
          position: static;
          width: 200px;
          transition: .8s;
        `
      }
      this.count3++
    },

    editItem (item) {
      this.editedIndex = this.courierData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

  },
}
</script>

<style scoped>
  .imageBlock {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 220px;
    height: 130px;
    margin: 20px 5px;
  }
</style>