<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="transactionAddBulkModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Impor Transaksi</h5>
          <button v-on:click="closeModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Seret dan lepaskan file .xlsx atau unggah dari komputer Anda.</p>
          <div class="mb-3">
            <label for="formFile" class="form-label">
              File Anda setidaknya harus berisi tanggal, dompet, jenis transaksi, transaksi, kategori, dan jumlah.
              Ukuran file maksimum adalah 2 MB.
            </label>
            <input
              ref="inputFile"
              v-on:change="loadFile"
              class="form-control"
              type="file"
              id="formFile"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
          </div>
          <p>
            Berikut
            <a download v-bind:href="xlsxFile">file contoh</a>
            template untuk impor transaksi.
          </p>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button
            v-on:click="closeModal"
            ref="closeModalButton"
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal">
            Tutup
          </button>
          <button v-on:click="sendReport" type="button" class="btn btn-primary">Tambah Transaksi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { transactionApi } from '@/api/service/transaction-api';

  export default {
    props: {
      organizationRegionId: String,
    },

    emits: ['newBulkTransactions'],

    data: function () {
      return {
        inputFile: undefined,
        xlsxFile: new URL('@/template/monevi_template_bulk_add_transaction.xlsx', import.meta.url).href,
      };
    },

    methods: {
      showModal() {
        var transactionAddBulkModal: JQuery<HTMLDivElement> = $('#transactionAddBulkModal');
        transactionAddBulkModal.modal('show');
      },

      closeModal(event: Event) {
        var transactionAddBulkModal: JQuery<HTMLDivElement> = $('#transactionAddBulkModal');
        transactionAddBulkModal.modal('hide');
      },

      loadFile(event: any) {
        this.inputFile = event.target.files[0];
      },

      async sendReport(event: Event) {
        if (this.inputFile == undefined) {
          alert('File should not be empty');
        }
        var data = await transactionApi
          .convertExcel(this.organizationRegionId!, this.inputFile!)
          .then((response) => {
            return response.data.value;
          })
          .catch((error) => {
            for (const key in error.response.data.errorFields) {
              var errorMessage = error.response.data.errorFields[key];
              alert(errorMessage);

              // Reset input file
              const inputFile: any = this.$refs.inputFile;
              inputFile.value = '';
              return;
            }
          });
        // alert about some unprocessed data
        if (data.skippedRow != 0) {
          const message = `Terdapat ${
            data.skippedRow
          } baris yang tidak dapat diproses oleh sistem. Baris terletak di ${data.skippedRowList.toString()}`;
          alert(message);
        }

        var closeModalButton: any = this.$refs.closeModalButton;
        closeModalButton.click();

        var processedTransactions: Array<any> = data.processedTransaction;
        this.$emit('newBulkTransactions', processedTransactions);
        return;
      },
    },
  };
</script>
