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
          <div class="card-body">{{ totalPreviousMonthBalance }}</div>
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
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import type { Transaction } from '@/api/model/monevi-model';
  import { reportApi } from '@/api/service/report-api';

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
        totalPreviousMonthBalance: '',
      };
    },

    watch: {
      date(newDate, oldDate) {
        this.initData();
      },

      transactions(oldTransactions, newTransactions) {
        this.initData();
      },
    },

    methods: {
      async initData() {
        var previousMonthDate = MoneviDateFormatter.minusMonth(this.date!);
        var datesBetween = MoneviDateFormatter.getFirstDateAndLastDateOfADate(previousMonthDate);

        var reports = await reportApi
          .getReports(null, this.organizationRegionId!, datesBetween[0], datesBetween[1], null)
          .then((response) => {
            return response.data.values;
          })
          .catch((error) => {
            console.log('Internal server error, unable to get previous month report');
            return;
          });

        this.setPreviousMonthbalance(reports);
        this.setTotalIncomeAndExpense();
      },

      setPreviousMonthbalance(previousMonthReports: any) {
        // Uncomment this if only want to update once
        // if (this.totalPreviousMonthBalance != '') {
        //   return;
        // }

        if (previousMonthReports == null || previousMonthReports.length == 0) {
          this.totalPreviousMonthBalance = 'N/A';
          return;
        }
        if (previousMonthReports[0].status != 'APPROVED_BY_SUPERVISOR') {
          this.totalPreviousMonthBalance = 'N/A';
          return;
        }
        var totalBalance = 0;
        for (var generalLedgerAccount of previousMonthReports[0].generalLedgerAccountValues) {
          totalBalance += generalLedgerAccount.amount;
        }
        this.totalPreviousMonthBalance = this.formatRupiah(totalBalance);
      },

      setTotalIncomeAndExpense() {
        // Uncomment this if only want to update once
        // if (this.totalExpense != 0 || this.totalIncome != 0) {
        //   return;
        // }

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
        return MoneviDisplayFormatter.toRupiah(
          MoneviDisplayFormatter.determineNumberByPositionType(amount, entryPosition)
        );
      },
    },
  };
</script>
