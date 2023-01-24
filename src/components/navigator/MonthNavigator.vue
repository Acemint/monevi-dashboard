<template>
  <template v-if="dates.length != 0">
    <nav class="d-inline-block">
      <ul class="pagination mb-0">
        <li v-bind:class="[currentDateIndex == 0 ? 'disabled' : '', 'page-item']">
          <a v-on:click="navigateDateByButton($event)" id="navigate-page-left" class="page-link" href="#" tabindex="-1"><i class="fas fa-chevron-left"></i></a>
        </li>

        <li class="page-item">
          <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{ formatDateToMonth(dates[currentDateIndex]) }}
          </button>
          <div class="dropdown-menu">
            <a v-on:click="navigateDateByDropdown($event)" v-for="item in dates" v-bind:data-date="item" class="dropdown-item"> {{ formatDateToMonth(item) }}</a>
          </div>
        </li>

        <li v-bind:class="[currentDateIndex == dates.length - 1 ? 'disabled' : '', 'page-item']">
          <a v-on:click="navigateDateByButton($event)" id="navigate-page-right" class="page-link" href="#"><i class="fas fa-chevron-right"></i></a>
        </li>
      </ul>
    </nav>
  </template>

  <template v-else> </template>
</template>

<script lang="ts">
  import moneviAxios from '@/api/configuration/monevi-axios';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import type { MoneviParamsGetReports } from '@/api/model/monevi-config';
  import { MoneviPath } from '@/api/path/path';
  import type { LocationQueryValue } from 'vue-router';

  export default {
    data: function () {
      return {
        dates: new Array<string>(),
        currentDateIndex: 0,
      };
    },

    emits: ['periodChange'],

    async beforeMount() {
      let START_DATE = '01/11/2022';
      let END_DATE = MoneviDateFormatter.formatDate(Date.now(), '/');

      var userData = MoneviCookieHandler.getUserData();

      var params = {} as MoneviParamsGetReports;
      if (userData.role == 'ROLE_TREASURER') {
        params.organizationRegionId = userData.organizationRegionId;
        params.startDate = START_DATE;
        params.endDate = END_DATE;
      } else if (userData.role == 'ROLE_CHAIRMAN') {
        params.organizationRegionId = userData.organizationRegionId;
        params.startDate = START_DATE;
        params.endDate = END_DATE;
      } else if (userData.role == 'ROLE_SUPERVISOR') {
        params.organizationRegionId = userData.organizationRegionId;
        params.startDate = START_DATE;
        params.endDate = END_DATE;
      }

      var dates = new Array<string>();
      var promiseReports = moneviAxios.get(MoneviPath.GET_REPORTS_PATH, { params: params });

      return promiseReports.then((response) => {
        for (var report of response.data.values) {
          // only return dates that are available to be seen on respective roles
          if (userData.role == 'ROLE_TREASURER') {
            dates.push(MoneviDateFormatter.formatDate(report.periodDate));
          } else if (userData.role == 'ROLE_CHAIRMAN') {
            if (report.status == 'UNAPPROVED' || report.status == 'APPROVED_BY_CHAIRMAN') {
              dates.push(MoneviDateFormatter.formatDate(report.periodDate));
            }
          } else if (userData.role == 'ROLE_SUPERVISOR') {
            if (report.status == 'APPROVED_BY_CHAIRMAN') {
              dates.push(MoneviDateFormatter.formatDate(report.periodDate));
            }
          }
        }
        this.dates = dates;
        if (this.dates.length == 0) {
          this.$emit('periodChange', 'N/A');
        } else {
          this.currentDateIndex = this.dates.length - 1;
          this.$emit('periodChange', this.dates[this.currentDateIndex]);
        }
      });
    },

    methods: {
      navigateDateByButton(event: MouseEvent) {
        if (event.currentTarget instanceof HTMLAnchorElement) {
          var target = this.currentDateIndex;
          if (event.currentTarget.id === 'navigate-page-right') {
            target += 1;
          } else if (event.currentTarget.id === 'navigate-page-left') {
            target -= 1;
          }
          this.currentDateIndex = target;
          this.$emit('periodChange', this.dates[target]);
        }
      },

      navigateDateByDropdown(event: MouseEvent) {
        if (event.currentTarget instanceof HTMLAnchorElement) {
          var selectedDate = event.currentTarget.getAttribute('data-date');
          var i = 0;
          for (var date of this.dates) {
            if (selectedDate == date) {
              this.currentDateIndex = i;
              this.$emit('periodChange', date);
              break;
            }
            i++;
          }
        }
      },

      formatDateToMonth(date: string): string {
        return MoneviDateFormatter.formatDateDMYToMonthAndYear(date);
      },

      formatMonthToDate(date: string | LocationQueryValue[]): string {
        if (typeof date === 'object') {
          return '';
        }
        return MoneviDateFormatter.formatMonthAndYearToDateDMY(date);
      },
    },
  };
</script>
