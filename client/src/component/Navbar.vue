<script>
import { useUserStore } from "../stores/user";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  created() {
    this.userStore.getUserFromCookie();
  },
  methods: {
    async logout() {
      await this.userStore.logout();
      window.location.reload();
    },
  },
};
</script>

<template>
  <nav class="navbar navbar-expand-sm bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Ez Chat</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link
              tag="a"
              class="nav-link active"
              aria-current="page"
              :to="{ name: 'home' }"
              >Home</router-link
            >
          </li>

          <div v-if="userStore.user" class="d-flex flex-column flex-sm-row">
            <li class="nav-item">
              <router-link class="nav-link" to="/">{{
                userStore.user.username
              }}</router-link>
            </li>
            <li class="nav-item">
              <router-link @click="logout" class="nav-link" to="/login"
                >Log out</router-link
              >
            </li>
          </div>
          <div v-else class="d-flex flex-column flex-sm-row">
            <li class="nav-item">
              <router-link class="nav-link" to="/register"
                >Register</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </nav>
</template>
