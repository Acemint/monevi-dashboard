<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="programLockModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Kunci Program</h5>
          <button v-on:click="closeModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda ingin menkonfirmasi program ini supaya tidak bisa lagi diubah oleh Bendahara / Ketua?</p>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="lockProgram" type="button" class="btn btn-danger">Kunci</button>
          <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { programApi } from '@/api/service/program-api';

  export default {
    props: {
      userAccount: Object,
      program: Object,
    },

    methods: {
      showModal() {
        var programLockModal: JQuery<HTMLDivElement> = $('#programLockModal');
        programLockModal.modal('show');
      },

      closeModal(event: Event) {
        var programLockModal: JQuery<HTMLDivElement> = $('#programLockModal');
        programLockModal.modal('hide');
      },

      async lockProgram(event: Event) {
        var success = await programApi.lockProgram(this.userAccount!.id, this.program!.id!);
        if (success == null) {
          alert('Failed to lock program');
          return;
        }
        alert('Successfully locked program');
        var closeButton: any = this.$refs.closeModalButton;
        closeButton.click();
        this.$emit('successUpdate');
      },
    },
  };
</script>
