<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="tambahProker">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tambah Program Kerja</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form method="POST">
            <div class="form-group">
              <label for="proker">Program Kerja*</label>
              <input v-model="programName" id="proker" type="text" class="form-control" name="proker">
              <div class="invalid-feedback">
              </div>
            </div>

            <div class="form-group">
              <label for="budget">Budget*</label>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input v-model="budget" id="budget" type="text" class="form-control" name="budget" aria-label="Bugdet (dalam rupiah)">
              </div>
            </div>

            <div class="form-group">
              <label for="subsidi">Jumlah Subsidi*</label>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input v-model="subsidy" id="subsidi" type="text" class="form-control" name="subsidi"
                  aria-label="Jumlah Subsidi (dalam rupiah)">
              </div>
            </div>

            <div class="form-group">
              <label for="tanggal-mulai">Tanggal Mulai*</label>
              <input v-model="startDate" id="tanggal-mulai" type="date" class="form-control" name="tanggal-mulai">
              <div class="invalid-feedback">
              </div>
            </div>

            <div class="form-group">
              <label for="tanggal-selesai">Tanggal Selesai*</label>
              <input v-model="endDate" id="tanggal-selesai" type="date" class="form-control" name="tanggal-selesai">
              <div class="invalid-feedback">
              </div>
            </div>

          </form>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button ref="closeModalButton" type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
          <button v-on:click="submitNewProgram" type="button" class="btn btn-primary" >Tambah Program Kerja</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MoneviAPI } from '@/api/methods/monevi-api';
import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
import type { BaseErrorResponse } from '@/api/model/monevi-model';

export default {

  data: function(){
    return {
      monevi_api: new MoneviAPI(),
      organizationRegionIdData: this.organizationRegionId || "",
      programName: "",
      budget: 0,
      subsidy: 0,
      startDate: "",
      endDate: ""
    }
  },

  props: {
    organizationRegionId: String
  },


  methods: {
    async submitNewProgram(event: Event) {
      event.preventDefault();
      await this.monevi_api.createNewProgram(
        this.organizationRegionIdData, 
        this.programName,
        this.budget,
        this.subsidy,
        MoneviDateFormatter.formatDate(this.startDate),
        MoneviDateFormatter.formatDate(this.endDate))
      .then(data => {
        // TODO: On close modal, trigger restart for parent using emit
        if (this.$refs.closeModalButton instanceof HTMLButtonElement) {
          this.$refs.closeModalButton.click();
        }
      })
      .catch(error => {
        // TODO: CREATE MODAL TO SHOW INVALID DATA
        const baseError: BaseErrorResponse = error.response.data;
        console.log(baseError);
      })
    },
  }

}


</script>