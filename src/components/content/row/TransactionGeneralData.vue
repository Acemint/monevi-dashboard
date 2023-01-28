<template>
  <div class="row">
    <div class="col-lg-3 col-md-6 col-sm-6 col-12">
      <div class="card card-statistic-1">
        <div class="card-icon bg-primary">
          <i class="fas fa-regular fa-wallet"></i>
        </div>
        <div class="card-wrap">
          <div class="card-header">
            <h4>Total Saldo Keseluruhan</h4>
          </div>
          <div class="card-body">{{ formatRupiah(totalCurrentMonthBalance) }}</div>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-6 col-12">
      <div class="card card-statistic-1">
        <div class="card-icon bg-primary">
          <i class="fas fa-regular fa-calendar"></i>
        </div>
        <div class="card-wrap">
          <div class="card-header">
            <h4>Total Saldo Bulan Sebelumnya</h4>
          </div>
          <div class="card-body">{{ formatRupiah(getSumPreviousMonthBalance()) }}</div>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-6 col-12">
      <div class="card card-statistic-1">
        <div class="card-icon bg-primary">
          <i class="fas fa-plus"></i>
        </div>
        <div class="card-wrap">
          <div class="card-header">
            <h4>Total Pendapatan Bulan Ini</h4>
          </div>
          <div class="card-body">{{ formatRupiah(totalIncome) }}</div>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-6 col-12">
      <div class="card card-statistic-1">
        <div class="card-icon bg-danger">
          <i class="fas fa-minus"></i>
        </div>
        <div class="card-wrap">
          <div class="card-header">
            <h4>Total Pengeluaran Bulan Ini</h4>
          </div>
          <div class="card-body">{{ formatRupiah(totalExpense) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import type { Transaction } from '@/api/model/monevi-model';
  import { transactionApi } from '@/api/service/transaction-api';
  import { walletApi } from '@/api/service/wallet-api';

  export default {
    props: {
      transactions: Array<Transaction>,
      organizationRegionId: String,
      date: String,
    },

    data: function () {
      return {
        totalIncome: 0,
        totalExpense: 0,
        totalCurrentMonthBalance: 0,
        previousMonthTransactions: new Array<Transaction>(),
      };
    },

    watch: {
      async date(newDate, oldDate) {
        await this.initData();
      },

      async organizationRegionId(newOrganizationRegionId, oldOrganizationRegionId) {
        await this.initData();
      },

      async transactions(oldTransactions, newTransactions) {
        await this.initData();
      },
    },

    methods: {
      async initData() {
        this.setTotalIncomeAndExpense();
        await this.setCurrentMonthBalance();
        await this.setPreviousMonthBalance();
      },

      setTotalIncomeAndExpense() {
        this.totalIncome = 0;
        this.totalExpense = 0;
        for (var transaction of this.transactions!) {
          if (transaction.entryPosition == 'DEBIT') {
            this.totalIncome += transaction.amount;
          } else {
            this.totalExpense += transaction.amount;
          }
        }
      },

      async setCurrentMonthBalance() {
        if (this.organizationRegionId == null) {
          return;
        }

        var cash = await walletApi
          .getWallet('CASH', this.organizationRegionId!)
          .then((response) => {
            return response.data.value.total;
          })
          .catch((error) => {
            return 'N/A';
          });

        var bank = await walletApi
          .getWallet('BANK', this.organizationRegionId!)
          .then((response) => {
            return response.data.value.total;
          })
          .catch((error) => {
            return 'N/A';
          });

        if (bank == 'N/A' || cash == 'N/A') {
          this.totalCurrentMonthBalance = 0;
          return;
        }
        var total = bank + cash;
        this.totalCurrentMonthBalance = bank + cash;
      },

      async setPreviousMonthBalance() {
        this.previousMonthTransactions = new Array<Transaction>();
        this.previousMonthTransactions = await transactionApi.getTransactions(
          this.organizationRegionId!,
          MoneviDateFormatter.minusMonth(this.date!)
        );
        console.log(this.previousMonthTransactions);
      },

      getSumPreviousMonthBalance() {
        var total = 0;
        for (var previousMonthTransaction of this.previousMonthTransactions) {
          if (previousMonthTransaction.entryPosition == 'DEBIT') {
            total += previousMonthTransaction.amount;
          } else {
            total -= previousMonthTransaction.amount;
          }
        }
        return total;
      },

      formatRupiah(amount: number, entryPosition: string = 'DEBIT') {
        return MoneviDisplayFormatter.toRupiah(
          MoneviDisplayFormatter.determineNumberByPositionType(amount, entryPosition)
        );
      },
    },
  };
</script>
