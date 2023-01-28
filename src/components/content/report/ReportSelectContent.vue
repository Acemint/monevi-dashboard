<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Laporan</h1>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4>Organisasi Kemahasiswaan</h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-bordered" id="table-1">
                <tr>
                  <th class="sorting" tabindex="0">No</th>
                  <th>Nama</th>
                  <th>Periode</th>
                  <th>Laporan Bulan</th>
                  <th>Aksi</th>
                </tr>
                <template v-for="(item, index) in organizations">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.organizationAbbreviation }}</td>
                    <td>{{ item.termOfOffice }}</td>
                    <td>
                      <select class="form-control selectric" v-model="organizationsMonthSelections[index]">
                        <option v-for="period of item.periodDate" v-bind:value="formatEpochToDate(period)">
                          {{ formatEpochToDate(period) }}
                        </option>
                      </select>
                    </td>
                    <td>
                      <button class="btn btn-primary" v-on:click="seeReportDetails" v-bind:data-index="index">
                        Lihat Laporan
                      </button>
                    </td>
                  </tr>
                </template>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { moneviAxios } from '@/api/configuration/monevi-axios';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import type { MoneviParamsGetOrganizationsWithReports } from '@/api/model/monevi-config';
  import { MoneviPath } from '@/api/path/path';
  import { FrontendRouteName } from '@/constants/path';

  export default {
    data: function () {
      return {
        organizations: new Array<any>(),
        organizationsMonthSelections: new Array<any>(),
      };
    },

    props: {
      regionId: String,
    },

    beforeMount() {
      this.getReports();
    },

    methods: {
      async getReports() {
        var params = {} as MoneviParamsGetOrganizationsWithReports;
        if (this.regionId == undefined) {
          return;
        }
        params.regionId = this.regionId;
        var organizationsData = await moneviAxios
          .get(MoneviPath.GET_ORGANIZATIONS_WITH_REPORT_PATH, {
            params: params,
            paramsSerializer: {
              indexes: null,
            },
          })
          .then((response) => {
            return response.data.values;
          })
          .catch((error) => {
            for (const key in error.response.data.errorFields) {
              var errorMessage = error.response.data.errorFields[key];
              alert(errorMessage);
              break;
            }
            console.error('internal server error, unable to get previous month data');
          });
        this.setOrganizationsData(organizationsData);
      },

      setOrganizationsData(organizationsData: any): void {
        var organizationIdAndPeriodMap: Map<String, any> = new Map();
        for (var organizationData of organizationsData) {
          if (
            !(
              organizationData.reportStatus == 'APPROVED_BY_CHAIRMAN' ||
              organizationData.reportStatus == 'APPROVED_BY_SUPERVISOR'
            )
          ) {
            continue;
          }
          if (organizationIdAndPeriodMap.get(organizationData.organizationRegionId) == undefined) {
            var periods = Array<string>();
            periods.push(organizationData.periodDate);
            organizationData.periodDate = periods;
            organizationIdAndPeriodMap.set(organizationData.organizationRegionId, organizationData);
          } else {
            var existingPeriods = organizationIdAndPeriodMap.get(organizationData.organizationRegionId).periodDate;
            existingPeriods.push(organizationData.periodDate);
          }
        }
        this.organizations = new Array<any>();
        this.organizationsMonthSelections = new Array<string>();
        var i = 0;
        for (var organization of organizationIdAndPeriodMap.values()) {
          this.organizations.push(organization);
          this.organizationsMonthSelections.push(this.formatEpochToDate(organization.periodDate[0]));
          i++;
        }
      },

      seeReportDetails(event: Event) {
        if (!(event.currentTarget instanceof HTMLButtonElement)) {
          return;
        }
        var index = parseInt(event.currentTarget.getAttribute('data-index')!);
        var selectedDate = this.organizationsMonthSelections[index];
        this.$router.push({
          name: FrontendRouteName.Report.DETAILS,
          query: { organization: this.organizations[index].organizationRegionId, period: selectedDate },
        });
      },

      formatEpochToDate(milliseconds: number) {
        return MoneviDateFormatter.formatDateDMYToMonthAndYear(MoneviDateFormatter.formatDate(milliseconds));
      },
    },

    components: {},
  };
</script>
