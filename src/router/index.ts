import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../pages/login/Login.vue";
import Home from "../pages/homepage/Home.vue";
import Homeworks from "../pages/homeworks/Homeworks.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/homepage",
    name: "home",
    component: Home
  },
  {
    path: "/homework/:educationId",
    name: "homeworks",
    component: Homeworks
  }
];

const router = new VueRouter({
  routes
});

// router.beforeEach((to, from, next) => {
//   if(localStorage.getItem('username') === null && to.name !== 'login') {
//     next('login')
//   } else {
//     next()
//   }
// })

export default router;
