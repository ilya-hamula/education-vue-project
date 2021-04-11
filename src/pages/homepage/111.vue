<template>
  <div>
    <button v-if="!authorized" @click="handleAuthClick">Sign In</button>
    <button v-if="authorized" @click="handleSignoutClick">Sign Out</button>
    <div id="content"></div>
  </div>
</template>

<script>
const CLIENT_ID = "792985532951-nv82rslfdkpka0pc12rqhh3a03lrm5qj.apps.googleusercontent.com";
const API_KEY = "AIzaSyAtOOI0FWivgFLvYBYwT5K3PFomuvbpYWk";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];
let SCOPES = "https://www.googleapis.com/auth/calendar.events";

export default {
  name: "home",

  data() {
    return {
      api: undefined,
      authorized: false
    };
  },

  created() {
    this.api = gapi;
    this.handleClientLoad();
  },

  methods: {

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
            vm.api.auth2
              .getAuthInstance()
              .isSignedIn.listen(vm.updateSigninStatus);

            vm.updateSigninStatus(
              vm.api.auth2.getAuthInstance().isSignedIn.get()
            );
          },
          function(error) {
            vm.appendPre(JSON.stringify(error, null, 2));
          }
        );
    },

    updateSigninStatus(isSignedIn) {
      let vm = this;

      if (isSignedIn) {

        var event = {
          summary: "Google I/O 2015",
          location: "800 Howard St., San Francisco, CA 94103",
          description:
            "A chance to hear more about Google's developer products.",
          start: {
            dateTime: "2020-09-01T09:00:00-07:00",
            timeZone: "America/Los_Angeles"
          },
          end: {
            dateTime: "2020-09-01T17:00:00-07:00",
            timeZone: "America/Los_Angeles"
          },
          recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
          attendees: [
            { email: "lpage@example.com" },
            { email: "sbrin@example.com" }
          ],
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 24 * 60 },
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

  }
};
</script>
