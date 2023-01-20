<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Laporan</h1>
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
                <tr>
                  <td>1</td>
                  <td>HIMTI</td>
                  <td>2022</td>
                  <td><button class="btn btn-primary" onclick="location.href='proker-pengawas-ok.html';">Lihat Program Kerja</button></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>BNCC</td>
                  <td>2022</td>
                  <td><button class="btn btn-primary" onclick="location.href='proker-pengawas-ok.html';">Lihat Program Kerja</button></td>
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
</template>

<script lang="ts">
  import type { Program } from '@/api/model/monevi-model';

  export default {
    data: function () {
      return {
        programs: new Array<Program>(),
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
    },
  };
</script>
