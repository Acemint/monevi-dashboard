<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Laporan</h1>
      <div style="display: flex">
        <MonthNavigator v-bind:currentRouteName="currentRouteName" v-on:period-change="getReportSummary" />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4>Laporan Keuangan Kas dan Bank UKM HIMTI (Himpunan Mahasiswa Teknik Informatika) per Bulan {{ formatDateToMonth(date) }}</h4>
            <div class="card-header-action">
              <button class="btn btn-primary" onclick="location.href='report-detail.html';">Lihat Detail Transaksi</button>
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
                  <tr>
                    <td>Saldo {{ generalLedgerData.identifier }} {{ getPreviousMonthFromCurrentMonth(date) }}</td>
                    <td></td>
                    <td>{{ formatAmountToRupiah(generalLedgerData.data.previousMonthAmount) }}</td>
                  </tr>
                  <template v-for="entryPositionData in generalLedgerData.data.values()">
                    <tr>
                      <td>{{ entryPositionData.identifier }} Selama Bulan {{ formatDateToMonth(date) }}</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <template v-for="categoryData in entryPositionData.data.values()">
                      <tr>
                        <td>{{ categoryData.index }} {{ categoryData.identifier }}</td>
                        <td>{{ formatAmountToRupiah(entryPositionData.data.getByName(categoryData.identifier).amount) }}</td>
                        <td></td>
                      </tr>
                    </template>
                    <tr>
                      <td></td>
                      <td>TOTAL</td>
                      <td>TOTAL</td>
                    </tr>
                  </template>
                </template>
              </table>
            </div>
          </div>
          <div class="card-footer text-right">
            <div>
              <button v-on:click="rejectReport" type="button" class="btn btn-danger">Tolak Laporan</button>
              <button v-on:click="approveReport" type="button" class="btn btn-primary">Terima Laporan</button>
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
    },

    data: function () {
      return {
        reportData: new MoneviReportSummary(),
        currentRouteName: FrontendRouteName.REPORT,
        date: '',
      };
    },

    methods: {
      async getReportSummary(date: string) {
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
        report.bank.income.nonDaily.amount = transactionTypeMap.generalLedgerAccountTypeData.BANK.transactionTypeData.DAILY.entryPositionData.CREDIT.amount;
        report.bank.expense.daily.amount = transactionTypeMap.generalLedgerAccountTypeData.BANK.transactionTypeData.NON_DAILY.entryPositionData.DEBIT.amount;
        report.cash.expense.nonDaily.amount = transactionTypeMap.generalLedgerAccountTypeData.BANK.transactionTypeData.NON_DAILY.entryPositionData.CREDIT.amount;

        report.cash.opnameAmount = transactionTypeMap.generalLedgerAccountTypeData.CASH.opnameAmount;
        report.cash.previousMonthAmount = transactionTypeMap.generalLedgerAccountTypeData.CASH.previousMonthBalance;
        report.bank.opnameAmount = transactionTypeMap.generalLedgerAccountTypeData.BANK.opnameAmount;
        report.bank.previousMonthAmount = transactionTypeMap.generalLedgerAccountTypeData.BANK.previousMonthBalance;

        this.reportData = report;
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
        return MoneviDateFormatter.minusMonth(date);
      },

      formatDateToMonth(date: string): string {
        return MoneviDateFormatter.formatDateDMYToMonthAndYear(date);
      },

      formatAmountToRupiah(amount: number): string {
        return MoneviDisplayFormatter.toRupiah(amount);
      },
    },
    components: { ReportRejectModal, ReportApproveModal, MonthNavigator },
  };
</script>
