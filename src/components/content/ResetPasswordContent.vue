<template>
  <section class="section">
    <div class="container mt-5">
      <div class="row">
        <div class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
          <SimpleHeader />

          <div class="card card-primary">
            <div class="card-header"><h4>Reset Password</h4></div>

            <div class="card-body">
              <form v-on:submit="resetPassword">
                <div class="form-group">
                  <label for="password">New Password</label>
                  <input
                    v-model="newPassword"
                    id="password"
                    type="password"
                    class="form-control pwstrength"
                    data-indicator="pwindicator"
                    name="password"
                    tabindex="2"
                    required />
                  <div id="pwindicator" class="pwindicator">
                    <div class="bar"></div>
                    <div class="label"></div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="password-confirm">Confirm Password</label>
                  <input
                    v-model="confirmPassword"
                    id="password-confirm"
                    type="password"
                    class="form-control"
                    name="confirm-password"
                    tabindex="2"
                    required />
                </div>

                <div class="form-group">
                  <button type="submit" class="btn btn-primary btn-lg btn-block" tabindex="4">Reset Password</button>
                </div>
              </form>
            </div>
          </div>
          <SimpleFooter />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { FrontendRouteName } from '@/constants/path';
  import SimpleHeader from '../header/SimpleHeader.vue';
  import SimpleFooter from '../footer/SimpleFooter.vue';
  import { authorizationApi } from '@/api/service/authorization-api';

  export default {
    data: function () {
      return {
        newPassword: '',
        confirmPassword: '',
      };
    },

    beforeMount() {
      if (this.$route.query.token == undefined || this.$route.query.token == null) {
        return this.$router.push({ name: FrontendRouteName.LOGIN });
      }
    },

    methods: {
      async resetPassword(event: Event) {
        event.preventDefault();

        if (this.newPassword != this.confirmPassword) {
          alert('New password is not the same as confirmation password');
          return;
        }

        var token = this.$route.query.token!.toString();
        await authorizationApi
          .resetPassword(token, this.newPassword, this.confirmPassword)
          .then((repsonse) => {
            alert('Successfully reset password');
            this.$router.push({ name: FrontendRouteName.LOGIN });
            return;
          })
          .catch((error) => {
            alert('Failed to reset password, try to request reset password again');
            return;
          });
      },
    },

    components: { SimpleHeader, SimpleFooter },
  };
</script>
