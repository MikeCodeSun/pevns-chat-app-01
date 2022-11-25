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

  created() {
    this.userStore.getUserFromCookie();
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
              <ul class="list-unstyled">
                <!--chat user begin -->
                <li class="border-bottom">
                  <a
                    href="#"
                    class="d-flex justify-content-between align-items-center bg-light p-1"
                  >
                    <div class="d-flex align-items-center">
                      <img
                        src="/img/img-01.jpeg"
                        alt="user"
                        width="60"
                        height="60"
                        class="rounded-circle d-flex align-self-center"
                      />
                      <div class="p-1">
                        <p class="mb-0 fw-bold">Laruan Chen</p>
                        <p class="text-muted mb-0 small">Hello world!</p>
                      </div>
                    </div>
                    <div>
                      <p class="text-muted mb-0">Just now</p>
                      <span class="badge badge-pill bg-danger"
                        >1 minute ago</span
                      >
                    </div>
                  </a>
                </li>
                <!-- chat user end -->
                <!--chat user begin -->
                <li class="border-bottom">
                  <a
                    href="#"
                    class="d-flex justify-content-between align-items-center p-1"
                  >
                    <div class="d-flex align-items-center">
                      <img
                        src="/img/img-01.jpeg"
                        alt="user"
                        width="60"
                        height="60"
                        class="rounded-circle d-flex align-self-center"
                      />
                      <div class="p-1">
                        <p class="mb-0 fw-bold">Laruan Chen</p>
                        <p class="text-muted mb-0 small">Hello world!</p>
                      </div>
                    </div>
                    <div>
                      <p class="text-muted mb-0">Just now</p>
                      <span class="badge badge-pill bg-danger"
                        >1 minute ago</span
                      >
                    </div>
                  </a>
                </li>
                <!-- chat user end -->
                <!--chat user begin -->
                <li class="border-bottom">
                  <a
                    href="#"
                    class="d-flex justify-content-between align-items-center p-1"
                  >
                    <div class="d-flex align-items-center">
                      <img
                        src="/img/img-01.jpeg"
                        alt="user"
                        width="60"
                        height="60"
                        class="rounded-circle d-flex align-self-center"
                      />
                      <div class="p-1">
                        <p class="mb-0 fw-bold">Laruan Chen</p>
                        <p class="text-muted mb-0 small">Hello world!</p>
                      </div>
                    </div>
                    <div>
                      <p class="text-muted mb-0">Just now</p>
                      <span class="badge badge-pill bg-danger"
                        >3 minute ago</span
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
        <div class="col-7">
          <ul class="list-unstyled">
            <!-- single message begin -->
            <li class="d-flex mb-1">
              <img
                src="/img/img-01.jpeg"
                alt="user"
                width="60"
                height="60"
                class="rounded-circle d-flex align-self-center me-1"
              />
              <div class="card w-100">
                <div class="card-header d-flex justify-content-between p-1">
                  <p class="mb-0">Lara</p>
                  <p class="text-muted mb-0 small">1 minute ago</p>
                </div>
                <div class="card-body">
                  <p class="mb-0">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Veniam, autem?
                  </p>
                </div>
              </div>
            </li>
            <!-- sigle message end -->
            <!-- single message begin -->
            <li class="d-flex mb-1">
              <div class="card w-100 me-1">
                <div class="card-header d-flex justify-content-between p-1">
                  <p class="mb-0">Lara</p>
                  <p class="text-muted mb-0 small">1 minute ago</p>
                </div>
                <div class="card-body">
                  <p class="mb-0">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Veniam, autem? Lorem ipsum dolor sit amet consectetur,
                    adipisicing elit. Maxime, illum.
                  </p>
                </div>
              </div>
              <img
                src="/img/img-01.jpeg"
                alt="user"
                width="60"
                height="60"
                class="rounded-circle d-flex align-self-center"
              />
            </li>
            <!-- sigle message end -->
            <!-- single message begin -->
            <li class="d-flex mb-1">
              <img
                src="/img/img-01.jpeg"
                alt="user"
                width="60"
                height="60"
                class="rounded-circle d-flex align-self-center me-1"
              />
              <div class="card w-100">
                <div class="card-header d-flex justify-content-between p-1">
                  <p class="mb-0">Lara</p>
                  <p class="text-muted mb-0 small">1 minute ago</p>
                </div>
                <div class="card-body">
                  <p class="mb-0">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Veniam, autem?Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Minima architecto sed sit. Vero, velit
                    officia. Dolorem et aspernatur quos ut? Provident obcaecati
                    quod eligendi placeat laudantium excepturi facere asperiores
                    pariatur vel dicta delectus ratione, voluptates voluptate
                    rem sit possimus odio!
                  </p>
                </div>
              </div>
            </li>
            <!-- sigle message end -->
            <li>
              <textarea
                placeholder="Message"
                class="form-control"
                rows="6"
              ></textarea>
              <button class="btn btn-primary float-end">send</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
