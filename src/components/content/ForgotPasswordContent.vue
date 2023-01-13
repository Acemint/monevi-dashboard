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
              <h4>Lupa Kata Sandi</h4>
            </div>

            <div class="card-body">
              <p class="text-muted">
                Kami akan mengirimkan tautan untuk mengatur ulang kata sandi
                Anda
              </p>

              <form v-on:submit="requestForgetPassword">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    v-model="inputEmail"
                    id="email"
                    type="email"
                    class="form-control"
                    name="email"
                    tabindex="1"
                    required
                    autofocus
                  />
                </div>

                <div class="form-group">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg btn-block"
                    tabindex="4"
                    data-toggle="modal"
                  >
                    Forgot Password
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

  <ForgotPasswordSuccessModal ref="forgetPasswordSuccessModal" />
</template>

<script lang="ts">
import moneviAxios from "@/api/configuration/monevi-axios";
import { MoneviPath } from "@/api/path/path";
import type { MoneviParamsRequestResetPassword } from "@/api/model/monevi-config";
import type { Success } from "@/api/model/monevi-result";
import { MoneviAPI } from "@/api/methods/monevi-api";
import SimpleHeader from "@/components/header/SimpleHeader.vue";
import SimpleFooter from "@/components/footer/SimpleFooter.vue";
import ForgotPasswordSuccessModal from "@/components/modal/ForgotPasswordSuccessModal.vue";
import "jquery";
import "bootstrap";

export default {
  data: function () {
    return {
      monevi_api: new MoneviAPI(),
      inputEmail: "",
    };
  },

  methods: {
    // TODO: handle error on fail to request forget password
    async requestForgetPassword(event: Event) {
      event.preventDefault();
      var params = {} as MoneviParamsRequestResetPassword;
      params.email = this.inputEmail;
      return await moneviAxios
        .get<Success>(MoneviPath.REQUEST_RESET_PASSWORD_PATH, {
          params: params,
          paramsSerializer: {
            indexes: null,
          },
        })
        .then((response) => {
          var forgotPasswordModal: any = this.$refs.forgetPasswordSuccessModal;
          forgotPasswordModal.showModal();
        });
    },
  },
  components: { SimpleFooter, SimpleHeader, ForgotPasswordSuccessModal },
};
</script>
