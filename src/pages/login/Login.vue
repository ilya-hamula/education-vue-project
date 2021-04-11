<template>
  <div class="login" id="login">
    <h1 class="login__title">LOGIN PAGE</h1>
    <form class="login__form">
      <input
        v-model="username"
        class="login__input"
        type="text"
        placeholder="Username"
      />
      <input
        v-model="password"
        class="login__input"
        type="password"
        placeholder="Password"
      />
      <button @click="login" class="login__btn">Login</button>
    </form>
  </div>
</template>

<script>
import { init, isUserExists, signIn } from "../../services/firebase";

init();

export default {
  name: "Login",

  data() {
    return {
      username: "Test",
      password: "1111"
    };
  },

  methods: {
    // login: function() {
    //   isUserExists(this.username, this.password).then(isOk => {
    //     if (isOk) {
    //       this.$store.commit("setUserName", this.username);
    //       localStorage.setItem("username", this.username);
    //       this.$router.push({ name: "home" });
    //     } else {
    //       alert("OOops something went wrong !");
    //     }
    //   });
    // },

    login() {
      signIn(this.username, this.password).then(isOk => {
        if (isOk) {
          this.$store.commit("setUserName", this.username);
          localStorage.setItem("username", this.username);
          this.$router.push({ name: "home" });
        } else {
          console.log('error');
        }
      });
    }
  }
};
</script>

<style lang="sass" src="./login-page.sass"></style>
