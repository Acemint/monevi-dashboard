<template>
  <section class="section">
    <div class="container mt-5">
      <div class="row">
        <div
          class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4"
        >
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
                    required
                  />
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
                    required
                  />
                </div>

                <div class="form-group">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg btn-block"
                    tabindex="4"
                  >
                    Reset Password
                  </button>
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
import moneviAxios from "@/api/configuration/monevi-axios";
import { MoneviPath } from "@/api/path/path";
import type {
  MoneviBodyResetPassword,
  MoneviParamsResetPassword,
} from "@/api/model/monevi-config";
import type { Success } from "@/api/model/monevi-result";
import { FrontendPath } from "@/constants/path";
import type { BaseErrorResponse } from "@/api/model/monevi-model";
import SimpleHeader from "../header/SimpleHeader.vue";
import SimpleFooter from "../footer/SimpleFooter.vue";

export default {
  data: function () {
    return {
      newPassword: "",
      confirmPassword: "",
    };
  },
  methods: {
    async resetPassword(event: Event) {
      event.preventDefault();

      var body = {} as MoneviBodyResetPassword;
      var params = {} as MoneviParamsResetPassword;
      // TODO: Take params from path
      // TODO: Handle error on fail reset password
      params.token = "test";
      body.newPassword = this.newPassword;
      body.confirmationPassword = this.confirmPassword;
      return await moneviAxios
        .post<Success>(MoneviPath.RESET_PASSWORD_PATH, body, {
          params,
          paramsSerializer: {
            indexes: null,
          },
        })
        .then((response) => {
          this.$router.push(FrontendPath.LOGIN);
        })
        .catch((error) => {});
    },
  },
  components: { SimpleHeader, SimpleFooter },
};
</script>
