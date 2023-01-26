<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Detail Transaksi</h1>
      <div class="section-header-breadcrumb">
        <div class="breadcrumb-item active">
          <router-link :to="getRouteToReportSelect()">Pilih Laporan</router-link>
        </div>
        <div class="breadcrumb-item">
          <router-link :to="getRouteToReportDetail()">Laporan {{ organizationRegion.organizationName }}</router-link>
        </div>
        <div class="breadcrumb-item">Detail Transaksi</div>
      </div>
    </div>

    <div class="card" style="display: flex">
      <div class="card-body">
        <MonthNavigator v-on:period-change="updateDate" />
      </div>
    </div>

    <template v-if="date != 'N/A'">
      <TransactionGeneralData v-bind:transactions="transactions" v-bind:organizationRegionId="organizationRegion.id" v-bind:date="date" />
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
    </template>

    <template v-else>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <p>Belum ada laporan yang disetujui oleh Ketua organisasi {{ organizationRegion.organizationName }} untuk bulan {{ formatDateToMonth(date) }}</p>
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
  import TransactionAddModal from '@/components/modal/TransactionAddModal.vue';
  import TransactionEditModal from '@/components/modal/TransactionEditModal.vue';
  import TransactionDeleteModal from '@/components/modal/TransactionDeleteModal.vue';
  import TransactionSendModal from '@/components/modal/TransactionSendModal.vue';
  import MonthNavigator from '@/components/navigator/MonthNavigator.vue';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import { FrontendRouteName } from '@/constants/path';
  import ImageModal from '@/components/modal/ImageModal.vue';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
  import { transactionApi } from '@/api/service/transaction-api';
  import { organizationApi } from '@/api/service/organization-api';

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

        this.organizationRegion = await organizationApi.getOrganization(this.$route.query.organization!.toString());
        if (this.organizationRegion.id == '') {
          return;
        }
        this.date = date;
        if (this.date == 'N/A') {
          return;
        }
        this.transactions = await transactionApi.getTransactions(this.$route.query.organization!.toString(), this.date);
        console.log(this.transactions);
        return;
      },

      async getTransactions(generalLedgerAccount: string, entryPosition: string, type: string): Promise<void> {
        this.transactions = await transactionApi.getTransactions(this.organizationRegion.id, this.date, generalLedgerAccount, entryPosition, type);
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
        return { name: FrontendRouteName.Report.DETAILS, query: { period: this.formatDateToMonth(this.date), organization: this.organizationRegion.id } };
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
