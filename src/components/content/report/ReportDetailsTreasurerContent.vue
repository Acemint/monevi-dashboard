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

    <template v-if="reportSummary.reportId == undefined">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4>
                Laporan Keuangan Kas dan Bank {{ organizationRegion.organizationName }}
                {{ organizationRegion.regionName }} per Bulan {{ formatDateToMonth(date) }}
              </h4>
            </div>
            <div class="card-body">
              <p>Belum ada laporan yang dibuat di bulan ini</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-html="formatReportStatus(reportSummary.reportStatus!)"></div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4>
                Laporan Keuangan Kas dan Bank UKM {{ organizationRegion.organizationName }}
                {{ organizationRegion.regionName }} per Bulan {{ formatDateToMonth(date) }}
              </h4>
              <div class="card-header-action">
                <button class="btn btn-primary" v-on:click="navigateToTransactionPage">Lihat Detail Transaksi</button>
              </div>
            </div>

            <div class="card-body">
              <template v-if="reportSummary.reportStatus == 'DECLINED'">
                <p>Komentar Oleh: {{ reportSummary.commentedBy }}</p>
                <p>Komentar: {{ reportSummary.comment }}</p>
              </template>

              <div class="table-responsive">
                <table class="table table-striped table-bordered" id="table-1">
                  <template v-for="generalLedgerData of reportSummary.values()">
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
                          <td>
                            {{ formatAmountToRupiah(entryPositionData.data.getByName(categoryData.identifier).amount) }}
                          </td>
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
                      <td>
                        {{
                          formatAmountToRupiah(
                            sumGeneralLedgerAccount(generalLedgerData) + generalLedgerData.data.previousMonthAmount
                          )
                        }}
                      </td>
                    </tr>
                    <tr>
                      <td>Hasil {{ generalLedgerData.identifier }} Opname</td>
                      <td></td>
                      <td>{{ formatAmountToRupiah(generalLedgerData.data.opnameAmount) }}</td>
                    </tr>
                    <tr>
                      <td>Selisih Saldo Buku vs {{ generalLedgerData.identifier }} Opname</td>
                      <td></td>
                      <td>
                        {{
                          formatAmountToRupiah(
                            sumGeneralLedgerAccount(generalLedgerData) +
                              generalLedgerData.data.previousMonthAmount -
                              generalLedgerData.data.opnameAmount
                          )
                        }}
                      </td>
                    </tr>
                  </template>
                  <tr>
                    <td style="font-weight: 800;">Total Kas dan Bank</td>
                    <td></td>
                    <td style="font-weight: 800;">
                    </td>
                  </tr>
                </table>
              </div>

              <div class="card-footer text-right" v-if="reportSummary.reportStatus == 'NOT_SENT'">
                <div>
                  <button
                    v-on:click="approveReport"
                    v-bind:class="[isBalanceValue == true ? '' : 'disabled', 'btn btn-primary']"
                    type="button"
                    class="btn btn-primary">
                    Kirim Laporan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
  <ReportApproveModal
    ref="reportApproveModal"
    v-on:success-update="initData"
    v-bind:role="userAccount.role"
    v-bind:reportId="reportSummary.reportId"
    v-bind:userId="userAccount.id" />
</template>

<script lang="ts">
  import { MoneviReportSummary, MoneviOrganizationRegion } from '@/api/model/monevi-model';
  import ReportApproveModal from '@/components/modal/ReportApproveModal.vue';
  import ReportRejectModal from '@/components/modal/ReportRejectModal.vue';
  import MonthNavigator from '@/components/navigator/MonthNavigator.vue';
  import { FrontendRouteName } from '@/constants/path';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
  import { organizationRegionApi } from '@/api/service/organization-region-api';
  import { reportApi } from '@/api/service/report-api';

  export default {
    data: function () {
      return {
        reportSummary: new MoneviReportSummary(),
        organizationRegion: new MoneviOrganizationRegion(),
        date: '',
        userAccount: MoneviCookieHandler.getUserData(),
        isBalanceValue: false,
      };
    },

    methods: {
      async updateDate(date: string) {
        this.date = date;
        await this.initData();
      },

      async initData() {
        this.organizationRegion = await organizationRegionApi.getOrganization(this.userAccount.organizationRegionId);
        this.reportSummary = await reportApi.summarizeReport(this.userAccount.organizationRegionId, this.date);
        this.setIsBalanceValue();
      },

      setIsBalanceValue() {
        for (var generalLedger of this.reportSummary.values()) {
          if (
            generalLedger.data.opnameAmount !=
            this.sumGeneralLedgerAccount(generalLedger) + generalLedger.data.previousMonthAmount
          ) {
            this.isBalanceValue = false;
          }
        }
        this.isBalanceValue = true;
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
        this.$router.push({
          name: FrontendRouteName.Transaction.ROOT,
          query: { period: this.formatDateToMonth(this.date) },
        });
      },

      approveReport() {
        if (this.isBalanceValue == false) {
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
        return MoneviDateFormatter.formatDate(
          MoneviDateFormatter.fromDMYtoMYDDate(MoneviDateFormatter.minusMonth(date)),
          ' ',
          true
        );
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

      formatReportStatus(status: string): string {
        return MoneviDisplayFormatter.convertReportStatusForDisplay(status, 'ROLE_TREASURER');
      },
    },
    components: { ReportRejectModal, ReportApproveModal, MonthNavigator },
  };
</script>
