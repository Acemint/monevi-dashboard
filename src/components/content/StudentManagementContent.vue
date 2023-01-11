<template>
    <section class="section">
        <div class="section-header" style="justify-content: space-between;">
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
                            <form>
                                <div class="input-group">
                                    <input v-model="search" type="text" class="form-control" placeholder="Search">
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
                                    <td> {{ index + 1 }} </td>
                                    <td> {{ item.nim }} </td>
                                    <td> {{ item.fullname }} </td>
                                    <td> {{ item.email }} </td>
                                    <td> {{ item.role }} </td>
                                    <td> {{ item.orgAbbreviation }}</td>
                                    <td> {{ item.periodYear }} </td>
                                    <td>
                                        <button v-on:click="setStudentId(item.id)" class="btn btn-primary" data-toggle="modal" data-target="#acceptStudent">
                                            Terima
                                        </button>
                                        <button v-on:click="setStudentId(item.id)" class="btn btn-danger" data-toggle="modal" data-target="#rejectStudent ">
                                            Tolak
                                        </button>
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
        v-bind:studentId = "studentId"/>
    <StudentManagementRejectStudentModal 
        v-bind:studentId = "studentId"/>
</template>

<script lang="ts">
    // TODO: Search button applies to all properties not only to name
    // TODO: Ignore case on search from API
    import {
        MoneviAPI
    } from '@/api/methods/monevi-api';
    import type {
        UserAccountDetails
    } from '@/api/model/monevi-model';
    import StudentManagementAcceptStudentModal from '@/components/modal/StudentManagementAcceptStudentModal.vue';
    import StudentManagementRejectStudentModal from '@/components/modal/StudentManagementRejectStudentModal.vue';


    export default {

        components: {
            StudentManagementAcceptStudentModal,
            StudentManagementRejectStudentModal
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
            search(newSearch, oldSearch) {
                this.getLockedStudents();
            }
        },

        methods: {

            async getLockedStudents() {
                if (this.regionId === undefined) {
                    return;
                }
                var role;
                if (this.roleFilter === "Semua") {
                    role = null;
                } else {
                    role = this.roleFilter;
                }
                await this.monevi_api.getStudents(
                        this.search,
                        null,
                        this.regionId,
                        null,
                        null,
                        role,
                    )
                    .then(data => {
                        this.lockedStudents = new Array < UserAccountDetails > ();
                        for (var datum of data) {
                            this.lockedStudents.push(datum);
                        }
                    });
            },

            setStudentId(studentId: string) {
                this.studentId = studentId;
            },
        },

        data: function () {
            return {
                monevi_api: new MoneviAPI(),
                roleFilter: "Semua",
                search: "",
                lockedStudents: new Array < UserAccountDetails > (),
                studentId: ""
            }
        }

    }
</script>
