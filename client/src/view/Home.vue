<script>
import { useUserStore } from "../stores/user";
import IoServer from "../socketIoConnect";
export default {
  setup() {
    const userStore = useUserStore();
    return {
      userStore,
    };
  },
  // 1123 add new message alert!
  data() {
    return {
      inputMessage: "",
      messageList: [],
      room: "",
      to: "",
      showChatInput: false,
      searchUserName: "",
      showModal: false,
      sendMessageToModalName: "",
      sendMessageToModalContent: "",
      sendMessageToModalId: "",
      notifications: [],
    };
  },

  methods: {
    sendMessage() {
      const date = new Date().toLocaleString();
      IoServer.sendMessage(
        {
          room: this.room,
          message: {
            created_at: date,
            content: this.inputMessage,
            message_from: this.userStore.user.id,
            message_to: this.to,
            uname: this.userStore.user.username,
          },
        },
        () => {
          console.log("send msg");
        }
      );
      this.inputMessage = "";
    },
    // join room /select user to chat
    joinRoom(room, to) {
      // console.log(room);
      //message not show when first click 1118
      this.userStore.getUserMessage(to);
      // this.messageList = this.userStore.messages;
      this.showChatInput = true;
      this.room = room;
      this.to = to;
      IoServer.joinRoom(room);
    },
    // search user
    searchUser(value) {
      // console.log(this.searchUserName);
      // console.log("search");
      // console.log(value);
      this.userStore.searchUser(value);
    },
    openModal(username, userid) {
      // console.log(username);
      // console.log(userid);
      this.sendMessageToModalName = username;
      this.sendMessageToModalId = userid;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    // 1122 sendmessage err
    sendMessageToModalUser() {
      // console.log(this.to);
      if (this.sendMessageToModalContent.trim() === "") {
        alert("Message Content must not be empty!");
        return;
      }
      this.userStore.sendMessage({
        to: this.sendMessageToModalId,
        content: this.sendMessageToModalContent,
      });
      this.showModal = false;
    },
    checkNotification(message_from) {
      console.log(message_from);
      const notificationNum = this.notifications.filter(
        (item) => item.message_from === message_from
      ).length;
      console.log(notificationNum);
      return notificationNum;
    },
  },
  computed: {
    showSearchResult() {
      return this.userStore.searchUsersList.length > 0;
      // console.log(this.searchUserName);
      // return true;
    },
    // notify number
    // checkNotification(message_from) {
    //   console.log(message_from);
    //   const notificationNum = this.notifications.filter(
    //     (item) => item.message_from === message_from
    //   ).length;
    //   console.log(notificationNum);
    //   return notificationNum;
    // },
  },
  created() {
    this.userStore.getUserFromCookie();
    IoServer.connectIo();
    IoServer.getMessage((message) => {
      this.userStore.messages.push(message);
    });
    this.userStore.getUsers();
    IoServer.getNewMessageAlert((data) => {
      console.log(data);
      this.notifications.push(data);
      console.log(this.notifications);
    });
  },
  watch: {
    searchUserName() {
      console.log("name change");
    },
    notifacations(newN, oldN) {
      console.log(newN);
      console.log(oldN);
    },
  },
  mounted() {
    // console.log(this.userStore.user);
    console.log(this.notifications);
  },
};
</script>

<template>
  <section style="background-color: #eee; min-height: 100vh">
    <div class="container py-5">
      <div class="row">
        <!-- chat users list -->
        <div class="col-5">
          <h5 class="fw-bold text-center">Member</h5>
          <div class="card">
            <div class="card-body">
              <!-- search user -->

              <input
                type="text"
                placeholder="search user"
                class="w-100 p-1 rounded mb-1"
                v-model.lazy="searchUserName"
                @input="searchUser($event.target.value)"
              />
              <ul v-show="showSearchResult" class="w-100 list-unstyled">
                <li
                  v-for="item in this.userStore.searchUsersList"
                  :key="item.id"
                  class="d-flex justify-content-between px-2 py-1 text-capitalize bg-light mb-0"
                >
                  <a>{{ item.username }}</a>
                  <a
                    role="button"
                    class="text-primary"
                    @click="openModal(item.username, item.id)"
                    >send message</a
                  >
                </li>
              </ul>
              <ul class="list-unstyled">
                <!--chat user begin -->
                <li
                  class="border-bottom"
                  v-for="item in this.userStore.users"
                  :key="item.id"
                >
                  <a
                    href="#"
                    class="d-flex justify-content-between align-items-center bg-light p-1"
                    @click="joinRoom(item.id + this.userStore.user.id, item.id)"
                  >
                    <div class="d-flex align-items-center">
                      <!-- <img
                        src="/img/img-01.jpeg"
                        alt="user"
                        width="60"
                        height="60"
                        class="rounded-circle d-flex align-self-center"
                      /> -->
                      <div
                        class="text-capitalize bg-secondary text-light rounded-circle p-3 fs-4"
                      >
                        {{ item.username.slice(0, 1) }}
                      </div>
                      <div class="p-1">
                        <p class="mb-0 fw-bold">{{ item.username }}</p>
                        <!-- <p class="text-muted mb-0 small">Hello world!</p> -->
                      </div>
                    </div>
                    <div>
                      <!-- <p class="text-muted mb-0">Just now</p> -->
                      <span
                        v-show="checkNotification(item.id)"
                        class="badge badge-pill bg-danger"
                        >{{ checkNotification(item.id) }}</span
                      >
                    </div>
                  </a>
                </li>
                <!-- chat user end -->
              </ul>
            </div>
          </div>
        </div>
        <!-- chat message -->
        <div class="col-7" v-show="showChatInput">
          <ul class="list-unstyled d-flex flex-column-reverse chatBox">
            <!-- single message begin -->
            <li
              v-for="(item, index) in this.userStore.messages.slice().reverse()"
              :key="index"
              class="d-flex mb-2"
              :class="[
                item.message_from === this.userStore.user.id
                  ? 'flex-row-reverse'
                  : '',
              ]"
            >
              <!-- <img
                src="/img/img-01.jpeg"
                alt="user"
                width="60"
                height="60"
                class="rounded-circle d-flex align-self-center me-1"
              /> -->
              <div
                class="text-capitalize text-light rounded-circle fs-4 d-flex justify-content-between align-items-center px-2 h-50"
                :class="[
                  item.message_from === this.userStore.user.id
                    ? 'bg-primary'
                    : 'bg-secondary',
                ]"
              >
                <span>{{ item.uname.slice(0, 1) }}</span>
              </div>
              <div class="card w-100">
                <div
                  class="card-header d-flex justify-content-between p-1"
                  :class="[
                    item.message_from === this.userStore.user.id
                      ? 'flex-row-reverse'
                      : '',
                  ]"
                >
                  <p class="mb-0">{{ item.uname }}</p>
                  <p class="text-muted mb-0 small">
                    {{ item.created_at.slice(0, 19) }}
                  </p>
                </div>
                <div class="card-body">
                  <p class="mb-0">
                    {{ item.content }}
                  </p>
                </div>
              </div>
            </li>
            <!-- sigle message end -->
          </ul>
          <div v-show="showChatInput">
            <textarea
              placeholder="Message"
              class="form-control"
              rows="6"
              v-model="inputMessage"
            ></textarea>
            <button class="btn btn-primary float-end" @click="sendMessage">
              send
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal begin -->
    <!-- modal begin -->
    <!-- modal Button begin-->
    <!-- <button
      type="button"
      class="btn btn-primary"
      data-toggle="modal"
      data-target="#exampleModalCenter"
      id="modalOpenBtn"
      @click="openModal"
    >
      open modal
    </button> -->
    <!-- modal button end -->
    <!-- Modal begin-->
    <div
      class="modal fade"
      id="exampleModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
      :class="{ show: showModal }"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-capitalize" id="exampleModalLongTitle">
              To {{ sendMessageToModalName }}:
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span @click="closeModal" aria-hidden="true" class="px-2"
                >&times;</span
              >
            </button>
          </div>
          <div class="modal-body">
            <input
              class="w-100 p-2 rounded"
              type="text"
              placeholder="Message..."
              v-model="sendMessageToModalContent"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              @click="closeModal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="sendMessageToModalUser"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal end -->
    <!-- modal end -->
  </section>
</template>

<style scoped>
/* how chat message always stay bottom 1120 */
.chatBox {
  max-height: 500px;
  overflow: auto;
}
.show {
  display: block;
}
</style>
