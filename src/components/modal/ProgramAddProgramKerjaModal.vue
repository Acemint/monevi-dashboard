<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="addProgramModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tambah Program Kerja</h5>
          <button v-on:click="closeModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form method="POST">
            <div class="form-group">
              <label for="proker">Program Kerja*</label>
              <input v-model="programName" id="proker" type="text" class="form-control" name="proker" />
              <div class="invalid-feedback"></div>
            </div>

            <div class="form-group">
              <label for="budget">Budget*</label>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input
                  v-model.number="budget"
                  id="budget"
                  type="number"
                  class="form-control"
                  name="budget"
                  aria-label="Bugdet (dalam rupiah)" />
              </div>
            </div>

            <div class="form-group">
              <label for="subsidi">Jumlah Subsidi*</label>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input
                  v-model.number="subsidy"
                  id="subsidi"
                  type="number"
                  class="form-control"
                  name="subsidi"
                  aria-label="Jumlah Subsidi (dalam rupiah)" />
              </div>
            </div>

            <div class="form-group">
              <label for="tanggal-mulai">Tanggal Mulai*</label>
              <input v-model="startDate" id="tanggal-mulai" type="date" class="form-control" name="tanggal-mulai" />
              <div class="invalid-feedback"></div>
            </div>

            <div class="form-group">
              <label for="tanggal-selesai">Tanggal Selesai*</label>
              <input v-model="endDate" id="tanggal-selesai" type="date" class="form-control" name="tanggal-selesai" />
              <div class="invalid-feedback"></div>
            </div>
          </form>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button ref="closeModalButton" v-on:click="closeModal" type="button" class="btn btn-secondary">Tutup</button>
          <button v-on:click="submitNewProgram" type="button" class="btn btn-primary">Tambah Program Kerja</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { moneviAxios } from '@/api/configuration/monevi-axios';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import type { MoneviBodyCreateProgram } from '@/api/model/monevi-config';
  import { MoneviPath } from '@/api/path/path';

  export default {
    data: function () {
      return {
        programName: '',
        budget: '',
        subsidy: '',
        startDate: '',
        endDate: '',
      };
    },

    props: {
      organizationRegionId: String,
      userId: String,
    },

    watch: {
      startDate(newDate, oldDate) {
        var tzOffset = new Date().getTimezoneOffset() * 60000;
        var todayDate = new Date();
        todayDate.setHours(0);
        todayDate.setMinutes(0);
        todayDate.setSeconds(0);
        todayDate.setMilliseconds(0);
        if (new Date(newDate).getTime() < todayDate.getTime() - tzOffset) {
          alert('Tidak bisa memasukkan tanggal yang sudah lewat');
          this.startDate = '';
        }
      },

      endDate(newDate, oldDate) {
        var tzOffset = new Date().getTimezoneOffset() * 60000;
        var todayDate = new Date();
        todayDate.setHours(0);
        todayDate.setMinutes(0);
        todayDate.setSeconds(0);
        todayDate.setMilliseconds(0);
        if (new Date(newDate).getTime() < todayDate.getTime() - tzOffset) {
          alert('Tidak bisa memasukkan tanggal yang sudah lewat');
          this.endDate = '';
        }
      },
    },

    methods: {
      async submitNewProgram(event: Event) {
        event.preventDefault();
        var body = {} as MoneviBodyCreateProgram;
        if (this.programName == '') {
          alert('Mohon nama program kerja');
          return;
        }
        if (this.startDate == '' || this.endDate == '') {
          alert('Mohon masukkan tanggal mulai dan tanggal selesai program kerja');
          return;
        }
        if (this.budget == '' || this.subsidy == '') {
          alert('Budget maupun subsidi tidak boleh kosong');
          return;
        }
        body.userId = this.userId!;
        body.organizationRegionId = this.organizationRegionId!;
        body.programName = this.programName;
        body.budget = parseFloat(this.budget);
        body.subsidy = parseFloat(this.subsidy);
        body.startDate = MoneviDateFormatter.formatDate(this.startDate);
        body.endDate = MoneviDateFormatter.formatDate(this.endDate);
        await moneviAxios
          .post(MoneviPath.CREATE_PROGRAM_PATH, body)
          .then((response) => {
            if (this.$refs.closeModalButton instanceof HTMLButtonElement) {
              this.$refs.closeModalButton.click();
            }
            alert('Berhasil membuat program kerja');
            this.$emit('successUpdate');
          })
          .catch((error) => {
            alert('Gagal menambahkan program kerja');
            if (error.response.status == 400) {
              for (const key in error.response.data.errorFields) {
                var errorMessage = error.response.data.errorFields[key];
                alert(errorMessage);
                break;
              }
            } else if (error.response.status == 500) {
              alert('Internal server error, something has occcured');
            }
          });
      },

      resetData() {
        (this.programName = ''), (this.budget = ''), (this.subsidy = ''), (this.startDate = ''), (this.endDate = '');
      },

      showModal() {
        this.resetData();
        var addProgramModal: JQuery<HTMLDivElement> = $('#addProgramModal');
        addProgramModal.modal('show');
      },

      closeModal(event: Event) {
        var addProgramModal: JQuery<HTMLDivElement> = $('#addProgramModal');
        addProgramModal.modal('hide');
      },
    },
  };
</script>
