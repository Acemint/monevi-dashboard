<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Transaksi</h1>
      <div style="display: flex">
        <div class="section-header-button" v-if="role === 'ROLE_TREASURER'">
          <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Tambah Transaksi</button>
          <div class="dropdown-menu">
            <a v-on:click="openTransactionAddModal" class="dropdown-item">Tambah Transaksi</a>
            <a class="dropdown-item" data-toggle="modal" data-target="#imporTransaksi">Impor</a>
          </div>
        </div>

        <div class="section-header-button">
          <MonthNavigator v-on:period-change="updateDate" />
        </div>
      </div>
    </div>

    <TransactionGeneralData v-bind:transactions="transactions" v-bind:previousMonthReports="previousMonthReports" />
    <TransactionFilter v-on:filter-change="getTransactions" />

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-bordered" id="table-1">
                <template v-if="role === 'ROLE_TREASURER'">
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
                  <tr v-for="(item, index) in transactions" ref="transactionsDisplay">
                    <td>{{ index + 1 }}</td>
                    <td>{{ formatTransactionDate(item.transactionDate) }}</td>
                    <td>{{ formatGeneralLedgerAccountType(item.generalLedgerAccountType) }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ formatTransactionType(item.type) }}</td>
                    <td>{{ item.description }}</td>
                    <td v-bind:class="[item.entryPosition == 'CREDIT' ? 'text-danger' : 'text-primary']">{{ formatRupiah(item.amount, item.entryPosition) }}</td>
                    <td>
                      <button v-if="item.proof != ''" class="btn btn-primary" v-on:click="openImageModal" v-bind:data-index="index">
                        <i style="pointer-events: none" class="far fa-eye"></i>
                      </button>
                    </td>
                    <td>
                      <button v-bind:class="[isCurrentMonthReportAlreadySent() ? 'disabled' : '', 'btn btn-primary']" v-bind:data-index="index" v-on:click="openTransactionEditModal($event)">
                        <i style="pointer-events: none" class="far fa-edit"></i>
                      </button>
                      <button v-bind:class="[isCurrentMonthReportAlreadySent() ? 'disabled' : '', 'btn btn-danger']" v-bind:data-index="index" v-on:click="openTransactionDeleteModal($event)">
                        <i style="pointer-events: none" class="far fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                </template>

                <template v-else>
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
                    <td v-bind:class="[item.entryPosition == 'CREDIT' ? 'text-danger' : 'text-primary']">{{ formatRupiah(item.amount, item.entryPosition) }}</td>
                    <td>
                      <button v-if="item.proof != ''" class="btn btn-primary" v-on:click="openImageModal" v-bind:data-index="index">
                        <i style="pointer-events: none" class="far fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                </template>
              </table>
            </div>
          </div>
          <div v-if="role === 'ROLE_TREASURER'" class="card-footer text-right">
            <button v-on:click="openTransactionSendModal" v-if="!isCurrentMonthReportAlreadySent()" type="button" class="btn btn-primary">Buat Laporan</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <ImageModal ref="imageModal" v-bind:imageSrc="imageSrc" />
  <TransactionAddModal ref="transactionAddModal" v-bind:organizationRegionId="organizationRegionId" v-on:success-update="initData()" />
  <TransactionEditModal ref="transactionEditModal" v-bind:transaction="transaction" v-on:success-update="initData()" />
  <TransactionDeleteModal ref="transactionDeleteModal" v-bind:transaction="transaction" v-on:success-update="initData()" />
  <TransactionSendModal ref="transactionSendModal" v-bind:organizationRegionId="organizationRegionId" v-bind:date="date" />
</template>

<script lang="ts">
  import { Transaction } from '@/api/model/monevi-model';
  import type { MoneviParamsGetReports, MoneviParamsGetTransactions } from '@/api/model/monevi-config';
  import type { MoneviReport } from '@/api/model/monevi-model';
  import { MoneviPath } from '@/api/path/path';
  import TransactionGeneralData from '@/components/content/row/TransactionGeneralData.vue';
  import TransactionFilter from '@/components/content/row/TransactionFilter.vue';
  import TransactionAddModal from '@/components/modal/TransactionAddModal.vue';
  import TransactionEditModal from '@/components/modal/TransactionEditModal.vue';
  import TransactionDeleteModal from '@/components/modal/TransactionDeleteModal.vue';
  import TransactionSendModal from '@/components/modal/TransactionSendModal.vue';
  import MonthNavigator from '@/components/navigator/MonthNavigator.vue';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import moneviAxios from '@/api/configuration/monevi-axios';
  import { MoneviEnumConverter } from '@/api/methods/monevi-enum-converter';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import { FrontendRouteName } from '@/constants/path';
  import ImageModal from '@/components/modal/ImageModal.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

  export default {
    data: function () {
      return {
        transactions: new Array<Transaction>(),
        currentMonthReports: new Array<MoneviReport>(),
        previousMonthReports: new Array<MoneviReport>(),
        date: '',
        images: new Array<ArrayBuffer>(),
        imageSrc: '',
        transaction: new Transaction(),
        organizationRegionId: '',
        role: '',
      };
    },

    beforeMount() {
      this.validateRole();
      this.getTransactions();
    },

    methods: {
      updateDate(date: string) {
        this.date = date;
        this.$nextTick(() => {
          this.initData();
        });
      },

      async initData() {
        this.transactions = new Array<Transaction>();

        await this.getTransactions();
        this.validateRole();
        this.currentMonthReports = await this.getReport();
        this.previousMonthReports = await this.getReport(-1);
      },

      validateRole() {
        var userAccount = MoneviCookieHandler.getUserData();
        if (userAccount.role === 'ROLE_SUPERVISOR') {
          if (this.$route.query.organization == undefined) {
            return this.$router.push({ name: FrontendRouteName.Error.ERROR_404 });
          } else {
            var organizationId = this.$route.query.organization;
            if (typeof organizationId != 'string') {
              return;
            }
            this.organizationRegionId = organizationId;
          }
        } else {
          this.organizationRegionId = userAccount.organizationRegionId;
        }
      },

      async getTransactions(filterGeneralLedgerAccount: string = 'Semua', filterEntryPosition: string = 'Semua', filterType: string = 'Semua') {
        var params = {} as MoneviParamsGetTransactions;
        params.page = 0;
        params.size = 1000;
        params.sortBy = new Array<string>('transactionDate');
        params.isAscending = new Array<string>('true');
        if (this.organizationRegionId != undefined) {
          params.organizationRegionId = this.organizationRegionId;
        }
        var datesBetween = MoneviDateFormatter.getFirstDateAndLastDateOfADate(this.date);
        params.startDate = datesBetween[0];
        params.endDate = datesBetween[1];
        if (filterGeneralLedgerAccount != 'Semua') {
          params.generalLedgerAccountType = MoneviEnumConverter.convertGeneralLedgerAccountType(filterGeneralLedgerAccount);
        }
        if (filterEntryPosition != 'Semua') {
          params.entryPosition = MoneviEnumConverter.convertEntryPosition(filterEntryPosition);
        }
        if (filterType != 'Semua') {
          params.transactionType = MoneviEnumConverter.convertTransactionType(filterType);
        }
        await moneviAxios
          .get(MoneviPath.GET_TRANSACTIONS_PATH, {
            params: params,
            paramsSerializer: {
              indexes: null,
            },
          })
          .then((response) => {
            this.transactions = response.data.values;
          })
          .catch((error) => {
            console.error('Internal Server Error, Unable to get Transactions Data');
          });
      },

      async getReport(monthDifference: number = 0): Promise<any> {
        var params = {} as MoneviParamsGetReports;
        if (this.organizationRegionId != undefined) {
          params.organizationRegionId = this.organizationRegionId;
        }
        var month = this.date;
        if (monthDifference == -1) {
          month = MoneviDateFormatter.minusMonth(this.date);
        }
        var datesBetween = MoneviDateFormatter.getFirstDateAndLastDateOfADate(month);
        params.startDate = datesBetween[0];
        params.endDate = datesBetween[1];
        return await moneviAxios
          .get(MoneviPath.GET_REPORTS_PATH, { params: params })
          .then((response) => {
            return response.data.values;
          })
          .catch((error) => {
            for (const key in error.response.data.errorFields) {
              var errorMessage = error.response.data.errorFields[key];
              alert(errorMessage);
              break;
            }
            console.error('internal server error, unable to get previous month data');
          });
      },

      isCurrentMonthReportAlreadySent(): boolean {
        if (this.currentMonthReports.length == 0) {
          return false;
        }
        var currentMonthReport = this.currentMonthReports[0];
        if (currentMonthReport.status == 'NOT_SENT') {
          return false;
        }
        return true;
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

      openImageModal(event: Event) {
        if (!(event.currentTarget instanceof HTMLButtonElement)) {
          return;
        }
        var dataIndex = event.currentTarget.getAttribute('data-index');
        if (dataIndex == null) {
          return;
        }
        var index = parseInt(dataIndex);
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
        this.transaction = this.transactions[index];
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
        this.transaction = this.transactions[index];
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
    },
  };
</script>
