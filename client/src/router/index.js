import { createRouter, createWebHistory } from "vue-router";
import Home from "../view/Home.vue";
import Register from "../view/Register.vue";
import Login from "../view/Login.vue";
import Tst from "../view/Tst.vue";
import TstTemplate from "../view/TstTemplate.vue";
import { useUserStore } from "../stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: Home, name: "home" },
    { path: "/register", component: Register, name: "register" },
    { path: "/login", component: Login, name: "login" },
    { path: "/tst", component: Tst, name: "tst" },
    { path: "/tsttemplate", component: TstTemplate, name: "tstTemplate" },
    { path: "/:pathMatch(.*)*", redirect: "/login" },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.name === "home" && !userStore.user) {
    next({ name: "login" });
    return;
  }
  if ((to.name === "login" || to.name === "register") && userStore.user) {
    next({ name: "home" });
    return;
  }
  next();
  return;
});

export default router;
