<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="transactionDeleteModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Hapus Transaksi</h5>
          <button v-on:click="closeModal" type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda benar-benar ingin menghapus transaksi ini?</p>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="deleteTransaction" type="button" class="btn btn-danger">Yes</button>
          <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import moneviAxios from '@/api/configuration/monevi-axios';
  import type { MoneviParamsDeleteTransaction } from '@/api/model/monevi-config';
  import { MoneviPath } from '@/api/path/path';

  export default {
    props: {
      transaction: Object,
    },

    methods: {
      showModal() {
        var transactionDeleteModal: JQuery<HTMLDivElement> = $('#transactionDeleteModal');
        transactionDeleteModal.modal('show');
      },

      closeModal(event: Event) {
        var transactionDeleteModal: JQuery<HTMLDivElement> = $('#transactionDeleteModal');
        transactionDeleteModal.modal('hide');
      },

      deleteTransaction(event: Event) {
        var params = {} as MoneviParamsDeleteTransaction;
        if (this.transaction == undefined) {
          return;
        }
        params.transactionId = this.transaction.id;
        return moneviAxios
          .delete(MoneviPath.DELETE_TRANSACTION_PATH, {
            params: params,
            paramsSerializer: {
              indexes: null,
            },
          })
          .then((response) => {
            if (!(this.$refs.closeModalButton instanceof HTMLButtonElement)) {
              return;
            }
            this.$refs.closeModalButton.click();
            this.$emit('successUpdate');
          })
          .catch((error) => {
            alert('Internal server error, unable to delete transaction');
          });
      },
    },
  };
</script>
