<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="rejectStudent">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tolak Pengurus</h5>
          <button type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda benar-benar ingin menolak pengurus ini?</p>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="decline" type="button" class="btn btn-danger">Yes</button>
          <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { moneviAxios } from '@/api/configuration/monevi-axios';
  import type { MoneviParamsDeclineStudent } from '@/api/model/monevi-config';
  import { MoneviPath } from '@/api/path/path';

  export default {
    props: {
      studentId: String,
    },

    methods: {
      decline() {
        var params = {} as MoneviParamsDeclineStudent;
        if (this.studentId == null) {
          console.error('Internal server error, studentId is not found');
          return;
        }
        params.studentId = this.studentId;
        return moneviAxios
          .post(MoneviPath.DECLINE_STUDENT_PATH, null, {
            params: params,
            paramsSerializer: { indexes: null },
          })
          .then((response) => {
            if (this.$refs.closeModalButton instanceof HTMLButtonElement) {
              this.$refs.closeModalButton.click();
            }
            this.$emit('successUpdate');
          })
          .catch((error) => {
            if (this.$refs.closeModalButton instanceof HTMLButtonElement) {
              this.$refs.closeModalButton.click();
            }
            alert('internal server error, unable to reject student');
          });
      },

      showModal() {
        var rejectStudentModal: JQuery<HTMLDivElement> = $('#rejectStudent');
        rejectStudentModal.modal('show');
      },

      closeModal(event: Event) {
        var rejectStudentModal: JQuery<HTMLDivElement> = $('#rejectStudent');
        rejectStudentModal.modal('hide');
      },
    },
  };
</script>
