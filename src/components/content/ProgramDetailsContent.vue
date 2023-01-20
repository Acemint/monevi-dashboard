<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Program Kerja</h1>
      <div style="display: flex">
        <div class="section-header-button">
          <button class="btn btn-primary" v-on:click="openNewProgramModal">Tambah Program Kerja</button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4>Rencana Program Kerja</h4>
          </div>

          <div class="card-body" v-if="programs.length != 0">
            <div class="table-responsive">
              <table v-if="role === 'ROLE_SUPERVISOR'" class="table table-striped table-bordered" id="table-1">
                <tr>
                  <th class="sorting" tabindex="0">No</th>
                  <th>Program Kerja</th>
                  <th>Budget</th>
                  <th>Jumlah Subsidi</th>
                  <th>Tambah Subsidi</th>
                  <th>Tanggal Mulai</th>
                  <th>Tanggal Selesai</th>
                </tr>
                <tr v-for="(item, index) in programs">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ formatToRupiah(item.budget) }}</td>
                  <td>{{ formatToRupiah(item.subsidy) }}</td>
                  <td><button class="btn btn-primary"></button></td>
                  <td>{{ formatDate(item.startDate) }}</td>
                  <td>{{ formatDate(item.endDate) }}</td>
                </tr>
              </table>

              <table v-else class="table table-striped table-bordered" id="table-1">
                <tr>
                  <th class="sorting" tabindex="0">No</th>
                  <th>Program Kerja</th>
                  <th>Budget</th>
                  <th>Jumlah Subsidi</th>
                  <th>Tanggal Mulai</th>
                  <th>Tanggal Selesai</th>
                </tr>
                <tr v-for="(item, index) in programs">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ formatToRupiah(item.budget) }}</td>
                  <td>{{ formatToRupiah(item.subsidy) }}</td>
                  <td>{{ formatDate(item.startDate) }}</td>
                  <td>{{ formatDate(item.endDate) }}</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="card-body" v-else>
            <p>Tidak ada program kerja yang tersedia saat ini</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <ProgramEditSubsidyModal v-bind:programId="selectedProgramId" v-on:success-update="getPrograms" ref="editSubsidyModal" />
  <ProgramAddProgramKerjaModal v-bind:organizationRegionId="organizationRegionId" v-on:success-update="getPrograms" ref="addProgramModal" />
</template>

<script lang="ts">
  import ProgramAddProgramKerjaModal from '@/components/modal/ProgramAddProgramKerjaModal.vue';
  import ProgramEditSubsidyModal from '@/components/modal/ProgramEditSubsidyModal.vue';
  import type { Program } from '@/api/model/monevi-model';
  import moneviAxios from '@/api/configuration/monevi-axios';
  import { MoneviPath } from '@/api/path/path';
  import type { MoneviParamsGetPrograms } from '@/api/model/monevi-config';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';

  export default {
    data: function () {
      return {
        programs: new Array<Program>(),
        selectedProgramId: '',
      };
    },

    components: {
      ProgramAddProgramKerjaModal,
      ProgramAddSubsidyModal: ProgramEditSubsidyModal,
    },

    props: {
      organizationRegionId: String,
      role: String,
    },

    beforeMount() {
      this.getPrograms();
    },

    methods: {
      async getPrograms() {
        this.programs = new Array<Program>();
        var params = {} as MoneviParamsGetPrograms;
        if (this.organizationRegionId == null) {
          console.error('internal server error, unable to get organization region id');
          return;
        }
        params.organizationRegionId = this.organizationRegionId;
        this.programs = await moneviAxios
          .get(MoneviPath.GET_PROGRAMS_PATH, {
            params: params,
            paramsSerializer: {
              indexes: null,
            },
          })
          .then((response) => {
            return response.data.values;
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

      formatDate(date: number) {
        return MoneviDateFormatter.formatDate(date);
      },

      formatToRupiah(value: number) {
        return MoneviDisplayFormatter.toRupiah(value);
      },

      openNewProgramModal(event: Event) {
        var addProgramModal: any = this.$refs.addProgramModal;
        addProgramModal.showModal();
      },

      openEditSubsidyModal(event: Event) {
        if (event.currentTarget instanceof HTMLButtonElement) {
          this.selectedProgramId = event.currentTarget.id;
        }
        this.$nextTick(() => {
          var editSubsidyModal: any = this.$refs.editSubsidyModal;
          editSubsidyModal.showModal();
        });
      },
    },
  };
</script>
