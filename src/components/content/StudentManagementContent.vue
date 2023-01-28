<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Kelola Pengurus</h1>
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
                <label for="inputCity">Berdasarkan peran</label>
                <select v-model="roleFilter" id="inputState" class="form-control">
                  <option selected>Semua</option>
                  <option>Ketua</option>
                  <option>Bendahara</option>
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
            <h4>Kelola Pengurus</h4>
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
              <table class="table table-striped table-bordered" id="table-1">
                <tr>
                  <th class="sorting" tabindex="0">No</th>
                  <th>NIM</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Peran</th>
                  <th>Organisasi</th>
                  <th>Periode</th>
                  <th>Aksi</th>
                </tr>
                <tr v-for="(item, index) in lockedStudents">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.nim }}</td>
                  <td>{{ item.fullname }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ formatRole(item.role) }}</td>
                  <td>{{ item.orgAbbreviation }}</td>
                  <td>{{ item.periodYear }}</td>
                  <td>
                    <button v-on:click="openStudentAcceptModal" ref="acceptButton" class="btn btn-primary">
                      Terima
                    </button>
                    <button v-on:click="openStudentRejectModal" ref="rejectButton" class="btn btn-danger">Tolak</button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <StudentManagementAcceptStudentModal
    ref="studentAcceptModal"
    v-bind:studentId="studentId"
    v-on:success-update="getLockedStudents" />
  <StudentManagementRejectStudentModal
    ref="studentRejectModal"
    v-bind:studentId="studentId"
    v-on:success-update="getLockedStudents" />
</template>

<script lang="ts">
  import moneviAxios from '@/api/configuration/monevi-axios';
  import { MoneviDisplayFormatter } from '@/api/methods/monevi-display-formatter';
  import { MoneviEnumConverter } from '@/api/methods/monevi-enum-converter';
  import type { MoneviParamsGetStudents } from '@/api/model/monevi-config';
  import type { UserAccountDetails } from '@/api/model/monevi-model';
  import { MoneviPath } from '@/api/path/path';
  import StudentManagementAcceptStudentModal from '@/components/modal/StudentManagementAcceptStudentModal.vue';
  import StudentManagementRejectStudentModal from '@/components/modal/StudentManagementRejectStudentModal.vue';

  export default {
    components: {
      StudentManagementAcceptStudentModal,
      StudentManagementRejectStudentModal,
    },

    props: {
      regionId: String,
    },

    beforeMount() {
      this.getLockedStudents();
    },

    watch: {
      roleFilter(newRole, oldRole) {
        this.getLockedStudents();
      },
    },

    methods: {
      async getLockedStudents() {
        var params = {} as MoneviParamsGetStudents;
        if (this.regionId === undefined) {
          console.error('internal server error, no region is found on user');
          return;
        }
        if (this.searchTerm != '') {
          params.studentName = this.searchTerm;
        }
        params.regionId = this.regionId;
        if (this.roleFilter != 'Semua') {
          params.studentRole = MoneviEnumConverter.convertUserAccountRole(this.roleFilter);
        }
        return moneviAxios
          .get(MoneviPath.GET_STUDENTS_PATH, {
            params: params,
            paramsSerializer: {
              indexes: null,
            },
          })
          .then((response) => {
            this.lockedStudents = response.data.values;
            return response;
          })
          .then((response) => {
            if (this.$refs.acceptButton instanceof Array<HTMLButtonElement>) {
              let i = 0;
              for (var button of this.$refs.acceptButton) {
                button.id = response.data.values[i].id;
                i++;
              }
            }
            if (this.$refs.rejectButton instanceof Array<HTMLButtonElement>) {
              let i = 0;
              for (var button of this.$refs.rejectButton) {
                button.id = response.data.values[i].id;
                i++;
              }
            }
          })
          .catch((error) => {
            console.error('internal server error, unable to get students data');
          });
      },

      search(event: Event) {
        event.preventDefault();
        this.getLockedStudents();
      },

      setStudentId(studentId: string) {
        this.studentId = studentId;
      },

      formatRole(role: string) {
        return MoneviDisplayFormatter.convertUserAccountRoleForDisplay(role);
      },

      openStudentAcceptModal(event: Event) {
        if (event.currentTarget instanceof HTMLButtonElement) {
          this.studentId = event.currentTarget.id;
        }
        this.$nextTick(() => {
          var studentAcceptModal: any = this.$refs.studentAcceptModal;
          studentAcceptModal.showModal();
        });
      },

      openStudentRejectModal(event: Event) {
        if (event.currentTarget instanceof HTMLButtonElement) {
          this.studentId = event.currentTarget.id;
        }
        this.$nextTick(() => {
          var studentRejectModal: any = this.$refs.studentRejectModal;
          studentRejectModal.showModal();
        });
      },
    },

    data: function () {
      return {
        roleFilter: 'Semua',
        searchTerm: '',
        lockedStudents: new Array<UserAccountDetails>(),
        studentId: '',
      };
    },
  };
</script>
