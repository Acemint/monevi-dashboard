<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="transactionSendModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Buat Laporan</h5>
          <button v-on:click="closeModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda benar-benar ingin membuat laporan dari transaksi yang ada?</p>
          <form>
            <div class="form-group">
              <label for="jumlah">Opname Kas*</label>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input
                  v-model.number="cashOpname"
                  id="jumlah"
                  type="number"
                  class="form-control"
                  name="jumlah"
                  aria-label="Jumlah (dalam rupiah)" />
              </div>
            </div>
            <div class="form-group">
              <label for="jumlah">Opname Bank</label>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input
                  v-model.number="bankOpname"
                  id="jumlah"
                  type="number"
                  class="form-control"
                  name="jumlah"
                  aria-label="Jumlah (dalam rupiah)" />
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer bg-whitesmoke br">
          <button
            v-on:click="closeModal"
            ref="closeModalButton"
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal">
            Cancel
          </button>
          <button v-on:click="sendReport" type="button" class="btn btn-primary">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { moneviAxios } from '@/api/configuration/monevi-axios';
  import type { MoneviBodySubmitReport } from '@/api/model/monevi-config';
  import { MoneviPath } from '@/api/path/path';
  import { FrontendRouteName } from '@/constants/path';

  export default {
    props: {
      date: String,
      organizationRegionId: String,
      userId: String,
    },

    data: function () {
      return {
        bankOpname: '',
        cashOpname: '',
      };
    },

    methods: {
      showModal() {
        this.initData();
        var transactionSendModal: JQuery<HTMLDivElement> = $('#transactionSendModal');
        transactionSendModal.modal('show');
      },

      closeModal(event: Event) {
        var transactionSendModal: JQuery<HTMLDivElement> = $('#transactionSendModal');
        transactionSendModal.modal('hide');
      },

      initData() {
        this.bankOpname = '';
        this.cashOpname = '';
      },

      sendReport() {
        var body = {} as MoneviBodySubmitReport;
        body.userId = this.userId!;
        body.date = this.date!;
        body.organizationRegionId = this.organizationRegionId!;
        body.opnameData = { BANK: parseFloat(this.bankOpname), CASH: parseFloat(this.cashOpname) };
        moneviAxios
          .post(MoneviPath.SUBMIT_REPORT_PATH, body)
          .then((response) => {
            alert('Berhasil membuat laporan');
            if (!(this.$refs.closeModalButton instanceof HTMLButtonElement)) {
              return;
            }
            this.$refs.closeModalButton.click();
            this.$router.push({ name: FrontendRouteName.Report.DETAILS });
          })
          .catch((error) => {
            for (const key in error.response.data.errorFields) {
              var errorMessage = error.response.data.errorFields[key];
              alert(errorMessage);
              break;
            }
          });
      },
    },
  };
</script>
