<template>
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
          <div class="card-body">{{ getTotalBalance() }}</div>
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
          <div class="card-body">{{ formatRupiah(totalExpense) }}</div>
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
          <div class="card-body">{{ formatRupiah(totalIncome) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import type { Transaction, MoneviReport } from '@/api/model/monevi-model';

  export default {
    props: {
      previousMonthReports: Array<MoneviReport>,
      transactions: Array<Transaction>,
    },

    data: function () {
      return {
        totalIncome: 0,
        totalExpense: 0,
      };
    },

    watch: {
      transactions(oldTransactions, newTransactions) {
        this.getTotalBalance();
        this.determineTotalIncomeAndExpense();
      },
    },

    methods: {
      getTotalBalance() {
        if (this.previousMonthReports!.length == 0) {
          return 'N/A';
        }
        var previousMonthReport = this.previousMonthReports![0];
        if (previousMonthReport.status != 'APPROVED_BY_SUPERVISOR') {
          return 'N/A';
        }
        var totalBalance = 0;
        for (var generalLedgerAccount of previousMonthReport.generalLedgerAccountValues) {
          totalBalance += generalLedgerAccount.amount;
        }
        return this.formatRupiah(totalBalance);
      },

      determineTotalIncomeAndExpense() {
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

      formatRupiah(amount: number, entryPosition: string = 'DEBIT') {
        return MoneviDisplayFormatter.toRupiah(MoneviDisplayFormatter.determineNumberByPositionType(amount, entryPosition));
      },
    },
  };
</script>
