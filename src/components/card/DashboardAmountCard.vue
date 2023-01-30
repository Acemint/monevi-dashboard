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
          <div class="card-body">{{ formatRupiah(totalBalance) }}</div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-6 col-12">
      <div class="card card-statistic-1">
        <div class="card-icon bg-warning">
          <i class="fas fa-money-bill-wave"></i>
        </div>
        <div class="card-wrap">
          <div class="card-header">
            <h4>Saldo Kas</h4>
          </div>
          <div class="card-body">{{ formatRupiah(totalCash) }}</div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-6 col-12">
      <div class="card card-statistic-1">
        <div class="card-icon bg-warning">
          <i class="fas fa-piggy-bank"></i>
        </div>
        <div class="card-wrap">
          <div class="card-header">
            <h4>Saldo Bank</h4>
          </div>
          <div class="card-body">{{ formatRupiah(totalBank) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import { walletApi } from '@/api/service/wallet-api';

  export default {
    data: function () {
      return {
        totalBalance: 0,
        totalCash: 0,
        totalBank: 0,
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },

    beforeMount() {
      this.setCurrentMonthBalance();
    },

    methods: {
      async setCurrentMonthBalance() {
        var cash = await walletApi
          .getWallet('CASH', this.userAccount.organizationRegionId)
          .then((response) => {
            return response.data.value.total;
          })
          .catch((error) => {
            return 'N/A';
          });

        var bank = await walletApi
          .getWallet('BANK', this.userAccount.organizationRegionId)
          .then((response) => {
            return response.data.value.total;
          })
          .catch((error) => {
            return 'N/A';
          });

        if (bank == 'N/A' || cash == 'N/A') {
          this.totalBalance = 0;
          return;
        }
        this.totalBank = bank;
        this.totalCash = cash;
        this.totalBalance = bank + cash;
      },

      formatRupiah(amount: number, entryPosition: string = 'DEBIT') {
        return MoneviDisplayFormatter.toRupiah(
          MoneviDisplayFormatter.determineNumberByPositionType(amount, entryPosition)
        );
      },
    },
  };
</script>
