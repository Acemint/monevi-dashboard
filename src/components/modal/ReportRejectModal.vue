<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="rejectReportModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tolak Laporan</h5>
          <button type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Alasan Penolakan</label>
            <textarea v-model="comment" class="form-control"></textarea>
          </div>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary">Tutup</button>
          <button v-on:click="rejectReport" type="button" class="btn btn-danger">Tolak Laporan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import moneviAxios from '@/api/configuration/monevi-axios';
  import type { MoneviBodyRejectReport } from '@/api/model/monevi-config';
  import { MoneviPath } from '@/api/path/path';

  export default {
    props: {
      reportId: String,
      userId: String,
    },

    data: function () {
      return {
        comment: '',
      };
    },

    methods: {
      rejectReport(event: Event) {
        var body = {} as MoneviBodyRejectReport;
        if (this.reportId == null || this.userId == null || this.comment == '') {
          return;
        }
        body.reportId = this.reportId;
        body.userId = this.userId;
        body.comment = this.comment;
        console.log(body);
        return moneviAxios
          .post(MoneviPath.REJECT_REPORT_PATH, body)
          .then((response) => {
            alert('Successfully reject report');
            if (this.$refs.closeModalButton instanceof HTMLButtonElement) {
              this.$refs.closeModalButton.click();
            }
            this.$emit('successUpdate');
          })
          .catch((error) => {
            alert('Failed to reject report');
            if (this.$refs.closeModalButton instanceof HTMLButtonElement) {
              this.$refs.closeModalButton.click();
            }
          });
      },

      showModal() {
        var rejectReportModal: JQuery<HTMLDivElement> = $('#rejectReportModal');
        rejectReportModal.modal('show');
      },

      closeModal(event: Event) {
        var rejectReportModal: JQuery<HTMLDivElement> = $('#rejectReportModal');
        rejectReportModal.modal('hide');
      },
    },
  };
</script>
