<template>
  <section class="section">
    <div class="container mt-5">
      <div class="row">
        <div class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
          <SimpleHeader />

          <div class="card card-primary">
            <div class="card-header">
              <h4>Lupa Kata Sandi</h4>
            </div>

            <div class="card-body">
              <p class="text-muted">Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda</p>

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
                    autofocus />
                </div>

                <div class="form-group">
                  <button type="submit" class="btn btn-primary btn-lg btn-block" tabindex="4">Forgot Password</button>
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
  import SimpleHeader from '@/components/header/SimpleHeader.vue';
  import SimpleFooter from '@/components/footer/SimpleFooter.vue';
  import ForgotPasswordSuccessModal from '@/components/modal/ForgotPasswordSuccessModal.vue';
  import { authorizationApi } from '@/api/service/authorization-api';

  export default {
    data: function () {
      return {
        inputEmail: '',
      };
    },

    methods: {
      async requestForgetPassword(event: Event) {
        event.preventDefault();
        var forgotPasswordModal: any = this.$refs.forgetPasswordSuccessModal;
        forgotPasswordModal.showModal();
        await authorizationApi.forgetPassword(this.inputEmail);
      },
    },
    components: { SimpleFooter, SimpleHeader, ForgotPasswordSuccessModal },
  };
</script>
