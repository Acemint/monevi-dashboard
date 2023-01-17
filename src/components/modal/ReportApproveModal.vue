<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="reportApproveModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Terima Laporan</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda benar-benar ingin menerima laporan ini?</p>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button ref="closeModalButton" type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
          <button v-on:click="approveReport" type="button" class="btn btn-primary">Terima Laporan</button>
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
    methods: {
      approveReport(event: Event) {
        var body = {} as MoneviBodyRejectReport;
        if (this.reportId == null) {
          return;
        }
        if (this.userId == null) {
          return;
        }
        body.reportId = this.reportId;
        body.userId = this.userId;
        return moneviAxios
          .post(MoneviPath.APPROVE_REPORT_PATH, body)
          .then((response) => {
            alert('Successfully approve report');
            if (this.$refs.closeModalButton instanceof HTMLButtonElement) {
              this.$refs.closeModalButton.click();
            }
          })
          .catch((error) => {
            alert('Failed to approve report');
            if (this.$refs.closeModalButton instanceof HTMLButtonElement) {
              this.$refs.closeModalButton.click();
            }
          });
      },
      showModal() {
        var reportApproveModal: JQuery<HTMLDivElement> = $('#reportApproveModal');
        reportApproveModal.modal('show');
      },
    },
  };
</script>
