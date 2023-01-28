<template>
  <section class="section">
    <div class="section-header">
      <h1>Dashboard - Ketua</h1>
    </div>

    <DashboardAmountCard />

    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <h4>Recent Activities</h4>
          </div>
          <div class="card-body" v-if="histories.length != 0">
            <ul class="list-unstyled list-unstyled-border">
              <template v-for="history of histories">
                <li class="media">
                  <img class="mr-3 rounded-circle" width="50" src="@/assets/img/avatar/avatar-1.png" alt="avatar" />
                  <div class="media-body">
                    <div class="float-right text-primary">{{ formatDate(history.createdDate) }}</div>
                    <div class="media-title">{{ history.userName }}</div>
                    <span class="text-small text-muted">{{ getHistoryMessage(history) }}</span>
                  </div>
                </li>
              </template>
            </ul>
          </div>

          <div class="card-body" v-else>
            <p>Belum ada aktivitas yang dapat dilihat</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { historyApi } from '@/api/service/history-api';
  import DashboardAmountCard from '@/components/card/DashboardAmountCard.vue';
  import { getHistoryMessage } from '@/util/history-util';

  export default {
    async beforeMount() {
      await this.initData();
    },

    data: function () {
      return {
        histories: new Array<any>(),
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },

    methods: {
      async initData() {
        this.histories = await historyApi.getHistories(this.userAccount.id);
      },

      getHistoryMessage(history: any) {
        return getHistoryMessage(this.userAccount.role, history.remarks, history.reportPeriod);
      },

      formatDate(date: any) {
        return MoneviDateFormatter.formatDate(date);
      },
    },
    components: { DashboardAmountCard },
  };
</script>
