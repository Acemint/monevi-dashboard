<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Transaksi</h1>
      <div style="display: flex">
        <div class="section-header-button">
          <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            Tambah Transaksi
          </button>
          <div class="dropdown-menu">
            <a v-on:click="openTransactionAddModal" class="dropdown-item">Tambah Transaksi</a>
            <a v-on:click="openTransactionAddBulkModal" class="dropdown-item">Impor</a>
          </div>
        </div>
        <div class="section-header-button">
          <MonthNavigator v-on:period-change="updateDate" />
        </div>
      </div>
    </div>

    <template v-if="date != 'N/A'">
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
                      <th>Aksi</th>
                    </tr>
                    <template v-for="(item, index) in transactions">
                      <tr ref="transactionsDisplay">
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
                        <td>
                          <button
                            v-bind:class="[
                              !isCurrentMonthReportSent(currentMonthReports) ? '' : 'disabled',
                              'btn btn-primary',
                            ]"
                            v-bind:data-index="index"
                            v-on:click="openTransactionEditModal($event)">
                            <i style="pointer-events: none" class="far fa-edit"></i>
                          </button>
                          <button
                            v-bind:class="[
                              !isCurrentMonthReportSent(currentMonthReports) ? '' : 'disabled',
                              'btn btn-danger',
                            ]"
                            v-bind:data-index="index"
                            v-on:click="openTransactionDeleteModal($event)">
                            <i style="pointer-events: none" class="far fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="card-footer text-right">
              <button
                v-on:click="openTransactionSendModal"
                v-if="!isCurrentMonthReportSent(currentMonthReports)"
                type="button"
                class="btn btn-primary">
                Buat Laporan
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>

  <ImageModal ref="imageModal" v-bind:imageSrc="imageSrc" />
  <TransactionAddModal
    ref="transactionAddModal"
    v-bind:organizationRegionId="organizationRegion.id"
    v-on:success-update="initData" />
  <TransactionEditModal
    ref="transactionEditModal"
    v-bind:transaction="currentlySelectedTransaction"
    v-on:success-update="initData" />
  <TransactionDeleteModal
    ref="transactionDeleteModal"
    v-bind:transaction="currentlySelectedTransaction"
    v-on:success-update="initData" />
  <TransactionSendModal
    ref="transactionSendModal"
    v-bind:organizationRegionId="organizationRegion.id"
    v-bind:userId="userAccount.id"
    v-bind:date="date" />
  <TransactionAddBulkModal
    ref="transactionAddBulkModal"
    v-on:new-bulk-transactions="openTransactionAddBulkRequestImageModal"
    v-bind:organizationRegionId="organizationRegion.id" />
  <TransactionAddBulkRequestImageModal
    ref="transactionAddBulkRequestModal"
    v-bind:processedTransactions="processedTransactions"
    v-bind:organizationRegionId="organizationRegion.id"
    v-on:success-update="initData" />
</template>

<script lang="ts">
  import { MoneviOrganizationRegion, Transaction } from '@/api/model/monevi-model';
  import TransactionGeneralData from '@/components/content/row/TransactionGeneralData.vue';
  import TransactionFilter from '@/components/content/row/TransactionFilter.vue';
  import TransactionAddModal from '@/components/modal/TransactionAddModal.vue';
  import TransactionEditModal from '@/components/modal/TransactionEditModal.vue';
  import TransactionDeleteModal from '@/components/modal/TransactionDeleteModal.vue';
  import TransactionSendModal from '@/components/modal/TransactionSendModal.vue';
  import TransactionAddBulkModal from '@/components/modal/TransactionAddBulkModal.vue';
  import MonthNavigator from '@/components/navigator/MonthNavigator.vue';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import ImageModal from '@/components/modal/ImageModal.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
  import { transactionApi } from '@/api/service/transaction-api';
  import { organizationRegionApi } from '@/api/service/organization-region-api';
  import { reportApi } from '@/api/service/report-api';
  import TransactionAddBulkRequestImageModal from '@/components/modal/TransactionAddBulkRequestImageModal.vue';

  export default {
    data: function () {
      return {
        transactions: new Array<Transaction>(),
        currentlySelectedTransaction: new Transaction(),
        currentMonthReports: [],
        imageSrc: '',
        organizationRegion: new MoneviOrganizationRegion(),
        date: 'N/A',
        userAccount: MoneviCookieHandler.getUserData(),
        processedTransactions: new Array<any>(),
      };
    },

    methods: {
      async updateDate(date: string): Promise<void> {
        this.date = date;
        await this.initData();
        return;
      },

      async initData() {
        this.currentMonthReports = await reportApi.getReports(this.userAccount.organizationRegionId, this.date);
        this.transactions = await transactionApi.getTransactions(this.userAccount.organizationRegionId, this.date);
        this.organizationRegion = await organizationRegionApi.getOrganization(this.userAccount.organizationRegionId);
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

      isCurrentMonthReportSent(currentMonthReports: any): boolean {
        if (currentMonthReports == undefined || currentMonthReports.length == 0) {
          return false;
        }
        if (currentMonthReports[0].status == 'NOT_SENT') {
          return false;
        }
        return true;
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
        var index: any = parseInt(event.currentTarget.getAttribute('data-index'));
        this.imageSrc = this.transactions[index].proof;
        this.$nextTick(() => {
          var imageModal: any = this.$refs.imageModal;
          imageModal.showModal();
        });
      },

      openTransactionAddModal(event: Event) {
        var transactionAddModal: any = this.$refs.transactionAddModal;
        transactionAddModal.showModal();
      },

      openTransactionAddBulkModal(event: Event) {
        var transactionAddBulkModal: any = this.$refs.transactionAddBulkModal;
        transactionAddBulkModal.showModal();
      },

      openTransactionAddBulkRequestImageModal(processedTransactions: any) {
        this.processedTransactions = processedTransactions;
        var transactionAddBulkRequestModal: any = this.$refs.transactionAddBulkRequestModal;
        transactionAddBulkRequestModal.showModal();
      },

      openTransactionEditModal(event: MouseEvent) {
        if (!(event.currentTarget instanceof HTMLButtonElement)) {
          return;
        }
        if (event.currentTarget.classList.contains('disabled')) {
          return;
        }
        var dataIndex = event.currentTarget.getAttribute('data-index');
        if (dataIndex == null) {
          return;
        }
        var index = parseInt(dataIndex);
        this.currentlySelectedTransaction = this.transactions[index];
        this.$nextTick(() => {
          var transactionEditModal: any = this.$refs.transactionEditModal;
          transactionEditModal.initializeExistingValues();
          transactionEditModal.showModal();
        });
      },

      openTransactionDeleteModal(event: MouseEvent) {
        if (!(event.currentTarget instanceof HTMLButtonElement)) {
          return;
        }
        if (event.currentTarget.classList.contains('disabled')) {
          return;
        }
        var dataIndex = event.currentTarget.getAttribute('data-index');
        if (dataIndex == null) {
          return;
        }
        var index = parseInt(dataIndex);
        this.currentlySelectedTransaction = this.transactions[index];
        this.$nextTick(() => {
          var transactionDeleteModal: any = this.$refs.transactionDeleteModal;
          transactionDeleteModal.showModal();
        });
      },

      openTransactionSendModal(event: Event) {
        var transactionSendModal: any = this.$refs.transactionSendModal;
        transactionSendModal.showModal();
      },
    },

    components: {
      ImageModal,
      TransactionAddModal,
      TransactionDeleteModal,
      TransactionEditModal,
      TransactionSendModal,
      MonthNavigator,
      TransactionGeneralData,
      TransactionFilter,
      TransactionAddBulkModal,
      TransactionAddBulkRequestImageModal,
    },
  };
</script>
