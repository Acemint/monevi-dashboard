<template>
  <div class="modal fade bd-example-modal-xl" tabindex="-1" role="dialog" id="transactionAddBulkRequestImageModal">
    <div class="modal-dialog modal-lg" style="width: 1600px" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Impor Transaksi</h5>
          <button type="button" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <template v-if="processedTransactions?.length != 0">
          <div class="modal-body">
            <div class="table-responsive">
              <table class="table table-striped table-bordered" id="table-1">
                <tbody>
                  <tr>
                    <th class="sorting" tabindex="0">No</th>
                    <th>Tanggal</th>
                    <th>Dompet</th>
                    <th>Transaksi</th>
                    <th>Kategori</th>
                    <th>Keterangan</th>
                    <th>Jumlah</th>
                    <th>Bukti Transaksi</th>
                  </tr>
                  <template v-for="(item, index) in processedTransactions">
                    <tr ref="transactionsDisplay">
                      <td>{{ index + 1 }}</td>
                      <td>{{ formatTransactionDate(item.transactionDate) }}</td>
                      <td>{{ formatGeneralLedgerAccountType(item.generalLedgerAccountType) }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ formatTransactionType(item.type) }}</td>
                      <td>{{ item.description }}</td>
                      <td v-bind:class="[item.entryPosition == 'CREDIT' ? 'text-danger' : 'text-primary']">{{ formatRupiah(item.amount, item.entryPosition) }}</td>
                      <td style="min-width: 245px">
                        <div class="mb-3">
                          <label class="col-form-label text-md-left"></label>
                          <input v-on:change="loadImage" class="form-control" type="file" id="formFile" v-bind:data-index="index" />
                          <br />
                        </div>
                        <img v-on:click="openImageModal" v-bind:src="item.proof" onerror="this.style.display = 'none'" v-bind:data-index="index" style="width: 100%" />
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer bg-whitesmoke br">
            <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary">Tutup</button>
            <button v-on:click="submitTransaction" type="button" class="btn btn-primary">Impor Transaksi</button>
          </div>
        </template>
      </div>
    </div>
  </div>

  <ImageModal ref="imageModal" v-bind:imageSrc="currentImageSrc" />
</template>

<script lang="ts">
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import type { Transaction } from '@/api/model/monevi-model';
  import ImageModal from '@/components/modal/ImageModal.vue';
  import { transactionApi } from '@/api/service/transaction-api';
  import type { MoneviBodyCreateTransaction } from '@/api/model/monevi-config';

  export default {
    props: {
      processedTransactions: Array<Transaction>,
      organizationRegionId: String,
    },

    data: function () {
      return {
        inputFile: undefined,
        currentImageSrc: '',
      };
    },

    methods: {
      showModal() {
        var transactionAddBulkRequestImageModal: JQuery<HTMLDivElement> = $('#transactionAddBulkRequestImageModal');
        transactionAddBulkRequestImageModal.modal('show');
      },

      closeModal(event: Event) {
        var transactionAddBulkRequestImageModal: JQuery<HTMLDivElement> = $('#transactionAddBulkRequestImageModal');
        transactionAddBulkRequestImageModal.modal('hide');
      },

      async loadImage(event: any) {
        var index: number = parseInt(event.currentTarget.getAttribute('data-index'));
        var transactionData: any = this.processedTransactions![index];

        var files: FileList = event.target.files;
        if (files.length == 0) {
          return;
        }
        var image = URL.createObjectURL(files[0]);
        let blob = await fetch(image).then((r) => r.blob());
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.addEventListener('load', () => {
          transactionData.proof = reader.result;
        });
      },

      async submitTransaction(event: Event) {
        if (!this.validateImagesComplete()) {
          return;
        }
        var transactionRequests = this.generateTransactionRequest();
        await transactionApi.addTransaction(transactionRequests).catch((error) => {
          for (const key in error.response.data.errorFields) {
            var errorMessage = error.response.data.errorFields[key];
            alert(errorMessage);
            break;
          }
        });
        var closeModalButton: any = this.$refs.closeModalButton;
        closeModalButton.click();
        this.$emit('successUpdate');
      },

      validateImagesComplete(): boolean {
        for (var transaction of this.processedTransactions!) {
          if (transaction.proof == null) {
            alert('Mohon pastikan bahwa semua gambar sudah dimasukkan');
            return false;
          }
        }
        return true;
      },

      generateTransactionRequest() {
        var transactionRequests = new Array<MoneviBodyCreateTransaction>();
        for (var transaction of this.processedTransactions!) {
          var transactionRequest = {} as MoneviBodyCreateTransaction;
          transactionRequest.organizationRegionId = this.organizationRegionId!;
          transactionRequest.name = transaction.name;
          transactionRequest.transactionDate = MoneviDateFormatter.formatDate(transaction.transactionDate);
          transactionRequest.amount = transaction.amount;
          transactionRequest.generalLedgerAccountType = transaction.generalLedgerAccountType;
          transactionRequest.entryPosition = transaction.entryPosition;
          transactionRequest.type = transaction.type;
          transactionRequest.description = transaction.description;
          transactionRequest.proof = transaction.proof;

          transactionRequests.push(transactionRequest);
        }
        console.log(transactionRequests);
        return transactionRequests;
      },

      openImageModal(event: any) {
        var index = parseInt(event.currentTarget.getAttribute('data-index'));
        var imageProof: any = this.processedTransactions![index].proof;
        this.currentImageSrc = imageProof;
        this.$nextTick(() => {
          var imageModal: any = this.$refs.imageModal;
          imageModal.showModal();
        });
      },

      formatGeneralLedgerAccountType(generalLedgerAccountType: string) {
        return MoneviDisplayFormatter.convertGeneralLedgerAccountTypeForDisplay(generalLedgerAccountType);
      },

      formatRupiah(amount: number, entryPosition: string = 'DEBIT') {
        return MoneviDisplayFormatter.toRupiah(MoneviDisplayFormatter.determineNumberByPositionType(amount, entryPosition));
      },

      formatTransactionDate(dateInMillis: number) {
        return MoneviDateFormatter.formatDate(dateInMillis);
      },

      formatTransactionType(transactionType: string) {
        return MoneviDisplayFormatter.convertTransactionTypeForDisplay(transactionType);
      },

      formatDateToMonth(date: string) {
        return MoneviDateFormatter.formatDateDMYToMonthAndYear(date);
      },

      formatMonthToDate(date: string): string {
        return MoneviDateFormatter.formatMonthAndYearToDateDMY(date);
      },
    },
    components: { ImageModal },
  };
</script>
