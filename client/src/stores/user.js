import { defineStore } from "pinia";
// import router from "../router";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useRouter } from "vue-router";

const baseUrl = "http://localhost:4000/api/v1/user";
const messageUrl = "http://localhost:4000/api/v1/message";
const router = useRouter();

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: null,
      loginErrorMsg: null,
      registerErrorMsg: null,
      userMsg: "",
      users: [],
      messages: [],
      searchUsersList: [],
    };
  },
  actions: {
    // register
    register(username, password) {
      fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      })
        .then((res) => {
          // console.log(res);
          return res.json();
        })
        .then((data) => {
          // console.log(data);
          if (data.status) {
            this.registerErrorMsg = null;
            router.push("/login");
          } else if (!data.status) this.registerErrorMsg = data.msg;
        })
        .catch((err) => console.log(err));
    },
    // login
    login(username, password) {
      fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            window.location.replace("/");
            this.loginErrorMsg = null;
          } else if (!data.status) {
            this.loginErrorMsg = data.msg;
          }
        })
        .catch((err) => console.log(err));
    },
    // getuser
    getUserFromCookie() {
      const cookie = Cookies.get("token");
      if (cookie) {
        const decoded = jwt_decode(cookie);

        if (decoded.exp > Date.now() / 1000) {
          this.user = decoded;
        } else if (decoded.exp < Date.now() / 1000) {
          console.log("cookie expires");
          this.user = null;
        }
      }
    },
    logout() {
      fetch(`${baseUrl}/logout`, {
        method: "GET",
        headers: {
          "Content-type": "application/app",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.msg);
          this.user = null;
        })
        .catch((err) => console.log(err));
    },
    // get chating users
    getUsers() {
      fetch(`${baseUrl}/getusers`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          this.users = data;
        })
        .catch((err) => console.log(err));
    },
    getUserMessage(to) {
      fetch(`${messageUrl}/${to}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);

          this.messages = data;
        })
        .catch((err) => console.log(err));
    },
    // search user
    searchUser(username) {
      if (!username) {
        this.searchUsersList = [];
        return;
      }
      fetch(`${baseUrl}/searchusers/${username}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          this.searchUsersList = data;
        })
        .catch((err) => console.log(err));
    },
    // 1121 send message modal
    sendMessage({ content, to }) {
      fetch(`${messageUrl}/${to}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    },
  },
});
