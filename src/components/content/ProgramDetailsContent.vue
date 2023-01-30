<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Program Kerja</h1>
      <div style="display: flex">
        <div
          class="section-header-button"
          v-if="userAccount.role === 'ROLE_CHAIRMAN' || userAccount.role === 'ROLE_TREASURER'">
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
              <table class="table table-striped table-bordered" id="table-1">
                <tbody>
                  <tr>
                    <th class="sorting" tabindex="0">No</th>
                    <th>Program Kerja</th>
                    <th>Budget</th>
                    <th>Jumlah Subsidi</th>
                    <th>Tanggal Mulai</th>
                    <th>Tanggal Selesai</th>
                    <th>Aksi</th>
                  </tr>
                  <template v-for="(item, index) in programs">
                    <tr>
                      <td>{{ index + 1 }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ formatToRupiah(item.budget!) }}</td>
                      <td>{{ formatToRupiah(item.subsidy!) }}</td>
                      <td>{{ formatDate(item.startDate!) }}</td>
                      <td>{{ formatDate(item.endDate!) }}</td>
                      <td v-if="userAccount.role == 'ROLE_SUPERVISOR'">
                        <button
                          v-if="item.lockedProgram == false"
                          v-on:click="openLockProgramModal"
                          ref="lockButton"
                          v-bind:data-index="index"
                          class="btn btn-primary">
                          <i class="far fa-lock"></i>
                        </button>
                        <button
                          v-on:click="openEditProgramModal"
                          ref="editButton"
                          v-bind:data-index="index"
                          class="btn btn-primary">
                          <i class="far fa-edit"></i>
                        </button>
                        <button
                          v-on:click="openDeleteProgramModal"
                          ref="deleteButton"
                          v-bind:data-index="index"
                          class="btn btn-danger">
                          <i class="far fa-trash-alt"></i>
                        </button>
                      </td>
                      <td v-else>
                        <template v-if="item.lockedProgram != true">
                          <button
                            v-on:click="openEditProgramModal"
                            ref="editButton"
                            v-bind:data-index="index"
                            class="btn btn-primary">
                            Ubah
                          </button>
                          <button
                            v-on:click="openDeleteProgramModal"
                            ref="deleteButton"
                            v-bind:data-index="index"
                            class="btn btn-danger">
                            Hapus
                          </button>
                        </template>
                        <template v-else>
                          <p>Sudah dikunci oleh pengawas</p>
                        </template>
                      </td>
                    </tr>
                  </template>
                </tbody>
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

  <ProgramLockModal
    v-bind:program="selectedProgram"
    v-bind:userAccount="userAccount"
    v-on:success-update="getPrograms"
    ref="lockProgramModal" />
  <ProgramEditModal
    v-bind:program="selectedProgram"
    v-bind:userAccount="userAccount"
    v-on:success-update="getPrograms"
    ref="editProgramModal" />
  <ProgramDeleteModal v-bind:program="selectedProgram" v-on:success-update="getPrograms" ref="deleteProgramModal" />
  <ProgramAddProgramKerjaModal
    v-bind:organizationRegionId="organizationRegionId"
    v-bind:userId="userAccount.id"
    v-on:success-update="getPrograms"
    ref="addProgramModal" />
</template>

<script lang="ts">
  import ProgramAddProgramKerjaModal from '@/components/modal/ProgramAddProgramKerjaModal.vue';
  import ProgramEditModal from '@/components/modal/ProgramEditModal.vue';
  import ProgramDeleteModal from '@/components/modal/ProgramDeleteModal.vue';
  import ProgramLockModal from '@/components/modal/ProgramLockmodal.vue';
  import { Program } from '@/api/model/monevi-model';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { FrontendRouteName } from '@/constants/path';
  import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
  import { programApi } from '@/api/service/program-api';

  export default {
    data: function () {
      return {
        programs: new Array<Program>(),
        selectedProgram: new Program(),
        organizationRegionId: '',
        periodYear: null,
        userAccount: MoneviCookieHandler.getUserData(),
      };
    },

    components: {
      ProgramAddProgramKerjaModal,
      ProgramEditModal,
      ProgramDeleteModal,
      ProgramLockModal,
    },

    beforeMount() {
      this.validateRole();
      this.getPrograms();
    },

    methods: {
      async getPrograms() {
        this.programs = await programApi.getPrograms(this.organizationRegionId, this.periodYear);
      },

      validateRole() {
        if (this.userAccount.role === 'ROLE_SUPERVISOR') {
          // validate organization region
          if (this.$route.query.organization == undefined) {
            return this.$router.push({ name: FrontendRouteName.Error.ERROR_404 });
          }
          var organizationId: any = this.$route.query.organization;
          this.organizationRegionId = organizationId;

          // validate period year
          if (this.$route.query.periodYear == undefined) {
            return this.$router.push({ name: FrontendRouteName.Error.ERROR_404 });
          }
          var currentYear = new Date().getFullYear();
          var periodYear: any = this.$route.query.periodYear;
          if (currentYear < parseInt(periodYear)) {
            return this.$router.push({ name: FrontendRouteName.Error.ERROR_404 });
          }
          this.periodYear = periodYear;
        } else {
          this.organizationRegionId = this.userAccount.organizationRegionId;
        }
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

      openEditProgramModal(event: Event) {
        var button: any = event.currentTarget;
        var index: any = button.getAttribute('data-index');
        this.selectedProgram = this.programs[index];
        this.$nextTick(() => {
          var editProgramModal: any = this.$refs.editProgramModal;
          editProgramModal.showModal();
        });
      },

      openDeleteProgramModal(event: Event) {
        var button: any = event.currentTarget;
        var index: any = button.getAttribute('data-index');
        this.selectedProgram = this.programs[index];
        this.$nextTick(() => {
          var deleteProgramModal: any = this.$refs.deleteProgramModal;
          deleteProgramModal.showModal();
        });
      },

      openLockProgramModal(event: Event) {
        var button: any = event.currentTarget;
        var index: any = button.getAttribute('data-index');
        this.selectedProgram = this.programs[index];
        this.$nextTick(() => {
          var lockProgramModal: any = this.$refs.lockProgramModal;
          lockProgramModal.showModal();
        });
      },
    },
  };
</script>
