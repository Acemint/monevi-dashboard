<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Transaksi</h1>
      <div style="display: flex">
        <div class="section-header-button">
          <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Tambah Transaksi</button>
          <div class="dropdown-menu">
            <a v-on:click="openTransactionAddModal" class="dropdown-item">Tambah Transaksi</a>
            <a class="dropdown-item" data-toggle="modal" data-target="#imporTransaksi">Impor</a>
          </div>
        </div>

        <MonthNavigator v-bind:currentRouteName="currentRouteName" v-on:period-change="getTransactions" />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-6 col-12">
        <div class="card card-statistic-1">
          <div class="card-icon bg-primary">
            <i class="fas fa-regular fa-wallet"></i>
          </div>
          <div class="card-wrap">
            <div class="card-header">
              <h4>Total Saldo</h4>
            </div>
            <div class="card-body">Rp 10,000,000</div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-6 col-12">
        <div class="card card-statistic-1">
          <div class="card-icon bg-danger">
            <i class="fas fa-minus"></i>
          </div>
          <div class="card-wrap">
            <div class="card-header">
              <h4>Total Pengeluaran</h4>
            </div>
            <div class="card-body">Rp 1,000,000</div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-6 col-12">
        <div class="card card-statistic-1">
          <div class="card-icon bg-primary">
            <i class="fas fa-plus"></i>
          </div>
          <div class="card-wrap">
            <div class="card-header">
              <h4>Total Pendapatan</h4>
            </div>
            <div class="card-body">Rp 9,000,000</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <h5>Filter</h5>
          </div>
          <div class="card-body">
            <div class="form-row">
              <div class="form-group col-md-4">
                <label for="inputCity">Berdasarkan dompet</label>
                <select v-model="filterGeneralLedgerAccount" id="inputState" class="form-control">
                  <option selected>Semua</option>
                  <option>Bank</option>
                  <option>Kas</option>
                </select>
              </div>
              <div class="form-group col-md-4">
                <label for="inputState">Berdasarkan jenis transaksi</label>
                <select v-model="filterEntryPosition" id="inputState" class="form-control">
                  <option selected>Semua</option>
                  <option>Debit</option>
                  <option>Kredit</option>
                </select>
              </div>
              <div class="form-group col-md-4">
                <label for="inputZip">Berdasarkan kategori</label>
                <select v-model="filterType" id="inputState" class="form-control">
                  <option selected>Semua</option>
                  <option>Rutin</option>
                  <option>Non Rutin</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
                  <th v-if="role === 'ROLE_TREASURER'">Aksi</th>
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
                    <!-- TODO: Implement Minified Image -->
                    <!-- <div class="gallery transaction">
                      <img ref="proofImage" src="" />
                      <div class="gallery-item" data-image="@/assets/img/news/img02.jpg"></div>
                    </div>
                    <div class="gallery transaction">
                      <div class="gallery-item" src="@/assets/img/news/img02.jpg"></div>
                    </div> -->
                  </td>
                  <td v-if="role === 'ROLE_TREASURER'">
                    <button ref="editTransactionButton" v-on:click="openTransactionEditModal($event)" class="btn btn-primary">
                      <i style="pointer-events: none" class="far fa-edit"></i>
                    </button>
                    <button ref="deleteTransactionButton" v-on:click="openTransactionDeleteModal($event)" class="btn btn-danger">
                      <i style="pointer-events: none" class="far fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div v-if="role === 'ROLE_TREASURER'" class="card-footer text-right">
            <button v-on:click="openTransactionSendModal" type="button" class="btn btn-primary">Kirim Laporan</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <TransactionAddModal ref="transactionAddModal" v-bind:organizationRegionId="organizationRegionId" />
  <TransactionEditModal ref="transactionEditModal" v-bind:transactionId="transactionId" />
  <TransactionDeleteModal ref="transactionDeleteModal" v-bind:transactionId="transactionId" />
  <TransactionSendModal ref="transactionSendModal" v-bind:organizationRegionId="organizationRegionId" v-bind:period="date" />
</template>

<script lang="ts">
  import type { Transaction } from '@/api/model/monevi-model';
  import type { MoneviParamsGetTransactions } from '@/api/model/monevi-config';
  import { MoneviPath } from '@/api/path/path';
  import { MoneviAPI } from '@/api/methods/monevi-api';
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

  export default {
    props: {
      organizationRegionId: String,
      role: String,
    },

    data: function () {
      return {
        currentRouteName: FrontendRouteName.TRANSACTION,
        monevi_api: new MoneviAPI(),
        transactions: new Array<Transaction>(),
        filterGeneralLedgerAccount: 'Semua',
        filterType: 'Semua',
        filterEntryPosition: 'Semua',
        transactionId: '',
        date: '',
      };
    },

    watch: {
      currentDateIndex(newDateIndex, oldDateIndex) {
        this.getTransactions(this.date);
      },

      filterGeneralLedgerAccount(newFilter: string, oldFilter: string) {
        this.getTransactions(this.date);
      },

      filterType(newFilter: string, oldFilter: string) {
        this.getTransactions(this.date);
      },

      filterEntryPosition(newFilter: string, oldFilter: string) {
        this.getTransactions(this.date);
      },
    },

    methods: {
      async getTransactions(date: string) {
        this.date = date;
        this.transactions = new Array<Transaction>();

        var params = {} as MoneviParamsGetTransactions;
        params.page = 0;
        params.size = 1000;
        params.sortBy = new Array<string>('transactionDate');
        params.isAscending = new Array<string>('true');
        if (this.organizationRegionId != undefined) {
          params.organizationRegionId = this.organizationRegionId;
        }
        var datesBetween = MoneviDateFormatter.getFirstDateAndLastDateOfADate(date);
        params.startDate = datesBetween[0];
        params.endDate = datesBetween[1];
        if (this.filterGeneralLedgerAccount != 'Semua') {
          params.generalLedgerAccountType = MoneviEnumConverter.convertGeneralLedgerAccountType(this.filterGeneralLedgerAccount);
        }
        if (this.filterEntryPosition != 'Semua') {
          params.entryPosition = MoneviEnumConverter.convertEntryPosition(this.filterEntryPosition);
        }
        if (this.filterType != 'Semua') {
          params.transactionType = MoneviEnumConverter.convertTransactionType(this.filterType);
        }
        return moneviAxios
          .get(MoneviPath.GET_TRANSACTIONS_PATH, {
            params: params,
            paramsSerializer: {
              indexes: null,
            },
          })
          .then((response) => {
            this.transactions = response.data.values;
            return response;
          })
          .then((response) => {
            if (this.$refs.deleteTransactionButton instanceof Array<HTMLButtonElement>) {
              let i = 0;
              for (var button of this.$refs.deleteTransactionButton) {
                button.id = response.data.values[i].id;
                i++;
              }
            }
            if (this.$refs.editTransactionButton instanceof Array<HTMLButtonElement>) {
              let i = 0;
              for (var button of this.$refs.editTransactionButton) {
                button.id = response.data.values[i].id;
                i++;
              }
            }
            if (this.$refs.proofImage instanceof Array<HTMLImageElement>) {
              let i = 0;
              for (var image of this.$refs.proofImage) {
                image.src = atob(response.data.values[i].proof);
                i++;
              }
            }
          })
          .catch((error) => {
            console.error('Internal Server Error, Unable to get Transactions Data');
          });
      },

      formatGeneralLedgerAccountType(generalLedgerAccountType: string) {
        return MoneviDisplayFormatter.convertGeneralLedgerAccountTypeForDisplay(generalLedgerAccountType);
      },

      formatRupiah(amount: number, entryPosition: string) {
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

      openTransactionAddModal(event: Event) {
        var transactionAddModal: any = this.$refs.transactionAddModal;
        transactionAddModal.showModal();
      },

      openTransactionEditModal(event: MouseEvent) {
        if (event.currentTarget instanceof HTMLButtonElement) {
          this.transactionId = event.currentTarget.id;
        }
        this.$nextTick(() => {
          var transactionEditModal: any = this.$refs.transactionEditModal;
          transactionEditModal.initializeExistingValues(this.transactions[6]);
          transactionEditModal.showModal();
        });
      },

      openTransactionDeleteModal(event: MouseEvent) {
        if (event.currentTarget instanceof HTMLButtonElement) {
          this.transactionId = event.currentTarget.id;
        }
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
      TransactionAddModal,
      TransactionDeleteModal,
      TransactionEditModal,
      TransactionSendModal,
      MonthNavigator,
    },
  };
</script>
