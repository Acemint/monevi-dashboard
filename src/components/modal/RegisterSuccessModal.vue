<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="register">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Register</h5>
          <button v-on:click="closeModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Akun Anda telah berhasil didaftarkan, silakan menunggu email konfirmasi dari pengawas agar dapat login.</p>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="closeModal" type="button" class="btn btn-secondary">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    methods: {
      showModal() {
        var registerModal: JQuery<HTMLDivElement> = $('#register');
        registerModal.modal('show');
      },

      closeModal() {
        var registerModal: JQuery<HTMLDivElement> = $('#register');
        registerModal.modal('hide');
      },
    },
  };
</script>
