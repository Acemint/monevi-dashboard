<template>
  <template v-if="role === 'ROLE_TREASURER'">
    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="reportApproveModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Kirim Laporan</h5>
            <button type="button" class="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Apakah Anda ingin menerima laporan ini kepada ketua?</p>
          </div>
          <div class="modal-footer bg-whitesmoke br">
            <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary">
              Tutup
            </button>
            <button v-on:click="approveReport" type="button" class="btn btn-primary">Ya</button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <template v-else-if="role === 'ROLE_CHAIRMAN'">
    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="reportApproveModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Setujui Laporan</h5>
            <button type="button" class="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Apakah Anda ingin menyetujui laporan ini dan mengirimkannya ke pengawas?</p>
          </div>
          <div class="modal-footer bg-whitesmoke br">
            <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary">
              Tutup
            </button>
            <button v-on:click="approveReport" type="button" class="btn btn-primary">Ya</button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <template v-else-if="role === 'ROLE_SUPERVISOR'">
    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="reportApproveModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Setujui Laporan</h5>
            <button type="button" class="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Apakah Anda ingin menyetujui laporan ini?</p>
          </div>
          <div class="modal-footer bg-whitesmoke br">
            <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary">
              Tutup
            </button>
            <button v-on:click="approveReport" type="button" class="btn btn-primary">Ya</button>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts">
  import { moneviAxios } from '@/api/configuration/monevi-axios';
  import type { MoneviBodyRejectReport } from '@/api/model/monevi-config';
  import { MoneviPath } from '@/api/path/path';

  export default {
    props: {
      reportId: String,
      userId: String,
      role: String,
    },

    methods: {
      async approveReport(event: Event) {
        var body = {} as MoneviBodyRejectReport;
        if (this.reportId == null || this.userId == null) {
          return;
        }
        body.reportId = this.reportId;
        body.userId = this.userId;
        return await moneviAxios
          .post(MoneviPath.APPROVE_REPORT_PATH, body)
          .then((response) => {
            if (this.role == 'ROLE_CHAIRMAN') {
              alert('Berhasil mengirim laporan');
            } else if (this.role == 'ROLE_TREASURER') {
              alert('Berhasil mengirim laporan');
            } else if (this.role == 'ROLE_SUPERVISOR') {
              alert('Berhasil menyetujui laporan');
            }
            if (this.$refs.closeModalButton instanceof HTMLButtonElement) {
              this.$refs.closeModalButton.click();
            }
            this.$emit('successUpdate');
            return;
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

      closeModal() {
        var reportApproveModal: JQuery<HTMLDivElement> = $('#reportApproveModal');
        reportApproveModal.modal('hide');
      },
    },
  };
</script>
