<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Transaksi</h1>
      <div style="display: flex">
        <div class="section-header-button">
          <MonthNavigator v-on:period-change="updateDate" />
        </div>
      </div>
    </div>

    <template v-if="date == 'N/A'">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <p>
                Data transaksi tidak dapat dilihat dikarenakan belum ada laporan yang dikirim oleh Bendahara
                {{ organizationRegion.organizationName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <TransactionGeneralData
        v-bind:transactions="transactions"
        v-bind:organizationRegionId="organizationRegion.id"
        v-bind:date="date" />
      <TransactionFilter v-on:filter-change="getTransactions" />

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped table-bordered" id="table-1">
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
                  <tr v-for="(item, index) in transactions" ref="transactionsDisplay">
                    <td>{{ index + 1 }}</td>
                    <td>{{ formatTransactionDate(item.transactionDate) }}</td>
                    <td>{{ formatGeneralLedgerAccountType(item.generalLedgerAccountType) }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ formatTransactionType(item.type) }}</td>
                    <td>{{ item.description }}</td>
                    <td v-bind:class="[item.entryPosition == 'CREDIT' ? 'text-danger' : 'text-primary']">
                      {{ formatRupiah(item.amount, item.entryPosition) }}
                    </td>
                    <td>
                      <img
                        v-on:click="openImageModal"
                        id="buktiTransaksi"
                        v-bind:src="formatProof(item.proof)"
                        onerror="this.style.display = 'none'"
                        v-bind:data-index="index" />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>

  <ImageModal ref="imageModal" v-bind:imageSrc="imageSrc" />
</template>

<script lang="ts">
  import { MoneviOrganizationRegion, Transaction } from '@/api/model/monevi-model';
  import TransactionGeneralData from '@/components/content/row/TransactionGeneralData.vue';
  import TransactionFilter from '@/components/content/row/TransactionFilter.vue';
  import MonthNavigator from '@/components/navigator/MonthNavigator.vue';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import ImageModal from '@/components/modal/ImageModal.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
  import { transactionApi } from '@/api/service/transaction-api';
  import { organizationRegionApi } from '@/api/service/organization-region-api';

  export default {
    data: function () {
      return {
        transactions: new Array<Transaction>(),
        imageSrc: '',
        organizationRegion: new MoneviOrganizationRegion(),
        date: 'N/A',
      };
    },

    methods: {
      async updateDate(date: string): Promise<void> {
        let userData = MoneviCookieHandler.getUserData();

        this.date = date;
        this.transactions = await transactionApi.getTransactions(userData.organizationRegionId, this.date);
        this.organizationRegion = await organizationRegionApi.getOrganization(userData.organizationRegionId);
        return;
      },

      async getTransactions(generalLedgerAccount: string, entryPosition: string, type: string): Promise<void> {
        this.transactions = await transactionApi.getTransactions(
          this.organizationRegion.id,
          this.date,
          generalLedgerAccount,
          entryPosition,
          type
        );
      },

      formatProof(proof: any) {
        return atob(proof);
      },

      formatGeneralLedgerAccountType(generalLedgerAccountType: string) {
        return MoneviDisplayFormatter.convertGeneralLedgerAccountTypeForDisplay(generalLedgerAccountType);
      },

      formatRupiah(amount: number, entryPosition: string = 'DEBIT') {
        return MoneviDisplayFormatter.toRupiah(
          MoneviDisplayFormatter.determineNumberByPositionType(amount, entryPosition)
        );
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

      openImageModal(event: any) {
        var index = parseInt(event.currentTarget.getAttribute('data-index'));
        this.imageSrc = this.transactions[index].proof;
        this.$nextTick(() => {
          var imageModal: any = this.$refs.imageModal;
          imageModal.showModal();
        });
      },
    },

    components: {
      ImageModal,
      MonthNavigator,
      TransactionGeneralData,
      TransactionFilter,
    },
  };
</script>
