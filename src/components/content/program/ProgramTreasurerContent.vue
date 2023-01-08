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
                <tr>
                  <td>1</td>
                  <td>HIMTI Summer Class</td>
                  <td>Rp 1,000,000</td>
                  <td>Rp 500,000</td>
                  <td>1 Desember 2022</td>
                  <td>12 Desember 2022</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>HIMTI Summer Class</td>
                  <td>Rp 1,000,000</td>
                  <td>Rp 500,000</td>
                  <td>1 Desember 2022</td>
                  <td>12 Desember 2022</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

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
              <input id="proker" type="text" class="form-control" name="proker">
              <div class="invalid-feedback">
              </div>
            </div>

            <div class="form-group">
              <label for="budget">Budget*</label>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input id="budget" type="text" class="form-control" name="budget" aria-label="Bugdet (dalam rupiah)">
              </div>
            </div>

            <div class="form-group">
              <label for="subsidi">Jumlah Subsidi*</label>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input id="subsidi" type="text" class="form-control" name="subsidi"
                  aria-label="Jumlah Subsidi (dalam rupiah)">
              </div>
            </div>

            <div class="form-group">
              <label for="tanggal-mulai">Tanggal Mulai*</label>
              <input id="tanggal-mulai" type="date" class="form-control" name="tanggal-mulai">
              <div class="invalid-feedback">
              </div>
            </div>

            <div class="form-group">
              <label for="tanggal-selesai">Tanggal Selesai*</label>
              <input id="tanggal-selesai" type="date" class="form-control" name="tanggal-selesai">
              <div class="invalid-feedback">
              </div>
            </div>

          </form>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
          <button type="button" class="btn btn-primary">Tambah Program Kerja</button>
        </div>
      </div>
    </div>
  </div>
</template>