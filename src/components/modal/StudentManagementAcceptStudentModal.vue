<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="acceptStudent">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Terima Pengurus</h5>
          <button v-on:click="closeModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda benar-benar ingin menerima pengurus ini?</p>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="accept" type="button" class="btn btn-danger">Yes</button>
          <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { moneviAxios } from '@/api/configuration/monevi-axios';
  import type { MoneviParamsAcceptStudent } from '@/api/model/monevi-config';
  import { MoneviPath } from '@/api/path/path';
  import StudentManagementContent from '../content/StudentManagementContent.vue';

  export default {
    props: {
      studentId: String,
    },

    methods: {
      accept() {
        var params = {} as MoneviParamsAcceptStudent;
        if (this.studentId == null) {
          console.error('Internal server error, studentId is not found');
          return;
        }
        params.studentId = this.studentId;
        return moneviAxios
          .post(MoneviPath.APPROVE_STUDENT_PATH, null, {
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
            alert('internal server error, unable to accept student');
          });
      },

      showModal() {
        var acceptStudentModal: JQuery<HTMLDivElement> = $('#acceptStudent');
        acceptStudentModal.modal('show');
      },

      closeModal(event: Event) {
        var acceptStudentModal: JQuery<HTMLDivElement> = $('#acceptStudent');
        acceptStudentModal.modal('hide');
      },
    },
  };
</script>
