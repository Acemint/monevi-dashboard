<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="transactionEditModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tambah Transaksi</h5>
          <button v-on:click="closeModal" type="button" class="close" data-dismiss="modal" aria-label="Close">
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
                <input v-model="amount" id="jumlah" type="text" class="form-control" name="jumlah" aria-label="Jumlah (dalam rupiah)" />
              </div>
            </div>

            <div class="form-group">
              <label class="col-form-label text-md-left">Bukti Transaksi*</label>
              <div class="mb-3">
                <input v-on:change="loadImage" class="form-control" type="file" id="formFile" /><br />
                <img ref="sample" src="#" id="buktiTransaksi" style="width: 100%" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
          <button v-on:click="editTransaction" type="button" class="btn btn-primary">Tambah Transaksi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import type { Transaction } from '@/api/model/monevi-model';

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
      transactionId: String,
    },

    methods: {
      initializeExistingValues(transaction: Transaction) {
        this.date = new Date(transaction.transactionDate).toISOString().substring(0, 10);
        var generalLedgerAccountType = MoneviDisplayFormatter.convertGeneralLedgerAccountTypeForDisplay(transaction.generalLedgerAccountType);
        if (generalLedgerAccountType != null) {
          this.generalLedgerAccountType = generalLedgerAccountType;
        }
        var transactionType = MoneviDisplayFormatter.convertTransactionTypeForDisplay(transaction.type);
        if (transactionType != null) {
          this.transactionType = transactionType;
        }
        var entryPosition = MoneviDisplayFormatter.convertEntryPositionForDisplay(transaction.entryPosition);
        if (entryPosition != null) {
          this.entryPosition = entryPosition;
        }
        this.transactionName = transaction.name;
        this.amount = transaction.amount;
        this.description = transaction.description;
        var imagePlaceholder: any = this.$refs.sample;
        if (imagePlaceholder instanceof HTMLImageElement) {
          imagePlaceholder.src = atob(transaction.proof);
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
        console.log(this.transactionId);
      },
    },
  };
</script>
