<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="transactionEditModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ubah Transaksi</h5>
          <button v-on:click="closeModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="tanggal">Tanggal*</label>
              <input v-model="date" id="tanggal" type="date" class="form-control" name="tanggal" />
              <div class="invalid-feedback"></div>
            </div>
            <div class="row">
              <div class="form-group col-6">
                <label>Dompet*</label>
                <select v-model="generalLedgerAccountType" class="form-control selectric">
                  <option>Bank</option>
                  <option>Kas</option>
                </select>
              </div>

              <div class="form-group col-6">
                <label>Jenis Transaksi*</label>
                <select v-model="entryPosition" class="form-control selectric">
                  <option>Debit</option>
                  <option>Kredit</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="transaksi">Transaksi*</label>
              <input v-model="transactionName" id="transaksi" type="text" class="form-control" name="transaksi" />
              <div class="invalid-feedback"></div>
            </div>

            <div class="form-group">
              <label>Kategori*</label>
              <select v-model="transactionType" class="form-control selectric">
                <option>Rutin</option>
                <option>Non Rutin</option>
              </select>
            </div>

            <div class="form-group">
              <label for="keterangan">Keterangan*</label>
              <input v-model="description" id="keterangan" type="text" class="form-control" name="keterangan" />
              <div class="invalid-feedback"></div>
            </div>

            <div class="form-group">
              <label for="jumlah">Jumlah*</label>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input
                  v-model="amount"
                  id="jumlah"
                  type="text"
                  class="form-control"
                  name="jumlah"
                  aria-label="Jumlah (dalam rupiah)" />
              </div>
            </div>

            <div class="form-group">
              <label class="col-form-label text-md-left">Bukti Transaksi*</label>
              <div class="mb-3">
                <input
                  v-on:change="loadImage"
                  class="form-control"
                  type="file"
                  id="formFile"
                  accept="image/gif, image/jpeg, image/png" /><br />
                <img ref="sample" src="#" style="width: 100%" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary">Tutup</button>
          <button v-on:click="editTransaction" type="button" class="btn btn-primary">Ubah</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { moneviAxios } from '@/api/configuration/monevi-axios';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import { MoneviPath } from '@/api/path/path';
  import type { MoneviBodyEditTransaction, MoneviParamsEditTransaction } from '@/api/model/monevi-config';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviEnumConverter } from '@/api/methods/monevi-enum-converter';

  export default {
    data: function () {
      return {
        date: '',
        generalLedgerAccountType: 'Bank',
        entryPosition: 'Debit',
        transactionName: '',
        transactionType: 'Non Rutin',
        description: '',
        amount: 0,
      };
    },

    props: {
      transaction: Object,
    },

    methods: {
      initializeExistingValues() {
        if (this.transaction == undefined) {
          return;
        }
        this.date = new Date(this.transaction.transactionDate).toISOString().substring(0, 10);
        var generalLedgerAccountType = MoneviDisplayFormatter.convertGeneralLedgerAccountTypeForDisplay(
          this.transaction.generalLedgerAccountType
        );
        if (generalLedgerAccountType != null) {
          this.generalLedgerAccountType = generalLedgerAccountType;
        }
        var transactionType = MoneviDisplayFormatter.convertTransactionTypeForDisplay(this.transaction.type);
        if (transactionType != null) {
          this.transactionType = transactionType;
        }
        var entryPosition = MoneviDisplayFormatter.convertEntryPositionForDisplay(this.transaction.entryPosition);
        if (entryPosition != null) {
          this.entryPosition = entryPosition;
        }
        this.transactionName = this.transaction.name;
        this.amount = this.transaction.amount;
        this.description = this.transaction.description;
        var imagePlaceholder: any = this.$refs.sample;
        if (imagePlaceholder instanceof HTMLImageElement) {
          imagePlaceholder.src = atob(this.transaction.proof);
        }
      },

      showModal() {
        var reportApproveModal: JQuery<HTMLDivElement> = $('#transactionEditModal');
        reportApproveModal.modal('show');
      },

      closeModal(event: Event) {
        var transactionDeleteModal: JQuery<HTMLDivElement> = $('#transactionDeleteModal');
        transactionDeleteModal.modal('hide');
      },

      loadImage(event: any) {
        if (event.target != null) {
          var files: FileList = event.target.files;
          var displayImage: any = this.$refs.sample;
          if (files.length != 0) {
            displayImage.src = URL.createObjectURL(files[0]);
          }
        }
      },

      async editTransaction() {
        var imageHTMLElement: any = this.$refs.sample;
        let blob = await fetch(imageHTMLElement.src).then((r) => r.blob());

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.addEventListener('load', () => {
          var params = {} as MoneviParamsEditTransaction;
          var body = {} as MoneviBodyEditTransaction;
          if (this.transaction == undefined) {
            return;
          }
          params.transactionId = this.transaction.id;
          body.name = this.transactionName;
          body.transactionDate = MoneviDateFormatter.formatDate(this.date);
          body.amount = this.amount;
          body.generalLedgerAccountType = MoneviEnumConverter.convertGeneralLedgerAccountType(
            this.generalLedgerAccountType
          );
          body.entryPosition = MoneviEnumConverter.convertEntryPosition(this.entryPosition);
          body.type = MoneviEnumConverter.convertTransactionType(this.transactionType);
          body.description = this.description;
          body.proof = reader.result;
          return moneviAxios
            .put(MoneviPath.EDIT_TRANSACTION_PATH, body, { params: params })
            .then((response) => {
              alert('Success in updating transaction');
              URL.revokeObjectURL(imageHTMLElement.src);
              if (!(this.$refs.closeModalButton instanceof HTMLButtonElement)) {
                return;
              }
              this.$refs.closeModalButton.click();
              this.$emit('successUpdate');
            })
            .catch((error) => {
              alert('Failed to update transaction');
            });
        });
      },
    },
  };
</script>
