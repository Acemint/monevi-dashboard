<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Laporan</h1>
      <div class="section-header-breadcrumb">
        <div class="breadcrumb-item active">
          <router-link :to="getRouteToReportSelect()">Pilih Laporan</router-link>
        </div>
        <div v-if="organizationRegion.id != ''" class="breadcrumb-item">
          Laporan {{ organizationRegion.organizationName }}
        </div>
        <div v-else class="breadcrumb-item">Laporan {{ organizationRegion.organizationName }}</div>
        <div class="breadcrumb-item">
          <router-link :to="getRouteToTransactionDetail()">Detail Transaksi</router-link>
        </div>
      </div>
    </div>

    <div class="card" style="display: flex">
      <div class="card-body">
        <MonthNavigator v-on:period-change="updateDate" />
      </div>
    </div>

    <template v-if="reportSummary.reportId == undefined">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <p>
                Data transaksi tidak dapat dilihat dikarenakan belum ada laporan yang dikirim oleh Ketua
                {{ organizationRegion.organizationName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <template v-html="formatReportStatus(reportSummary.reportStatus!)" />
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4>
                Laporan Keuangan Kas dan Bank UKM <br>
                {{ organizationRegion.organizationName }}
                {{ organizationRegion.regionName }} <br>
                per Bulan {{ formatDateToMonth(date) }}
              </h4>
              <div class="card-header-action">
                <button class="btn btn-primary" v-on:click="navigateToTransactionPage">Lihat Detail Transaksi</button>
              </div>
            </div>

            <div class="card-body" v-if="reportSummary.reportId != ''">
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
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </template>
                </table>
              </div>

              <div v-if="reportSummary.reportStatus == 'APPROVED_BY_CHAIRMAN'" class="card-footer text-right">
                <div>
                  <button v-on:click="rejectReport" type="button" class="btn btn-danger">Tolak Laporan</button>
                  <button v-on:click="approveReport" type="button" class="btn btn-primary">Terima Laporan</button>
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
  <ReportRejectModal
    ref="reportRejectModal"
    v-on:success-update="initData"
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
      };
    },

    methods: {
      async updateDate(date: string) {
        this.date = date;
        this.organizationRegion = await organizationRegionApi.getOrganization(
          this.$route.query.organization!.toString()
        );
        if (this.organizationRegion.id == '') {
          return;
        }
        if (this.date == 'N/A') {
          return;
        }
        this.reportSummary = await reportApi.summarizeReport(this.organizationRegion.id, this.date);
      },

      async initData() {
        this.reportSummary = await reportApi.summarizeReport(this.organizationRegion.id, this.date);
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
          query: { period: this.formatDateToMonth(this.date), organization: this.$route.query.organization },
        });
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

      formatReportStatus(status: string, role: string = 'ROLE_SUPERVISOR'): string {
        return MoneviDisplayFormatter.convertReportStatusForDisplay(status, role);
      },

      getRouteToReportSelect() {
        return { name: FrontendRouteName.Report.ROOT };
      },

      getRouteToTransactionDetail(): any {
        return {
          name: FrontendRouteName.Transaction.ROOT,
          query: { period: this.formatDateToMonth(this.date), organization: this.organizationRegion.id },
        };
      },
    },
    components: { ReportRejectModal, ReportApproveModal, MonthNavigator },
  };
</script>
