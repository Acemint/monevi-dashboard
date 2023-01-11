<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="rejectStudent">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tolak Pengurus</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda benar-benar ingin menolak pengurus ini?</p>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="decline" type="button" class="btn btn-danger">Yes</button>
          <button ref="closeModalButton" type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    MoneviAPI
  } from '@/api/methods/monevi-api';

  export default {

    props: {
      studentId: String
    },

    methods: {
      
      decline() {
        if (this.studentId == null) {
          return;
        }
        this.monevi_api.rejectStudent(this.studentId)
          .then(response => {
            // TODO: On close modal, trigger restart for parent using emit
            if (this.$refs.closeModalButton instanceof HTMLButtonElement) {
              this.$refs.closeModalButton.click();
            }
          });
      }

    },

    data: function() {
      
      return {
        monevi_api: new MoneviAPI(),
      }

    }


  }
</script>