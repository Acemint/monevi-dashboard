<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="transactionSendModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Kirim Laporan</h5>
          <button v-on:click="closeModal" type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda benar-benar ingin mengirim laporan ini?</p>
          <form>
            <div class="form-group">
              <label for="jumlah">Opname Kas*</label>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input v-model="cashOpname" id="jumlah" type="text" class="form-control" name="jumlah" aria-label="Jumlah (dalam rupiah)" />
              </div>
            </div>
            <div class="form-group">
              <label for="jumlah">Opname Bank</label>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input v-model="bankOpname" id="jumlah" type="text" class="form-control" name="jumlah" aria-label="Jumlah (dalam rupiah)" />
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="sendReport" type="button" class="btn btn-danger">Yes</button>
          <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import moneviAxios from '@/api/configuration/monevi-axios';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import type { MoneviBodySubmitReport } from '@/api/model/monevi-config';
  import { MoneviPath } from '@/api/path/path';
  import { FrontendRouteName } from '@/constants/path';

  export default {
    props: {
      date: String,
      organizationRegionId: String,
    },

    data: function () {
      return {
        bankOpname: 0,
        cashOpname: 0,
      };
    },

    methods: {
      showModal() {
        var transactionSendModal: JQuery<HTMLDivElement> = $('#transactionSendModal');
        transactionSendModal.modal('show');
      },

      closeModal(event: Event) {
        var transactionSendModal: JQuery<HTMLDivElement> = $('#transactionSendModal');
        transactionSendModal.modal('hide');
      },

      sendReport() {
        var body = {} as MoneviBodySubmitReport;
        if (this.date == undefined) {
          console.error('internal server error, period is not found');
          return;
        }
        body.date = this.date;
        if (this.organizationRegionId == undefined) {
          console.error('internal server error, organization region id is not found');
          return;
        }
        body.organizationRegionId = this.organizationRegionId;
        body.opnameData = { BANK: this.bankOpname, CASH: this.cashOpname };
        moneviAxios
          .post(MoneviPath.SUBMIT_REPORT_PATH, body)
          .then((response) => {
            alert('Berhasil mengirim laporan');
            if (!(this.$refs.closeModalButton instanceof HTMLButtonElement)) {
              return;
            }
            this.$refs.closeModalButton.click();
            this.$router.push({ name: FrontendRouteName.Report.DETAILS, query: { period: MoneviDateFormatter.formatDateDMYToMonthAndYear(this.date) } });
          })
          .catch((error) => {
            for (const key in error.response.data.errorFields) {
              var errorMessage = error.response.data.errorFields[key];
              alert(errorMessage);
              break;
            }
            console.error('Internal Server Error, Unable to Submit Report');
          });
      },
    },
  };
</script>
