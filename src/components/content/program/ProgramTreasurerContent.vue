<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between;">
      <h1>Program Kerja</h1>
      <div style="display: flex;">
        <div class="section-header-button">
          <button class="btn btn-primary" data-toggle="modal" data-target="#tambahProker">
            Tambah Program Kerja</button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4>Rencana Program Kerja</h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-bordered" id="table-1">
                <tr>
                  <th class="sorting" tabindex="0">No</th>
                  <th>Program Kerja</th>
                  <th>Budget</th>
                  <th>Jumlah Subsidi</th>
                  <th>Tanggal Mulai</th>
                  <th>Tanggal Selesai</th>
                </tr>
                <tr v-for="(item, index) in programs">
                  <td> {{ index + 1 }} </td>
                  <td> {{ item.name }} </td>
                  <td> {{ item.budget }} </td>
                  <td> {{ item.subsidy }} </td>
                  <td> {{ item.startDate }} </td>
                  <td> {{ item.endDate }} </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <ProgramAddProgramKerjaModal 
    v-bind:organizationRegionId="organizationRegionId"/>
</template>

<script lang="ts">
import { MoneviAPI } from '@/api/methods/monevi-api';
import ProgramAddProgramKerjaModal from '@/components/modal/ProgramAddProgramKerjaModal.vue';
import type { Program } from '@/api/model/monevi-model';

export default {

  data: function(){
    return {
      monevi_api: new MoneviAPI(),
      programs: new Array<Program>(),
    }
  },
  
  components: {
    ProgramAddProgramKerjaModal
  },

  props: {
    organizationRegionId: String
  },

  beforeMount() {
    this.getPrograms();
  },

  methods: {
    async getPrograms() {
      if (this.organizationRegionId === undefined) {
        return;
      }
      await this.monevi_api.getPrograms(this.organizationRegionId)
        .then(data => {
          for (var datum of data) {
            this.programs.push(datum);
          }
        });
    }
  }

}

</script>