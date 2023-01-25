<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="programEditModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ubah Program</h5>
          <button v-on:click="closeModal" type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda benar-benar ingin mengubah program kerja ini?</p>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="editProgram" type="button" class="btn btn-danger">Yes</button>
          <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    props: {
      transaction: Object,
    },

    methods: {
      showModal() {
        var programEditModal: JQuery<HTMLDivElement> = $('#programEditModal');
        programEditModal.modal('show');
      },

      closeModal(event: Event) {
        var programEditModal: JQuery<HTMLDivElement> = $('#programEditModal');
        programEditModal.modal('hide');
      },

      editProgram(event: Event) {},
    },
  };
</script>
