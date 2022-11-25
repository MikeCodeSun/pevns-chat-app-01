<script>
import { useUserStore } from "../stores/user";

export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      await this.userStore.login(this.username, this.password);
    },
  },
};
</script>

<template>
  <div class="container mt-5">
    <h1 class="fs-1 mb-5 text-center">Login</h1>
    <div class="row">
      <div class="col-6 mx-auto">
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">User Name</label>
            <input
              type="text"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              v-model="username"
            />
            <div
              v-show="userStore.loginErrorMsg?.username"
              class="alert alert-danger text-capitalize"
              role="alert"
            >
              {{ userStore.loginErrorMsg?.username }}
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label"
              >Password</label
            >
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              v-model="password"
            />
            <div
              v-show="userStore.loginErrorMsg?.password"
              class="alert alert-danger text-capitalize"
              role="alert"
            >
              {{ userStore.loginErrorMsg?.password }}
            </div>
          </div>
          <div class="mb-3 form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
            />
            <label class="form-check-label" for="exampleCheck1"
              >Check me out</label
            >
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>
