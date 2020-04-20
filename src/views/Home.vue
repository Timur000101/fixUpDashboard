<template>
  <div>
    <div>
      <v-breadcrumbs :items="items" divider=">"></v-breadcrumbs>
    </div>

    <!-- Statistics block -->
    <v-item-group>
      <v-container>
        <v-row>
          <v-col v-for="(item, index) in cardData" :key="index" cols="12" md="3">
            <v-item>
              <v-card :class="[item.color]">
                <v-card-title class="white--text">
                  <v-icon class="white--text mr-2">{{item.icon}}</v-icon>
                  {{item.title}}
                </v-card-title>
                <v-card-text class="text-center display-1 white--text mt-10">
                  {{item.count}}
                </v-card-text>
                <v-card-text class="text-center white--text">
                  <v-icon></v-icon>
                  {{item.statistics}}
                </v-card-text>
                <v-card-text :class="[item.footerColor]">
                </v-card-text>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>

    <!-- End Statistics block -->

    <v-divider class="mt-10"></v-divider>

    <!-- Request schedule block -->

    <v-row class="mt-5">
      <v-col cols="12">
        <v-card>
          <div class="d-block">
            <div class="charts">
              <div class="pie-chart" style="display: flex; flex-direction: column; align-items: center; padding: 10px 0">
                <h3>Количество пользователей</h3>
                <pie-chart 
                  :data="[
                    ['Специалисты', this.number], 
                    ['Пользователи', this.number2]
                  ]" 
                  :donut="true">
                </pie-chart>
              </div>
              <div class="line-chart" style="width: 100%; display: flex; flex-direction: column; align-items: center; padding: 10px 0">
                <h3>Количество заказов и пользователей за месяц</h3>
                <line-chart 
                  :data="lineChartData" 
                  xtitle="Месяц" 
                  ytitle="Количество" 
                  :legend="true" 
                  :refresh="60"
                  />
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- End request schedule block -->

    <!-- Start Last request block -->
    <v-data-table
      :headers="headers"
      :items="requests"
      sort-by="startTime"
      class="elevation-1 mt-10"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Последние заказы</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="800px">
            <v-card>
              <v-card-title>
                <span class="headline">Request Detail</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.sender.nickname" label="User name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.date" label="Start Time"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.end_date" label="End Time"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.price" label="Price"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.status" label="Status"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.a_name" label="Start place"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.b_name" label="Destination"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="7" md="6">
                      <v-textarea solo name="input-7-4" v-model="editedItem.comment" label="Commets"></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          class="mr-2"
          @click="editItem(item)"
        >
           mdi-account-edit
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
    <!-- End Last request block -->
    
  </div>
</template>

<script>
import Chart from 'vue-chartless'
import Users from '@/views/Users.vue'
import moment from 'moment'
export default {
  components: {
      Chart
    },
    data: () => ({
      newUsers: '',
      number: null,
      number2: null,
      def : {
          type : 'bar'
      },
      return: {
        info: null
      },
      lineChartData: [
        {name: 'Заказы', data: {'2017-05-13': 2, '2017-06-13': 5, '2017-07-13': 8, '2017-08-13': 10, '2017-09-13': 5 }},
        {name: 'Новые пользователи', data: {'2017-05-13': 1, '2017-06-13': 1, '2017-07-13': 6, '2017-08-13': 5, '2017-09-13': 4 }}
      ],
      pieChart: [
        ['Специалисты', null], 
        ['Пользователи', null]
      ],
      items: [
        {
          text: 'Dashboard',
          disabled: true,
          href: '/home',
        },
      ],
      cardData: [
        {color: 'green lighten-1', icon: 'mdi-account-multiple-plus', title: 'Новые пользователи', statistics: '15% со вчерашнего дня', footerColor: 'green darken-1', count: ''},
        {color: 'deep-purple lighten-1', icon: 'mdi-account-tie', title: 'Новые специалисты', statistics: '20% со вчерашнего дня', footerColor: 'deep-purple darken-1', count: ''},
        {color: 'blue-grey lighten-1', icon: 'mdi-trending-up', title: 'Количесто заказов', statistics: '50% со вчерашнего дня', footerColor: 'blue-grey darken-1', count: ''},
        {color: 'purple lighten-1', icon: 'mdi-currency-usd', title: 'Общий доход', statistics: '15% со вчерашнего дня', footerColor: 'purple darken-1', count: '$1000'}
      ],
      /// Status users ///
      dialog: false,
      headers: [
        {
          text: 'Имя заказчика',
          align: 'left',
          sortable: false,
          value: 'sender.nickname',
        },
        { text: 'Имя специалиста', value: 'worker.nickname' },
        { text: 'Время начала', value: 'date' },
        { text: 'Время завершение', value: 'end_date' },
        { text: 'Цена', value: 'price' },
        { text: 'Статус', value: 'status' },
        { text: 'Действия', value: 'action', sortable: false },
      ],
      requests: [],
      editedIndex: -1,
      editedItem: {
        sender: {
          nickname: ''
        },
        date: 0,
        end_date: 0,
        a_name: '',
        b_name: '',
        price: 0,
        status: 0,
      },
      defaultItem: {
        sender: {
          nickname: ''
        },
        date: 0,
        end_date: 0,
        a_name: '',
        b_name: '',
        price: 0,
        status: 0,
      },
    }),
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    created () {
      this.initialize()
    },
    mounted () {      
      axios.get('https://back.ontimeapp.club/users/all/', {headers: {'Authorization': "Token " + localStorage.getItem("token")}})
      .then(r => {
        // console.log(r)
        let arr = []
        for (let i = 0; i < r.data.data.length; i++) {
          if (r.data.data[i].is_worker === true){
            arr.push(r.data.data[i])
          }
          this.cardData[0].count = r.data.data.length
          this.number2 = r.data.data.length
        }
        this.cardData[1].count = arr.length
        this.number = arr.length
      });
      axios.get('https://back.ontimeapp.club/users/order/all/', {headers: {'Authorization': "Token " + localStorage.getItem("token")}})
      .then(r => {
        for (let i in r.data.data){
          let d = moment(String(r.data.data[i].date)).format('MM.DD.YY HH:MM')
          let ed = moment(String(r.data.data[i].end_date)).format('MM.DD.YY HH:MM')
          r.data.data[i].date = d
          r.data.data[i].end_date = ed
          if (r.data.data[i].is_active){
            r.data.data[i].status = 'active'
          }
          else{
            r.data.data[i].status = 'finished'
          }
        }
        this.requests = r.data.data
        
        
        this.cardData[2].count = r.data.data.length
        
      })
    

      // let url = "wss://back.ontimeapp.club/maps/order/?token="+localStorage.getItem('token')

      // var socket = new WebSocket(url);
      // socket.onopen = function() {
      //   console.log("Соединение установлено.");
      // };

      // socket.onmessage = function(event) {
      //   this.requests.push(event.data)
      //   console.log(event.data)
      // };

      
      // socket.onclose = function(event) {
      //   if (event.wasClean) {
      //     alert('Соединение закрыто чисто');
      //   } else {
      //     alert('Обрыв соединения'); // например, "убит" процесс сервера
      //   }
      //   alert('Код: ' + event.code + ' причина: ' + event.reason);
      // };

      // socket.onerror = function(error) {
      //   alert("Ошибка " + error.message);
      // };
      // Chartkick.options = {
      //   colors: ["#7E57C2", "#66BB6A"]
      // }
    },
    methods: {
      initialize () {
        this.requests = [
          {
            nickname: '',
            phone: '',
            // customer_id: '',
            date: '',
            endTime: '',
            price: '',
            status: '',
          },
        ]
      },
      
      editItem (item) {
        this.editedIndex = this.requests.indexOf(item)
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

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.requests[this.editedIndex], this.editedItem)
        } else {
          this.requests.push(this.editedItem)
        }
        this.close()
      },
    },
}
</script>


<style scoped>
  .charts {
    display: flex;

  }
</style>