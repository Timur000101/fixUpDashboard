<template>
  <div>
    <div>
      <v-breadcrumbs :items="items" divider=">"></v-breadcrumbs>
    </div>

    <v-data-table
      :headers="headers"
      :items="courierData"
      :search="search"
      sort-by="calories"
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
                      <img 
                        :src="editedItem.avatar"
                        width="200"
                        class="previewer-demo-img"
                        style="margin-right: 30px;"
                        id="img" 
                        @click="show()"
                      />
                      <img 
                        :src="editedItem.front_passport"
                        width="200"
                        class="previewer-demo-img"
                        style="margin-right: 30px;" 
                        id="img2" 
                        @click="show2()"
                      />
                      <img 
                        :src="editedItem.back_passport"
                        width="200"
                        class="previewer-demo-img"
                        id="img3" 
                        @click="show3()"
                      />
                      <!-- <previewer ref="previewer" :list="list" :options="options"> </previewer> -->
                    </div>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.nickname" label="nickname"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.speciality" label="speciality"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.phone" label="Phone"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.country" label="Country"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.city.name" label="City"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        ref="menu1"
                        v-model="menu1"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
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
        <v-icon
          small
          class="display-1"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>


<script>
import vuePicturePreview from 'vue-picture-preview';
import { get } from 'http';
export default {
  components: {
    Previewer: vuePicturePreview
  },
  data: () => ({
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
    // list: [
    //   {
    //       msrc:
    //         'https://tva1.sinaimg.cn/thumbnail/006y8mN6ly1g95rjyub5bj30go0b40wc.jpg',
    //       src:
    //         'https://tva1.sinaimg.cn/large/006y8mN6ly1g95rjyub5bj30go0b40wc.jpg',
    //       w: 600,
    //       h: 400
    //     },
    //     {
    //       msrc:
    //         'https://tva1.sinaimg.cn/thumbnail/006y8mN6ly1g95rmt8pq4j30go0b4n28.jpg',
    //       src:
    //         'https://tva1.sinaimg.cn/large/006y8mN6ly1g95rmt8pq4j30go0b4n28.jpg',
    //       w: 600,
    //       h: 400
    //     },
    //     {
    //       msrc:
    //         'https://tva1.sinaimg.cn/thumbnail/006y8mN6ly1g95rn3grt6j30go0b4n0w.jpg',
    //       src:
    //         'https://tva1.sinaimg.cn/large/006y8mN6ly1g95rn3grt6j30go0b4n0w.jpg',
    //       w: 600,
    //       h: 400
    //     }
    // ],
    // options: {
    //   getThumbBoundsFn(index) {
    //     // find thumbnail element
    //     let thumbnail = document.querySelectorAll('.previewer-demo-img')[
    //       index
    //     ];
    //     // get window scroll Y
    //     let pageYScroll =
    //       window.pageYOffset || document.documentElement.scrollTop;
    //     // optionally get horizontal scroll
    //     // get position of element relative to viewport
    //     let rect = thumbnail.getBoundingClientRect();
    //     // w = width
    //     return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
    //     // Good guide on how to get element coordinates:
    //     // http://javascript.info/tutorial/coordinates
    //   }
    // },
    menu1: false,
    menu2: false,
    headers: [
      {
        text: 'nickname',
        align: 'left',
        sortable: false,
        value: 'nickname',
      },
      { text: 'Phone', value: 'phone' },
      { text: 'City', value: 'city.name' },
      { text: 'Rating', value: 'rating' },
      { text: 'Actions', value: 'action', sortable: false },
    ],
    courierData: [],
    editedIndex: -1,
    editedItem: {
      nickname: '',
      country: '',
      region: '',
      city: {
        name: ''
      },
      phone: '',
      speciality: '',
      avatar: ' ',
      front_passport: '',
      back_passport: '',
      birth_date: '',
      rating: '',
      about: '',
    },
    defaultItem: {
      nickname: '',
      country: '',
      region: '',
      city: {
        name: ''
      },
      phone: '',
      speciality: '',
      avatar: '',
      front_passport: '',
      back_passport: '',
      birth_date: '',
      rating: '',
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

  created () {
    this.initialize()
  },

  mounted () {
    axios.get('https://back.ontimeapp.club/users/all/ ', {headers: {'Authorization': "Token " + localStorage.getItem("token"), "Access-Control-Allow-Headers":"*"}})
    .then(r => {
      let arr = []
      for (let i = 0; i < r.data.data.length; i++) {
        if (r.data.data[i].is_worker === true){
          r.data.data[i].avatar = 'https://back.ontimeapp.club' + r.data.data[i].avatar
          r.data.data[i].front_passport = 'https://back.ontimeapp.club' + r.data.data[i].front_passport
          r.data.data[i].back_passport = 'https://back.ontimeapp.club' + r.data.data[i].back_passport
          arr.push(r.data.data[i])
        }
      }
      this.courierData = arr
    });
  },

  methods: {
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
    initialize () {
      this.courierData = [
        {
          nickname: '',
          country: '',
          region: '',
          city: {
            name: ''
          },
          phone: '',
          speciality: '',
          gender: '',
          avatar: '',
          certificate_front: '',
          certificate_back: '',
          gender: '',
          birth_date: '',
          rating: '',
          about: '',
        },
        
      ]
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

    deleteItem (item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.courierData.splice(index, 1)
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      let data = {
        'nickname': this.editedItem.nickname,
        'city': this.editedItem.address,
        'phone': this.editedItem.phone,
        
      }

      if (this.editedIndex > -1) {
        Object.assign(this.usersData[this.editedIndex], this.editedItem)
      } else {
        axios.post('https://delprod.herokuapp.com/users/all/', data, {headers: {'Authorization': "Token " + localStorage.getItem("token"), }}   )
        .then((response) => {
          console.log(response)
        }, r=> {
          console.log(r)
        })
        .catch((r) => {
          console.log(r)
        })// console.log(this.editItem.name)
            // this.usersData.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>