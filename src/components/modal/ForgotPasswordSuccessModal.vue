<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="forgotPassword">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Lupa Password</h5>
          <button type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Tautan reset kata sandi telah dikirim ke email Anda.</p>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="closeModal($event)" type="button" class="btn btn-secondary">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    methods: {
      showModal() {
        var forgotPasswordModal: JQuery<HTMLDivElement> = $('#forgotPassword');
        forgotPasswordModal.modal('show');
      },

      closeModal(event: Event) {
        var forgotPasswordModal: JQuery<HTMLDivElement> = $('#forgotPassword');
        forgotPasswordModal.modal('hide');
      },
    },
  };
</script>
