<script>
import SocketioService from "../socketio";
import { useUserStore } from "../stores/user";

export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      message: "",
      messageList: [{ message: "First Message" }],
      room: "",
      showModal: false,
    };
  },
  methods: {
    sendMessage() {
      SocketioService.sendMessage(
        { message: this.message, room: this.room },
        () => {
          this.messageList.push({ message: this.message });
          this.message = "";
        }
      );
    },
    chooseToChat() {
      SocketioService.joinMessage(this.room);
    },

    // 1108 learn how to cb function and get message

    leaveChat() {
      SocketioService.disconnectSocketConnection();
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
  created() {
    SocketioService.sutupSoketConnection("1");
    SocketioService.getMessage((err, message) => {
      console.log(err);
      this.messageList.push({ message });
    });
  },
};
</script>

<template>
  <div class="container rounded mt-3 py-2 bg-light">
    <div class="d-flex">
      <input type="text" v-model="room" />

      <button class="btn btn-warning" @click="chooseToChat">
        choose to chat
      </button>
      <button class="btn btn-danger" @click="leaveChat">leave chat</button>
    </div>
    <ul class="list-group">
      <li
        :key="index"
        v-for="(item, index) in messageList"
        class="list-group-item"
      >
        {{ item.message }}
      </li>
    </ul>
    <div class="mt-3">
      <input class="form-control" type="text" v-model="message" />
      <button class="btn btn-primary" @click="sendMessage">send</button>
    </div>
    <!-- modal Button begin-->
    <button
      type="button"
      class="btn btn-primary"
      data-toggle="modal"
      data-target="#exampleModalCenter"
      id="modalOpenBtn"
      @click="openModal"
    >
      open modal
    </button>
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
            <h5 class="modal-title" id="exampleModalLongTitle">To user:</h5>
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
            <button type="button" class="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal end -->
  </div>
</template>

<style scoped>
.show {
  display: block;
}
</style>
