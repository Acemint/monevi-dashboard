<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Program Kerja</h1>
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
                  <th>Aksi</th>
                </tr>
                <template v-for="(item, index) of organizations">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.organizationAbbreviation }}</td>
                    <td>{{ item.periodYear }}</td>
                    <td>
                      <button v-on:click="selectProgram($event)" v-bind:data-index="index" class="btn btn-primary">Lihat Program Kerja</button>
                    </td>
                  </tr>
                </template>
              </table>
            </div>
          </div>
          <div class="card-footer text-right">
            <nav class="d-inline-block">
              <ul class="pagination mb-0">
                <li class="page-item disabled">
                  <a class="page-link" href="#" tabindex="-1"><i class="fas fa-chevron-left"></i></a>
                </li>
                <li class="page-item active">
                  <a class="page-link" href="#">1 <span class="sr-only">(current)</span></a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">2</a>
                </li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item">
                  <a class="page-link" href="#"><i class="fas fa-chevron-right"></i></a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import type { OrganizationWithProgram } from '@/api/model/monevi-model';
  import type { MoneviParamsGetOrganizationsWithPrograms } from '@/api/model/monevi-config';
  import moneviAxios from '@/api/configuration/monevi-axios';
  import { MoneviPath } from '@/api/path/path';
  import { FrontendRouteName } from '@/constants/path';

  export default {
    data: function () {
      return {
        organizations: new Array<OrganizationWithProgram>(),
      };
    },

    props: {
      regionId: String,
    },

    beforeMount() {
      this.getPrograms();
    },

    methods: {
      async getPrograms() {
        var params = {} as MoneviParamsGetOrganizationsWithPrograms;
        if (this.regionId == undefined) {
          return;
        }
        params.regionId = this.regionId;
        await moneviAxios
          .get(MoneviPath.GET_ORGANIZATIONS_WITH_PROGRAMS_PATH, {
            params: params,
            paramsSerializer: {
              indexes: null,
            },
          })
          .then((response) => {
            this.organizations = response.data.values;
          })
          .catch((error) => {
            if (error.response.status == 500 || error.response.status == 400) {
              for (const key in error.response.data.errorFields) {
                var errorMessage = error.response.data.errorFields[key];
                alert(errorMessage);
                break;
              }
            }
          });
      },

      selectProgram(event: MouseEvent) {
        if (!(event.currentTarget instanceof HTMLButtonElement)) {
          return;
        }
        var indexAttribute = event.currentTarget.getAttribute('data-index');
        if (indexAttribute == null) {
          return;
        }
        var index = parseInt(indexAttribute);
        this.$router.push({ name: FrontendRouteName.Program.DETAILS, query: { organization: this.organizations[index].organizationRegionId } });
      },
    },
  };
</script>
