<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Kelola Organisasi</h1>
      <div style="display: flex">
        <div class="section-header-button">
          <button class="btn btn-primary" v-on:click="openOrganizationAddNewModal($event)">Tambah Organisasi Kemahasiswaan</button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <h5>Filter</h5>
          </div>
          <div class="card-body">
            <div class="form-row">
              <div class="form-group col">
                <label for="inputCity">Berdasarkan area kampus</label>
                <select v-model="regionFilter" id="inputState" class="form-control">
                  <option selected>Semua</option>
                  <option v-for="region of regions">Binus @{{ region.name }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4>Kelola Organisasi</h4>
            <div class="card-header-action">
              <form v-on:submit="search">
                <div class="input-group">
                  <input v-model="searchTerm" type="text" class="form-control" placeholder="Search" />
                  <div class="input-group-btn">
                    <button class="btn btn-primary"><i class="fas fa-search"></i></button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table v-bind:class="['table table-striped table-bordered']" id="table-1">
                <tr>
                  <th class="sorting" tabindex="0" rowspan="2">No</th>
                  <th rowspan="2">Nama Organisasi Kemahasiswaan</th>
                  <th colspan="10">Area Kampus</th>
                </tr>
                <tr>
                  <th ref="regionKeys" v-bind:id="data.name" v-for="data of regions">BINUS @{{ data.name }}</th>
                </tr>
                <tr v-for="(item, index) in organizations" ref="organizationRegionTable">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td ref="organizationRegionExistCells" v-bind:id="item.name" v-for="data of regions"></td>
                </tr>
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

  <OrganizationAddOrganizationModal v-on:success-add-organization="initializeData" v-bind:regions="regions" ref="organizationAddOrganizationModal" />
</template>

<script lang="ts">
  import moneviAxios from '@/api/configuration/monevi-axios';
  import type { MoneviParamsGetOrganizations } from '@/api/model/monevi-config';
  import type { Organization, Region } from '@/api/model/monevi-model';
  import { MoneviPath } from '@/api/path/path';
  import OrganizationAddOrganizationModal from '../modal/OrganizationAddOrganizationModal.vue';

  export default {
    // TODO: Implement pagination
    data: function () {
      return {
        regions: new Array<Region>(),
        organizations: new Array<Organization>(),
        maxOrganizationsLength: 0,
        regionFilter: 'Semua',
        searchTerm: '',
      };
    },

    watch: {
      regionFilter(newRegion, oldRegion) {
        this.initializeData();
      },
    },

    beforeMount() {
      this.initializeData();
    },

    methods: {
      async initializeData() {
        this.regions = await this.getRegions();
        this.organizations = await this.getOrganizations();
        this.$nextTick(() => {
          this.initializeTable();
        });
      },

      initializeTable() {
        var regionIndexing = new Array<string>();
        if (this.$refs.regionKeys instanceof Array<HTMLTableCellElement>) {
          for (var regionKey of this.$refs.regionKeys) {
            regionIndexing.push(regionKey.id);
          }
        }
        if (this.$refs.organizationRegionExistCells instanceof Array<HTMLTableCellElement>) {
          var i = 0;
          for (var organization of this.organizations) {
            var j = 0;
            for (var regionName of regionIndexing) {
              if (organization.regionNames.includes(regionName)) {
                this.$refs.organizationRegionExistCells[i * regionIndexing.length + j].innerHTML = 'V';
              } else {
                this.$refs.organizationRegionExistCells[i * regionIndexing.length + j].innerHTML = '';
              }
              j++;
            }
            i++;
          }
        }
      },

      search(event: Event) {
        event.preventDefault();
        this.initializeData();
      },

      async getRegions() {
        var regions: Array<Region> = new Array<Region>();
        await moneviAxios
          .get(MoneviPath.GET_REGIONS_PATH, {
            params: {},
            paramsSerializer: {
              indexes: null,
            },
          })
          .then((response) => {
            regions = response.data.values;
          })
          .catch((error) => {
            console.error('internal server error, unable to get regions');
            return;
          });
        return regions;
      },

      async getOrganizations() {
        var params = {} as MoneviParamsGetOrganizations;
        if (this.regionFilter != 'Semua') {
          params.regionName = this.regionFilter.split('Binus @')[1];
        }
        params.searchTerm = this.searchTerm;
        var organizations: Array<Organization> = new Array<Organization>();
        await moneviAxios
          .get(MoneviPath.GET_ORGANIZATIONS_PATH, {
            params: params,
            paramsSerializer: {
              indexes: null,
            },
          })
          .then((response) => {
            organizations = response.data.values;
          })
          .catch((error) => {
            console.error('internal server error, unable to get organization');
            return;
          });
        return organizations;
      },

      openOrganizationAddNewModal(event: MouseEvent) {
        var organizationAddOrganizationModal: any = this.$refs.organizationAddOrganizationModal;
        organizationAddOrganizationModal.showModal();
      },
    },
    components: { OrganizationAddOrganizationModal },
  };
</script>
