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
                  v-model.number="amount"
                  id="jumlah"
                  type="number"
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
                <img v-if="imageSrc != ''" v-bind:src="imageSrc" style="width: 100%" />
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
        amount: '',
        imageSrc: '' as any,
      };
    },

    props: {
      transaction: Object,
    },

    watch: {
      date(newDate, oldDate) {
        var tzOffset = new Date().getTimezoneOffset() * 60000;
        if (Date.now() - tzOffset < new Date(newDate).getTime()) {
          alert('Tidak bisa memasukkan tanggal yang melewati hari ini');
          this.date = '';
        }
      },
    },

    methods: {
      initializeExistingValues() {
        if (this.transaction == undefined) {
          return;
        }
        var tzoffset = new Date().getTimezoneOffset() * 60000;
        this.date = new Date(this.transaction.transactionDate - tzoffset).toISOString().substring(0, 10);
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
        this.imageSrc = atob(this.transaction.proof);
      },

      showModal() {
        var reportApproveModal: JQuery<HTMLDivElement> = $('#transactionEditModal');
        reportApproveModal.modal('show');
      },

      closeModal(event: Event) {
        var transactionDeleteModal: JQuery<HTMLDivElement> = $('#transactionEditModal');
        transactionDeleteModal.modal('hide');
      },

      loadImage(event: any) {
        var files: FileList = event.target.files;
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.addEventListener('load', () => {
          this.imageSrc = reader.result;
        });
      },

      async editTransaction() {
        if (this.imageSrc == '') {
          alert('Bukti transaksi diperlukan');
          return;
        }
        if (parseFloat(this.amount) <= 0) {
          alert('Angka tidak boleh lebih kecil dibanding 1');
          return;
        }
        if (this.transactionName.length <= 3) {
          alert('Panjang nama transaksi harus melebihi 3 huruf');
          return;
        }

        var params = {} as MoneviParamsEditTransaction;
        var body = {} as MoneviBodyEditTransaction;
        params.transactionId = this.transaction!.id;
        body.name = this.transactionName;
        body.transactionDate = MoneviDateFormatter.formatDate(this.date);
        body.amount = parseFloat(this.amount);
        body.generalLedgerAccountType = MoneviEnumConverter.convertGeneralLedgerAccountType(
          this.generalLedgerAccountType
        );
        body.entryPosition = MoneviEnumConverter.convertEntryPosition(this.entryPosition);
        body.type = MoneviEnumConverter.convertTransactionType(this.transactionType);
        body.description = this.description == undefined ? '' : this.description;
        body.proof = this.imageSrc;

        return await moneviAxios
          .put(MoneviPath.EDIT_TRANSACTION_PATH, body, { params: params })
          .then((response) => {
            alert('Sukses mengubah transaksi');
            var closeModalButton: any = this.$refs.closeModalButton;
            closeModalButton.click();
            this.$emit('successUpdate');
          })
          .catch((error) => {
            alert('Gagal mengubah transaksi');
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
