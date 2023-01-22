<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Laporan</h1>
      <div style="display: flex">
        <div class="section-header-button">
          <MonthNavigator v-on:period-change="updateDate" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4>Laporan Keuangan Kas dan Bank UKM {{ organization.organizationName }} {{ organization.regionName }} per Bulan {{ formatDateToMonth(date) }}</h4>
            <div class="card-header-action">
              <button class="btn btn-primary" v-on:click="navigateToTransactionPage">Lihat Detail Transaksi</button>
            </div>
          </div>

          <div class="card-body" v-if="reportData.reportId != ''">
            <p>{{ formatReportStatus(reportData.reportStatus, role!) }}</p>
            <div class="table-responsive">
              <table class="table table-striped table-bordered" id="table-1">
                <template v-for="generalLedgerData of reportData.values()">
                  <tr>
                    <th style="font-weight: 800">{{ generalLedgerData.identifier }}</th>
                    <th></th>
                    <th></th>
                  </tr>
                  <!-- SALDO KAS / BANK -->
                  <tr>
                    <td>Saldo {{ generalLedgerData.identifier }} {{ getPreviousMonthFromCurrentMonth(date) }}</td>
                    <td></td>
                    <td>{{ formatAmountToRupiah(generalLedgerData.data.previousMonthAmount) }}</td>
                  </tr>
                  <!-- KREDIT / DEBIT -->
                  <template v-for="entryPositionData in generalLedgerData.data.values()">
                    <tr>
                      <td>{{ entryPositionData.identifier }} Selama Bulan {{ formatDateToMonth(date) }}</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <!-- RUTIN / NON RUTIN -->
                    <template v-for="categoryData in entryPositionData.data.values()">
                      <tr>
                        <td>{{ categoryData.index }}. {{ categoryData.identifier }}</td>
                        <td>{{ formatAmountToRupiah(entryPositionData.data.getByName(categoryData.identifier).amount) }}</td>
                        <td></td>
                      </tr>
                    </template>
                    <!-- Total Dari Rutin + Non Rutin -->
                    <tr>
                      <td></td>
                      <td>{{ formatAmountToRupiah(sumEntryPosition(entryPositionData)) }}</td>
                      <td>{{ formatAmountToRupiah(sumEntryPosition(entryPositionData)) }}</td>
                    </tr>
                  </template>
                  <!-- Jumlah Pengeluaran + Pemasukan di sebuah GL -->
                  <tr>
                    <td>Saldo {{ generalLedgerData.identifier }} per Bulan {{ formatDateToMonth(date) }}</td>
                    <td></td>
                    <td>{{ formatAmountToRupiah(sumGeneralLedgerAccount(generalLedgerData) + generalLedgerData.data.previousMonthAmount) }}</td>
                  </tr>
                  <tr>
                    <td>Hasil {{ generalLedgerData.identifier }} Opname</td>
                    <td></td>
                    <td>{{ formatAmountToRupiah(generalLedgerData.data.opnameAmount) }}</td>
                  </tr>
                  <tr>
                    <td>Selisih Saldo Buku vs {{ generalLedgerData.identifier }} Opname</td>
                    <td></td>
                    <td>{{ formatAmountToRupiah(sumGeneralLedgerAccount(generalLedgerData) + generalLedgerData.data.previousMonthAmount - generalLedgerData.data.opnameAmount) }}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </template>
              </table>
            </div>

            <div v-if="role === 'ROLE_CHAIRMAN' && reportData.reportStatus == 'UNAPPROVED'" class="card-footer text-right">
              <div>
                <button v-on:click="rejectReport" type="button" class="btn btn-danger">Tolak Laporan</button>
                <button v-on:click="approveReport" type="button" class="btn btn-primary">Kirim Laporan</button>
              </div>
            </div>

            <div v-else-if="role === 'ROLE_TREASURER' && (reportData.reportStatus == 'NOT_SENT' || reportData.reportStatus == 'DECLINED')" class="card-footer text-right">
              <div>
                <button v-on:click="approveReport" v-bind:class="[isBalanced() ? '' : 'disabled', 'btn btn-primary']" type="button" class="btn btn-primary">Kirim Laporan</button>
              </div>
            </div>
          </div>

          <div class="card-body" v-else>
            <p>Tidak ada laporan yang tersedia saat ini</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <ReportApproveModal ref="reportApproveModal" v-on:success-update="updateDate" v-bind:role="role" v-bind:reportId="reportData.reportId" v-bind:userId="userId" />
  <ReportRejectModal ref="reportRejectModal" v-on:success-update="updateDate" v-bind:reportId="reportData.reportId" v-bind:userId="userId" />
</template>

<script lang="ts">
  import moneviAxios from '@/api/configuration/monevi-axios';
  import { MoneviPath } from '@/api/path/path';
  import type { MoneviParamsGetOrganizationRegion, MoneviParamsSummarizeReport } from '@/api/model/monevi-config';
  import { MoneviReportSummary, MoneviOrganizationRegion } from '@/api/model/monevi-model';
  import ReportApproveModal from '@/components/modal/ReportApproveModal.vue';
  import ReportRejectModal from '@/components/modal/ReportRejectModal.vue';
  import MonthNavigator from '@/components/navigator/MonthNavigator.vue';
  import { FrontendRouteName } from '@/constants/path';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';

  export default {
    data: function () {
      return {
        reportData: new MoneviReportSummary(),
        organization: new MoneviOrganizationRegion(),
        date: '',
        role: '',
        organizationRegionId: '',
        userId: '',
      };
    },

    methods: {
      async updateDate(date: string) {
        this.date = date;
        var userData = MoneviCookieHandler.getUserData();
        this.organizationRegionId = userData.organizationRegionId;
        this.role = userData.role;

        await this.setOrganization();
        await this.setReportSummary();

        // Cannot access other organization data
        if (this.$route.query.organization != undefined) {
          if (this.$route.query.organization != this.organizationRegionId) {
            this.$router.push({ name: FrontendRouteName.Error.ERROR_403 });
            return;
          }
        }

        this.$router.push({ name: FrontendRouteName.Report.DETAILS, query: { period: MoneviDateFormatter.formatDateDMYToMonthAndYear(this.date) } });
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
          });
      },

      async setReportSummary() {
        this.reportData = new MoneviReportSummary();
        var params = {} as MoneviParamsSummarizeReport;
        params.organizationRegionId = this.organizationRegionId;
        params.date = this.date;
        var reportSummary = await moneviAxios
          .get(MoneviPath.SUMMARIZE_REPORT_PATH, {
            params: params,
            paramsSerializer: { indexes: null },
          })
          .then((response) => {
            return response.data.value;
          })
          .catch((error) => {
            if (error.response.status == 400) {
              return;
            }
            return;
          });

        if (!reportSummary) {
          return;
        }
        if (this.isAllowedToView(reportSummary) == false) {
          return;
        }
        this.reportData = this.extractDataFromReport(reportSummary);
      },

      isAllowedToView(reportSummary: MoneviReportSummary) {
        if (this.role == 'ROLE_CHAIRMAN') {
          if (reportSummary.reportStatus == 'NOT_SENT') {
            return false;
          }
        }
        return true;
      },

      extractDataFromReport(transactionTypeMap: any) {
        var report = new MoneviReportSummary();
        report.reportId = transactionTypeMap.reportId;
        report.reportStatus = transactionTypeMap.reportStatus;

        report.cash.income.daily.amount = transactionTypeMap.generalLedgerAccountTypeData.CASH.transactionTypeData.DAILY.entryPositionData.DEBIT.amount;
        report.cash.income.nonDaily.amount = transactionTypeMap.generalLedgerAccountTypeData.CASH.transactionTypeData.NON_DAILY.entryPositionData.DEBIT.amount;
        report.cash.expense.daily.amount = transactionTypeMap.generalLedgerAccountTypeData.CASH.transactionTypeData.DAILY.entryPositionData.CREDIT.amount;
        report.cash.expense.nonDaily.amount = transactionTypeMap.generalLedgerAccountTypeData.CASH.transactionTypeData.NON_DAILY.entryPositionData.CREDIT.amount;

        report.bank.income.daily.amount = transactionTypeMap.generalLedgerAccountTypeData.BANK.transactionTypeData.DAILY.entryPositionData.DEBIT.amount;
        report.bank.income.nonDaily.amount = transactionTypeMap.generalLedgerAccountTypeData.BANK.transactionTypeData.NON_DAILY.entryPositionData.DEBIT.amount;
        report.bank.expense.daily.amount = transactionTypeMap.generalLedgerAccountTypeData.BANK.transactionTypeData.DAILY.entryPositionData.CREDIT.amount;
        report.bank.expense.nonDaily.amount = transactionTypeMap.generalLedgerAccountTypeData.BANK.transactionTypeData.NON_DAILY.entryPositionData.CREDIT.amount;

        report.cash.opnameAmount = transactionTypeMap.generalLedgerAccountTypeData.CASH.opnameAmount;
        report.cash.previousMonthAmount = transactionTypeMap.generalLedgerAccountTypeData.CASH.previousMonthBalance;
        report.bank.opnameAmount = transactionTypeMap.generalLedgerAccountTypeData.BANK.opnameAmount;
        report.bank.previousMonthAmount = transactionTypeMap.generalLedgerAccountTypeData.BANK.previousMonthBalance;

        return report;
      },

      isBalanced() {
        for (var generalLedger of this.reportData.values()) {
          if (generalLedger.data.opnameAmount != this.sumGeneralLedgerAccount(generalLedger)) {
            return false;
          }
        }
      },

      sumGeneralLedgerAccount(generalLedgers: any): number {
        var total = 0;
        var entryPositions = generalLedgers.data.values();

        for (var entryPosition of entryPositions) {
          var totalEntryPosition = this.sumEntryPosition(entryPosition);

          if (entryPosition.identifier === 'Pemasukan') {
            total += totalEntryPosition;
          } else {
            total -= totalEntryPosition;
          }
        }
        return total;
      },

      sumEntryPosition(entryPosition: any): number {
        var total = 0;
        var categories = entryPosition.data.values();

        for (var category of categories) {
          total += category.data.amount;
        }
        return total;
      },

      navigateToTransactionPage() {
        this.$router.push({ name: FrontendRouteName.Transaction.ROOT, query: { period: this.formatDateToMonth(this.date) } });
      },

      approveReport() {
        if (this.isBalanced() == false) {
          alert('Hasil opname dan saldo buku tidak seimbang, harap cek kembali');
          return;
        }
        var reportApproveModal: any = this.$refs.reportApproveModal;
        reportApproveModal.showModal();
      },

      rejectReport() {
        var reportRejectModal: any = this.$refs.reportRejectModal;
        reportRejectModal.showModal();
      },

      getPreviousMonthFromCurrentMonth(date: string): string {
        return MoneviDateFormatter.formatDate(MoneviDateFormatter.fromDMYtoMYDDate(MoneviDateFormatter.minusMonth(date)), ' ', true);
      },

      formatDateToMonth(date: string): string {
        return MoneviDateFormatter.formatDateDMYToMonthAndYear(date);
      },

      formatMonthToDate(date: string): string {
        return MoneviDateFormatter.formatMonthAndYearToDateDMY(date);
      },

      formatAmountToRupiah(amount: number): string {
        return MoneviDisplayFormatter.toRupiah(amount);
      },

      formatReportStatus(status: string, role: string): string {
        return MoneviDisplayFormatter.convertReportStatusForDisplay(status, role);
      },
    },
    components: { ReportRejectModal, ReportApproveModal, MonthNavigator },
  };
</script>
