<template>
  <nav class="d-inline-block">
    <ul class="pagination mb-0">
      <li v-bind:class="[currentDateIndex == 0 ? 'disabled' : '', 'page-item']">
        <a v-on:click="navigateDate($event)" id="navigate-page-left" class="page-link" href="#" tabindex="-1"><i class="fas fa-chevron-left"></i></a>
      </li>

      <li class="page-item">
        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ formatDateToMonth(dates[currentDateIndex]) }}
        </button>
        <div class="dropdown-menu">
          <a v-on:click="changeDate($event)" v-for="item in dates" v-bind:id="item" class="dropdown-item"> {{ formatDateToMonth(item) }}</a>
        </div>
      </li>

      <li v-bind:class="[currentDateIndex == dates.length - 1 ? 'disabled' : '', 'page-item']">
        <a v-on:click="navigateDate($event)" id="navigate-page-right" class="page-link" href="#"><i class="fas fa-chevron-right"></i></a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import type { LocationQueryValue } from 'vue-router';

  export default {
    data: function () {
      return {
        dates: new Array<string>(),
        currentDateIndex: 0,
      };
    },

    beforeMount() {
      let START_DATE = '2022-11-01';
      let END_DATE = Date.now();
      this.dates = MoneviDateFormatter.getMonthsFromDatesBetween(START_DATE, END_DATE);

      if (this.$route.query.period == undefined) {
        this.$router.push({ name: this.currentRouteName, query: { period: this.formatDateToMonth(this.dates[this.currentDateIndex]) } });
        return;
      }

      var originalDate = this.formatMonthToDate(this.$route.query.period);
      var i = 0;
      for (var date of this.dates) {
        if (date === originalDate) {
          this.currentDateIndex = i;
        }
        i++;
      }
      this.$emit('periodChange', this.dates[this.currentDateIndex]);
      this.$router.push({ name: this.currentRouteName, query: { period: this.formatDateToMonth(this.dates[this.currentDateIndex]) } });
    },

    watch: {
      '$route.query.period': {
        handler: function (queryPeriod) {
          var i = 0;
          for (var date of this.dates) {
            if (queryPeriod == this.formatDateToMonth(date)) {
              this.currentDateIndex = i;
              this.$emit('periodChange', date);
              break;
            }
            i++;
          }
        },
        deep: true,
      },
    },

    methods: {
      navigateDate(event: MouseEvent) {
        if (event.currentTarget instanceof HTMLAnchorElement) {
          var target = this.currentDateIndex;
          if (event.currentTarget.id === 'navigate-page-right') {
            target += 1;
          } else if (event.currentTarget.id === 'navigate-page-left') {
            target -= 1;
          }
          try {
            this.$router.push({ name: this.currentRouteName, query: { period: this.formatDateToMonth(this.dates[target]) } });
          } catch {
            return;
          }
        }
      },

      changeDate(event: MouseEvent) {
        if (event.currentTarget instanceof HTMLAnchorElement) {
          this.$router.push({ name: this.currentRouteName, query: { period: MoneviDateFormatter.formatDateDMYToMonthAndYear(event.currentTarget.id) } });
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

    props: {
      currentRouteName: String,
    },
  };
</script>
