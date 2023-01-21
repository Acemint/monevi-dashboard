<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Laporan</h1>
      <div style="display: flex">
        <div class="section-header-button">
          <MonthNavigator v-bind:currentRouteName="currentRouteName" v-on:period-change="getReportSummary" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4>Laporan Keuangan Kas dan Bank UKM HIMTI (Himpunan Mahasiswa Teknik Informatika) per Bulan {{ formatDateToMonth(date) }}</h4>
            <div class="card-header-action">
              <button class="btn btn-primary" v-on:click="navigateToTransactionPage">Lihat Detail Transaksi</button>
            </div>
          </div>

          <div class="card-body" v-if="reportData.reportId != ''">
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
          </div>

          <div class="card-body" v-else>
            <p>Tidak ada laporan yang tersedia saat ini</p>
          </div>

          <div v-if="role === 'ROLE_SUPERVISOR'" class="card-footer text-right">
            <div>
              <button v-on:click="rejectReport" type="button" class="btn btn-danger">Tolak Laporan</button>
              <button v-on:click="approveReport" type="button" class="btn btn-primary">Terima Laporan</button>
            </div>
          </div>

          <div v-else-if="role === 'ROLE_CHAIRMAN'" class="card-footer text-right">
            <div>
              <button v-on:click="rejectReport" type="button" class="btn btn-danger">Tolak Laporan</button>
              <button v-on:click="approveReport" type="button" class="btn btn-primary">Kirim Laporan</button>
            </div>
          </div>

          <div v-if="role === 'ROLE_TREASURER'" class="card-footer text-right">
            <div>
              <button v-on:click="approveReport" type="button" class="btn btn-primary">Kirim Laporan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <ReportApproveModal ref="reportApproveModal" v-bind:reportId="reportData.reportId" v-bind:userId="userId" />
  <ReportRejectModal ref="reportRejectModal" v-bind:reportId="reportData.reportId" v-bind:userId="userId" />
</template>

<script lang="ts">
  import moneviAxios from '@/api/configuration/monevi-axios';
  import { MoneviPath } from '@/api/path/path';
  import type { MoneviParamsSummarizeReport } from '@/api/model/monevi-config';
  import { MoneviReportSummary } from '@/api/model/monevi-model';
  import ReportApproveModal from '@/components/modal/ReportApproveModal.vue';
  import ReportRejectModal from '@/components/modal/ReportRejectModal.vue';
  import MonthNavigator from '@/components/navigator/MonthNavigator.vue';
  import { FrontendRouteName } from '@/constants/path';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';

  export default {
    props: {
      userId: String,
      organizationRegionId: String,
      role: String,
    },

    data: function () {
      return {
        reportData: new MoneviReportSummary(),
        currentRouteName: FrontendRouteName.Report.DETAILS,
        date: '',
      };
    },

    methods: {
      async getReportSummary(date: string) {
        // TODO: get report summary should also accept status
        this.date = date;

        this.reportData = new MoneviReportSummary();
        var params = {} as MoneviParamsSummarizeReport;
        if (this.organizationRegionId == undefined) {
          console.error('internal server error, organization undefined');
          return;
        }
        params.organizationRegionId = this.organizationRegionId;
        if (date == undefined) {
          console.error('internal server error, date is undefined');
          return;
        }
        params.date = date;
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
            }
            return;
          });
        if (reportSummary) {
          try {
            this.extractDataFromReport(reportSummary);
          } catch {
            console.error('Error processing data');
          }
        }
      },

      extractDataFromReport(transactionTypeMap: any) {
        var report = new MoneviReportSummary();
        report.reportId = transactionTypeMap.reportId;

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

        this.reportData = report;
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
    },
    components: { ReportRejectModal, ReportApproveModal, MonthNavigator },
  };
</script>
