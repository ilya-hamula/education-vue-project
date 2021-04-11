<template>
  <div class="homeworks">
    <div class="btn-panel">
      <button @click="pupVisible = true" class="btn-panel__btn-add">
        + Add homeworks
      </button>

      <div :class="{ visible: pupVisible }" class="pup">
        <div class="pup__inner">
          <img
                  @click="pupVisible = false"
                  class="pup__close"
                  src="../../assets/icons/close.svg"
                  alt=""
          />
          <span class="pup__title">Add homeworks</span>
          <form class="pup__form">
            <input
                    v-model="url"
                    class="pup__input"
                    type="text"
                    placeholder="Url"
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


            <button @click="add" type="button" class="pup__btn">+ Add</button>

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
                v-model="list"
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

          <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="multiple" md-auto-select>
            <md-table-cell class="md-table-cell-date" md-label="Date" md-sort-by="date">
              {{ item.date }}
            </md-table-cell>
            <md-table-cell class="md-table-cell-url" md-label="Url" md-sort-by="url">
              <a v-bind:href="item.url">{{ item.url }}</a>
            </md-table-cell>
            <md-table-cell class="md-table-cell-user" md-label="User" md-sort-by="user">
              {{ item.user }}
            </md-table-cell>
          </md-table-row>
        </md-table>
      </div>
    </template>

  </div>
</template>

<script>

import {addHomework, getDataHomeworks} from "@/services/firebase";
import datetime from "vuejs-datetimepicker";

export default {
  name: "homeworks",

  components: {
    datetime
  },

  data() {
    return {
      pupVisible: false,
      pupSuccess: false,
      pupError: false,
      list: []
    };
  },

  created() {
    this.list = getDataHomeworks(this.$route.params.educationId);
  },

  methods: {

    add: function() {
      addHomework(this.date, this.url, this.$route.params.educationId, this.$store.state.username).then(
              id => {
                if (id) {
                  this.pupSuccess = true;
                  this.list.push({
                    url: this.url,
                    date: this.date,
                    education_id: this.educationId,
                    user: this.$store.state.username,
                  })
                } else {
                  this.pupError = true;
                }
              }
      );
    },

  }
};
</script>

<style lang="sass" src="./homeworks.sass"></style>
