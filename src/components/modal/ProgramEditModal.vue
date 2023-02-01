<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="programEditModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ubah Program</h5>
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
          <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary">Cancel</button>
          <button v-on:click="editProgram" type="button" class="btn btn-primary">Ubah</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { programApi } from '@/api/service/program-api';

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

    watch: {
      program(newProgram, oldProgram) {
        this.programName = newProgram.name;
        this.budget = newProgram.budget;
        this.subsidy = newProgram.subsidy;
        var tzoffset = new Date().getTimezoneOffset() * 60000;
        this.startDate = new Date(newProgram.startDate - tzoffset).toISOString().substring(0, 10);
        this.endDate = new Date(newProgram.endDate - tzoffset).toISOString().substring(0, 10);
      },

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

    props: {
      program: Object,
      userAccount: Object,
    },

    methods: {
      showModal() {
        var programEditModal: JQuery<HTMLDivElement> = $('#programEditModal');
        programEditModal.modal('show');
      },

      closeModal(event: Event) {
        var programEditModal: JQuery<HTMLDivElement> = $('#programEditModal');
        programEditModal.modal('hide');
      },

      async editProgram(event: Event) {
        event.preventDefault();

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
        var updateProgramRequest = {} as {
          name: string;
          budget: number;
          subsidy: number;
          startDate: string;
          endDate: string;
        };
        updateProgramRequest.name = this.programName;
        updateProgramRequest.budget = parseFloat(this.budget);
        updateProgramRequest.subsidy = parseFloat(this.subsidy);
        updateProgramRequest.startDate = MoneviDateFormatter.formatDate(this.startDate);
        updateProgramRequest.endDate = MoneviDateFormatter.formatDate(this.endDate);

        var success = await programApi.editProgram(this.userAccount!.id, this.program!.id, updateProgramRequest);
        if (success == null) {
          alert('Gagal untuk mengubah program');
          return;
        }
        alert(`Berhasil mengubah program kerja ${success.name}`);
        var closeButton: any = this.$refs.closeModalButton;
        closeButton.click();
        this.$emit('successUpdate');
      },
    },
  };
</script>
