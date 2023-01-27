<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="programDeleteModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Hapus Program</h5>
          <button v-on:click="closeModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda benar-benar ingin menghapus program kerja {{ program!.name }}?</p>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="deleteProgram" type="button" class="btn btn-danger">Yes</button>
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
      program: Object,
    },

    methods: {
      showModal() {
        var programDeleteModal: JQuery<HTMLDivElement> = $('#programDeleteModal');
        programDeleteModal.modal('show');
      },

      closeModal(event: Event) {
        var programDeleteModal: JQuery<HTMLDivElement> = $('#programDeleteModal');
        programDeleteModal.modal('hide');
      },

      async deleteProgram(event: Event) {
        var success = await programApi.deleteProgram(this.program!.id!);
        if (success == false) {
          alert('Failed to delete program');
          return;
        }
        alert('Successfully delete program');
        var closeButton: any = this.$refs.closeModalButton;
        closeButton.click();
        this.$emit('successUpdate');
      },
    },
  };
</script>
