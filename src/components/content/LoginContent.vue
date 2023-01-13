<template>
  <section class="section">
    <div class="container mt-5">
      <div class="row">
        <div
          class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4"
        >
          <SimpleHeader />

          <div class="card card-primary">
            <div class="card-header">
              <h4>Login</h4>
            </div>

            <div class="card-body">
              <form v-on:submit="submit">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    v-model="username"
                    id="email"
                    type="email"
                    class="form-control"
                    name="email"
                    tabindex="1"
                    required
                    autofocus
                  />
                  <div class="invalid-feedback">Please fill in your email</div>
                </div>

                <div class="form-group">
                  <div class="d-block">
                    <label for="password" class="control-label">Password</label>
                    <div class="float-right">
                      <router-link to="/forgot-password" class="text-small">
                        Forgot Password?
                      </router-link>
                    </div>
                  </div>
                  <input
                    v-model="password"
                    id="password"
                    type="password"
                    class="form-control"
                    name="password"
                    tabindex="2"
                    required
                  />
                  <div class="invalid-feedback">
                    please fill in your password
                  </div>
                </div>

                <div class="form-group">
                  <div class="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      name="remember"
                      class="custom-control-input"
                      tabindex="3"
                      id="remember-me"
                    />
                    <label class="custom-control-label" for="remember-me"
                      >Remember Me</label
                    >
                  </div>
                </div>

                <div class="form-group">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg btn-block"
                    tabindex="4"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div class="mt-5 text-muted text-center">
            Don't have an account?
            <router-link to="/register">Create One</router-link>
          </div>
          <SimpleFooter />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
// TODO: Check if click remember me, and then prolong the cookie to 7 days or more.
import { MoneviAPI } from "@/api/methods/monevi-api";
import SimpleHeader from "@/components/header/SimpleHeader.vue";
import SimpleFooter from "@/components/footer/SimpleFooter.vue";

export default {
  methods: {
    async submit(event: Event) {
      event.preventDefault();
      await this.monevi_api.login(this.username, this.password).then((data) => {
        this.$router.push("/dashboard");
      });
    },
  },
  data: function () {
    return {
      monevi_api: new MoneviAPI(),
      username: "",
      password: "",
    };
  },
  components: { SimpleHeader, SimpleFooter },
};
</script>
