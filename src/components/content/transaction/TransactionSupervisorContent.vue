<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Detail Transaksi</h1>
      <div class="section-header-breadcrumb">
        <div class="breadcrumb-item active">
          <router-link :to="getRouteToReportSelect()">Pilih Laporan</router-link>
        </div>
        <div class="breadcrumb-item">
          <router-link :to="getRouteToReportDetail()">Laporan {{ organization.organizationName }}</router-link>
        </div>
        <div class="breadcrumb-item">Detail Transaksi</div>
      </div>
    </div>

    <div class="card" style="display: flex">
      <div class="card-body">
        <MonthNavigator v-on:period-change="updateDate" />
      </div>
    </div>

    <TransactionGeneralData v-bind:transactions="transactions" v-bind:previousMonthReports="previousMonthReports" />
    <TransactionFilter v-on:filter-change="setTransactions" />

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
                  <td v-bind:class="[item.entryPosition == 'CREDIT' ? 'text-danger' : 'text-primary']">{{ formatRupiah(item.amount, item.entryPosition) }}</td>
                  <td>
                    <button v-if="item.proof != ''" class="btn btn-primary" v-on:click="openImageModal" v-bind:data-index="index">
                      <i style="pointer-events: none" class="far fa-eye"></i>
                    </button>
                  </td>
                </tr>
              </table>
            </div>
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
  import { MoneviOrganizationRegion, MoneviToken, Transaction } from '@/api/model/monevi-model';
  import type { MoneviParamsGetReports, MoneviParamsGetTransactions, MoneviParamsGetOrganizationRegion } from '@/api/model/monevi-config';
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
        organization: new MoneviOrganizationRegion(),
        organizationRegionId: '',
        role: '',
      };
    },

    methods: {
      async initData() {
        var userData = MoneviCookieHandler.getUserData();
        this.role = userData.role;

        if (this.$route.query.organization == undefined) {
          this.$router.push({ name: FrontendRouteName.Error.ERROR_404 });
          return;
        }
        this.organizationRegionId = this.$route.query.organization.toString();
        await this.setOrganization();
        if (this.organization.id == '') {
          this.$router.push({ name: FrontendRouteName.Error.ERROR_404 });
          return;
        }

        await this.setTransactions();
        this.currentMonthReports = await this.getReport();
        if (this.currentMonthReports.length == 0) {
          return;
        }
        this.previousMonthReports = await this.getReport(-1);
        if (this.previousMonthReports.length == 0) {
          return;
        }
      },

      async updateDate(date: string) {
        this.date = date;
        await this.initData();
        this.$router.push({ name: FrontendRouteName.Transaction.ROOT, query: { period: MoneviDateFormatter.formatDateDMYToMonthAndYear(this.date), organization: this.organization.id } });
      },

      async setOrganization() {
        this.organization = new MoneviOrganizationRegion();
        var params = {} as MoneviParamsGetOrganizationRegion;
        params.id = this.organizationRegionId;
        await moneviAxios
          .get(MoneviPath.GET_ORGANIZATION_REGION_PATH, { params })
          .then((response) => {
            this.organization = response.data.value;
          })
          .catch((error) => {
            console.error('no organization region found');
            return undefined;
          });
      },

      determineDestinationPage(userAccount: MoneviToken, date: string) {
        if (userAccount.role === 'ROLE_SUPERVISOR') {
          if (this.$route.query.organization == undefined) {
            return this.$router.push({ name: FrontendRouteName.Error.ERROR_404 });
          }
          this.organizationRegionId = this.$route.query.organization.toString();
          this.date = date;
          this.role = userAccount.role;
          return this.$router.push({ name: FrontendRouteName.Transaction.ROOT, query: { period: MoneviDateFormatter.formatDateDMYToMonthAndYear(date), organization: this.$route.query.organization } });
        } else if (userAccount.role === 'ROLE_TREASURER' || userAccount.role === 'ROLE_CHAIRMAN') {
          this.organizationRegionId = userAccount.organizationRegionId;
          this.date = date;
          this.role = userAccount.role;
          if (this.$route.query.organization == undefined) {
            return this.$router.push({ name: FrontendRouteName.Transaction.ROOT, query: { period: MoneviDateFormatter.formatDateDMYToMonthAndYear(date) } });
          }
          if (userAccount.organizationRegionId != this.$route.query.organization) {
            return this.$router.push({ name: FrontendRouteName.Error.ERROR_403 });
          }
        }
      },

      async setTransactions(filterGeneralLedgerAccount: string = 'Semua', filterEntryPosition: string = 'Semua', filterType: string = 'Semua'): Promise<any> {
        this.transactions = new Array<Transaction>();
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
            console.error('Internal Server Error, unable to get transactions data');
            return null;
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

        var report = await moneviAxios
          .get(MoneviPath.GET_REPORTS_PATH, { params: params })
          .then((response) => {
            return response.data.values;
          })
          .catch((error) => {
            console.error('Internal Server Error, unable to get reports data');
            return new Array<MoneviReport>();
          });
        return report;
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

      getRouteToReportSelect() {
        return { name: FrontendRouteName.Report.ROOT };
      },

      getRouteToReportDetail() {
        return { name: FrontendRouteName.Report.DETAILS, query: { period: this.formatDateToMonth(this.date), organization: this.organizationRegionId } };
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
