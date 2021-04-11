<template>
  <div class="home">
    <div class="btn-panel">
      <button @click="pupVisible = true" class="btn-panel__btn-add">
        + Add
      </button>

      <button v-if="!authorized" @click="handleAuthClick" class="btn-panel__btn-add">Sign In</button>
      <button v-if="authorized" @click="handleSignoutClick">Sign Out</button>
      <div id="content"></div>

      <button @click="req">req</button>

      <div :class="{ visible: pupVisible }" class="pup">
        <div class="pup__inner">
          <img
            @click="pupVisible = false"
            class="pup__close"
            src="../../assets/icons/close.svg"
            alt=""
          />
          <span class="pup__title">Add new education</span>
          <form class="pup__form">
            <input
              v-model="subject"
              class="pup__input"
              type="text"
              placeholder="Subject"
            />
            <div class="pup__datepicker">
              <template>
                <datetime
                  format="DD-MM-YYYY H:i"
                  width="100%"
                  v-model="date"
                ></datetime>
              </template>
            </div>
<!--            <input type="checkbox"><label>Add to google calendar</label>-->
            <button @click="add" v-if="id === null" class="pup__btn">+ Add</button>
            <button @click="save" v-else class="pup__btn">Save</button>
          </form>

          <div :class="{ visible: pupSuccess }" class="pup-succ">
            <div class="pup-succ__text-block">
              <span class="pup-succ__text">Added</span>
              <img
                class="pup-succ__icon"
                src="../../assets/icons/check-green.svg"
                alt=""
              />
            </div>
            <button @click="pupSuccess = false" class="pup-succ__btn">
              Ok!
            </button>
          </div>

          <div :class="{ visible: pupError }" class="pup-succ">
            <div class="pup-succ__text-block">
              <span class="pup-succ__text">Error adding document!</span>
              <img
                      class="pup-succ__icon"
                      src="../../assets/icons/error.svg"
                      alt=""
              />
            </div>
            <button @click="pupError = false" class="pup-succ__btn">
              Back
            </button>
          </div>

        </div>
      </div>
    </div>

    <template>
      <div class="table">
        <md-table
          v-model="resultList"
          md-sort="date"
          md-sort-order="asc"
          md-card
          md-fixed-header
          @md-selected="onSelect"
        >
          <md-table-toolbar>
            <md-field md-clearable class="md-toolbar-section-end">
              <md-input placeholder="Search..." v-model="search" />
            </md-field>
          </md-table-toolbar>

          <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
            <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>

            <div class="md-toolbar-section-end">
              <md-button @click="del" class="md-icon-button md-icon-button-del">
                <md-icon>delete</md-icon>
              </md-button>
            </div>
          </md-table-toolbar>

          <md-table-row :class="{ future: isFuture(item), today: isToday(item), past: isPast(item)}" slot="md-table-row" slot-scope="{ item }" md-selectable="multiple" md-auto-select>
            <md-table-cell md-label="Subject" md-sort-by="subject">
              {{ item.subject }}
            </md-table-cell>
            <md-table-cell class="md-table-cell-date" md-label="Date" md-sort-by="date">
              {{ item.date }}
            </md-table-cell>
            <md-table-cell md-label="Status">
              <md-switch v-on:change="switchHappened(item)" v-model="item.happened"><span v-if="item.happened" class="table__switch-text table__switch-text--planned">Planned</span><span v-else class="table__switch-text table__switch-text--passed">Passed</span></md-switch>
            </md-table-cell>
            <md-table-cell class="md-table-cell-user" md-label="User" md-sort-by="user">
              {{ item.user }}
            </md-table-cell>
            <md-table-cell class="md-table-cell-btn">
              <img @click="viewHomeworks(item)" class="table__homework-btn" src="../../assets/icons/homework.svg">
            </md-table-cell>
            <md-table-cell class="md-table-cell-btn">
              <img @click="edit(item, $event)" class="table__edit-btn" src="../../assets/icons/edit.svg">
            </md-table-cell>
            <md-table-cell class="md-table-cell-btn">
              <md-button @click="delItem(item, $event)" class="md-icon-button md-icon-button-del">
                <md-icon>delete</md-icon>
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </div>
    </template>

  </div>
</template>

<script>
import { addData, getData, editData, delData, delDataItem, editHappened } from "@/services/firebase";
import datetime from "vuejs-datetimepicker";

//Google calendar
const CLIENT_ID = "792985532951-nv82rslfdkpka0pc12rqhh3a03lrm5qj.apps.googleusercontent.com";
const API_KEY = "AIzaSyAtOOI0FWivgFLvYBYwT5K3PFomuvbpYWk";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];
let SCOPES = "https://www.googleapis.com/auth/calendar.events";
//Google calendar

export default {
  name: "home",
  components: {
    datetime
  },
  data() {
    return {
      pupVisible: false,
      pupSuccess: false,
      pupError: false,
      date: "",
      subject: "",
      id: null,
      happened: true,
      list: [],
      search: "",
      selected: [],
      api: undefined,
      authorized: false
    };
  },

  created() {
    this.list = getData();
    this.api = gapi;
    this.handleClientLoad();
  },

  computed: {
    resultList() {
      if (this.search === "") {
        return this.list;
      } else {
        const search = this.search.toLowerCase();
        return this.list.filter(item => {
          return (
            item.subject.toLowerCase().includes(search) ||
            item.user.toLowerCase().includes(search) ||
            item.date.toLowerCase().includes(search)
          );
        });
      }
    }
  },

  methods: {

    add: function() {
      addData(this.date, this.happened, this.subject, this.$store.state.username).then(
        id => {
          if (id) {
            this.pupSuccess = true;
            this.list.push({
              subject: this.subject,
              user: this.$store.state.username,
              date: this.date,
              happened: this.happened,
              id,
            })
            this.updateSigninStatus(this.authorized, this.subject, this.date);
            this.subject = ""
          } else {
            this.pupError = true;
          }
        }
      );
    },

    del: function() {

      const isDelete = confirm("Delete selected item(s)?");

      if (isDelete) {
        delData(this.selected);

        for(let i = 0; i < this.selected.length; i++) {
          for(let k = 0; k < this.list.length; k++) {
            if(this.selected[i].id === this.list[k].id) {
              this.list.splice(k, 1);
            }
          }
        }

        this.$toast.success("Successfully deleted!", {
          position: "top-right",
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });
      }
    },

    delItem: function(item, event) {
      event.stopPropagation();

      const isDelete = confirm("Delete this item?");

      if (isDelete) {
        item.del = true;

        delDataItem(item.id);

        for (let k = 0; k < this.list.length; k++) {
          if (item.id === this.list[k].id) {
            this.list.splice(k, 1);
          }
        }

        this.$toast.success("Successfully deleted!", {
          position: "top-right",
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });

      }
    },

    onSelect (items) {
      this.selected = items;
    },
    getAlternateLabel (count) {
      let plural = ''

      if (count > 1) {
        plural = 's'
      }

      return `${count} item${plural} selected`
    },

    edit: function(item, event) {
      event.preventDefault();
      event.stopPropagation();
      this.subject = item.subject
      this.date = item.date
      this.id = item.id
      this.pupVisible = true
    },

    save: function () {
      let item = this.list.find( (e) => {
        return e.id === this.id
      })
      if (item !== undefined) {
        item.subject = this.subject;
        item.date = this.date;
        this.id = null;
        this.pupVisible = false;
      }
      editData(item.subject, item.date, item.id);
    },

    switchHappened: function(item) {
      editHappened(item.happened, item.id);
    },

    isFuture(item) {
      const currentDate = new Date();
      const itemDate = this.getCorrectDate(item.date);
      if (itemDate.getFullYear() >= currentDate.getFullYear()) {
        if (itemDate.getMonth() >= currentDate.getMonth()) {
          if (itemDate.getDate() > currentDate.getDate()) {
            return true;
          }
        }
      }
      return false;
    },

    isToday(item) {
      const currentDate = new Date();
      const itemDate = this.getCorrectDate(item.date);
      if (itemDate.getFullYear() === currentDate.getFullYear()) {
        if (itemDate.getMonth() === currentDate.getMonth()) {
          if (itemDate.getDate() === currentDate.getDate()) {
            return true;
          }
        }
      }
      return false;
    },

    isPast(item) {
      const currentDate = new Date();
      const itemDate = this.getCorrectDate(item.date);
      if (itemDate.getFullYear() <= currentDate.getFullYear()) {
        if (itemDate.getMonth() <= currentDate.getMonth()) {
          if (itemDate.getDate() < currentDate.getDate()) {
            return true;
          }
        }
      }
      return false;
    },

    getCorrectDate(str) {
      const parts = str.match(/(\d\d)-(\d\d)-(\d\d\d\d) (\d\d):(\d\d)/)
      const [,d,m,y,h,min] = parts;
      const date = new Date(y, +m - 1, +d, +h, +min);
      return date;
    },

    //For Calendar
    addHour(str) {
      const parts = str.match(/(\d\d)-(\d\d)-(\d\d\d\d) (\d\d):(\d\d)/)
      const [,d,m,y,h,min] = parts;
      const date = new Date(y, +m - 1, +d, +h + 1, +min);
      return date;
    },

    viewHomeworks(item) {
      this.$router.push('/homework/' + item.id);
    },


    handleClientLoad() {
      this.api.load("client:auth2", this.initClient);
    },

    initClient() {
      let vm = this;

      vm.api.client
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
          })
          .then(
              function() {
                // vm.api.auth2
                //     .getAuthInstance()
                //     .isSignedIn.listen(vm.updateSigninStatus);

                // vm.updateSigninStatus(
                //     vm.api.auth2.getAuthInstance().isSignedIn.get()
                // );

                // vm.api.auth2.getAuthInstance().isSignedIn.get();

              },
              function(error) {
                vm.appendPre(JSON.stringify(error, null, 2));
              }
          );
    },

    updateSigninStatus(isSignedIn, subject, date) {
      let vm = this;

      let isoDateStart = this.getCorrectDate(date);
      isoDateStart = isoDateStart.toISOString();

      let isoDateFinish = this.addHour(date);
      isoDateFinish = isoDateFinish.toISOString();

      if (isSignedIn) {

        // alert(2);

        var event = {
          summary: subject,
          location: "800 Howard St., San Francisco, CA 94103",
          description:
            "Education - " + subject,
          start: {
            dateTime: isoDateStart,
            timeZone: "Europe/Kiev"
          },
          end: {
            dateTime: isoDateFinish,
            timeZone: "Europe/Kiev"
          },
          recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
          attendees: [
            { email: "sbrin@example.com" }
          ],
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 0 },
              { method: "popup", minutes: 10 }
            ]
          }
        };

        var request = vm.api.client.calendar.events.insert({
          calendarId: "primary",
          resource: event
        });

        request.execute(function(event) {
          console.log("EVENT INFO", event);
          vm.appendPre("Event created: " + event.htmlLink);
        });
      }
    },

    appendPre(message) {
      var pre = document.getElementById('content');
      var textContent = document.createTextNode(message + '\n');
      pre.appendChild(textContent);
    },

    handleAuthClick(event) {
      Promise.resolve(this.api.auth2.getAuthInstance().signIn())
          .then(_ => {
            this.authorized = true;
          });
    },

    handleSignoutClick(event) {
      Promise.resolve(this.api.auth2.getAuthInstance().signOut())
          .then(_ => {
            this.authorized = false;
          });
    },

    req(isSignedIn) {

      let request = new Request('https://www.googleapis.com/calendar/v3/calendars/primary/events');
      console.log(request);

      // let vm = this;
      //
      // if (isSignedIn) {
      //   var request = vm.api.client.calendar.events.insert({
      //     calendarId: "primary",
      //   });
      //
      //   request.execute(function () {
      //     console.log(request);
      //   });


    }

  }
};
</script>


<style lang="sass" src="./homepage.sass"></style>
