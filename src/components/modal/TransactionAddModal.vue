<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="transactionAddModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tambah Transaksi</h5>
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
              <label for="keterangan">Keterangan</label>
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
                <img v-if="imageSrc != '#'" v-bind:src="imageSrc" ref="sample" style="width: 100%" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary">Tutup</button>
          <button v-on:click="submitTransaction" type="button" class="btn btn-primary">Tambah Transaksi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { MoneviPath } from '@/api/path/path';
  import type { MoneviBodyCreateTransaction } from '@/api/model/monevi-config';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviEnumConverter } from '@/api/methods/monevi-enum-converter';
  import { moneviAxios } from '@/api/configuration/monevi-axios';

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
        imageSrc: '#',
      };
    },

    props: {
      organizationRegionId: String,
    },

    methods: {
      showModal() {
        this.clearData();
        var transactionAddModal: JQuery<HTMLDivElement> = $('#transactionAddModal');
        transactionAddModal.modal('show');
      },

      closeModal(event: Event) {
        var transactionDeleteModal: JQuery<HTMLDivElement> = $('#transactionAddModal');
        transactionDeleteModal.modal('hide');
      },

      clearData() {
        this.date = '';
        this.generalLedgerAccountType = 'Bank';
        this.entryPosition = 'Debit';
        this.transactionName = '';
        this.transactionType = 'Non Rutin';
        this.description = '';
        this.amount = 0;
        this.imageSrc = '#';
      },

      loadImage(event: any) {
        if (event.target != null) {
          var files: FileList = event.target.files;
          if (files.length != 0) {
            this.imageSrc = URL.createObjectURL(files[0]);
          }
        }
      },

      async submitTransaction() {
        let blob = await fetch(this.imageSrc).then((r) => r.blob());

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.addEventListener('load', () => {
          var body = {} as MoneviBodyCreateTransaction;
          if (this.organizationRegionId == undefined) {
            console.error('Organization is not defined');
            return;
          }
          body.organizationRegionId = this.organizationRegionId;
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
            .post(MoneviPath.CREATE_NEW_TRANSACTION_PATH, new Array<MoneviBodyCreateTransaction>(body))
            .then((response) => {
              alert('success in creating transaction');
              URL.revokeObjectURL(this.imageSrc);
              this.imageSrc = '#';
              if (!(this.$refs.closeModalButton instanceof HTMLButtonElement)) {
                return;
              }
              this.$refs.closeModalButton.click();
              this.$emit('successUpdate');
              this.resetData();
            })
            .catch((error) => {
              for (const key in error.response.data.errorFields) {
                var errorMessage = error.response.data.errorFields[key];
                alert(errorMessage);
                break;
              }
            });
        });
      },

      resetData() {
        (this.date = 'NaN/NaN/NaN'),
          (this.generalLedgerAccountType = 'Bank'),
          (this.entryPosition = 'Debit'),
          (this.transactionName = ''),
          (this.transactionType = 'Non Rutin'),
          (this.description = ''),
          (this.amount = 0),
          (this.imageSrc = '#');
      },
    },
  };
</script>
