<template>
  <div class="col-lg-6 col-md-6 col-sm-6 col-12">
    <div class="card card-statistic-1">
      <div class="card-icon bg-danger">
        <i class="fas fa-regular fa-file-alt"></i>
      </div>
      <div class="card-wrap">
        <div class="card-header">
          <h4>Total Laporan yang Belum di Periksa</h4>
        </div>
        <div class="card-body">{{ reports.length }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
  import type { MoneviReport } from '@/api/model/monevi-model';
  import { reportApi } from '@/api/service/report-api';

  export default {
    data: function () {
      return {
        userAccount: MoneviCookieHandler.getUserData(),
        reports: new Array<MoneviReport>(),
      };
    },

    beforeMount() {
      this.getReports();
    },

    methods: {
      async getReports() {
        await reportApi
          .getReports(this.userAccount.regionId, null, null, null, 'APPROVED_BY_CHAIRMAN')
          .then((response) => {
            this.reports = response.data.values;
            return;
          })
          .catch((error) => {
            return new Array<MoneviReport>();
          });
      },
    },
  };
</script>
