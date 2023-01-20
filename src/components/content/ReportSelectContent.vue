<template>
  <section class="section">
    <div class="section-header" style="justify-content: space-between">
      <h1>Detail Transaksi</h1>
      <div class="section-header-breadcrumb">
        <div class="breadcrumb-item active"><a href="report-pengawas.html">Pilih Laporan</a></div>
        <div class="breadcrumb-item"><a href="report-pengawas-ok.html">Laporan HIMTI</a></div>
        <div class="breadcrumb-item">Detail Transaksi</div>
      </div>
    </div>

    <div class="card" style="display: flex">
      <div class="card-body">
        <MonthNavigator />
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <h5>Filter</h5>
          </div>
          <div class="card-body">
            <div class="form-row">
              <div class="form-group col-md-4">
                <label for="inputCity">Berdasarkan dompet</label>
                <select id="inputState" class="form-control">
                  <option selected>Semua</option>
                  <option>Bank</option>
                  <option>Kas</option>
                </select>
              </div>
              <div class="form-group col-md-4">
                <label for="inputState">Berdasarkan jenis transaksi</label>
                <select id="inputState" class="form-control">
                  <option selected>Semua</option>
                  <option>Debet</option>
                  <option>Kredit</option>
                </select>
              </div>
              <div class="form-group col-md-4">
                <label for="inputZip">Berdasarkan kategori</label>
                <select id="inputState" class="form-control">
                  <option selected>Semua</option>
                  <option>Rutin</option>
                  <option>Non Rutin</option>
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
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-bordered" id="table-1">
                <tr>
                  <th class="sorting" tabindex="0">No</th>
                  <th>Tanggal</th>
                  <th>Dompet</th>
                  <th>Transaksi</th>
                  <th>Kategori</th>
                  <th>Keterangan</th>
                  <th>Jumlah</th>
                  <th>Bukti Transaksi</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>1 Desember 2022</td>
                  <td>Bank</td>
                  <td>Pemasukan</td>
                  <td>Non Rutin</td>
                  <td>Pemindahan dari 2021</td>
                  <td class="text-primary">+ Rp 10,000,000</td>
                  <td>
                    <div class="gallery"><div class="gallery-item" data-image="../assets/img/news/img01.jpg"></div></div>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>1 Desember 2022</td>
                  <td>Bank</td>
                  <td>Pembayaran pembicara</td>
                  <td>Non Rutin</td>
                  <td>-</td>
                  <td class="text-danger">- Rp 1,000,000</td>
                  <td>
                    <div class="gallery transaction"><div class="gallery-item" data-image="../assets/img/news/img02.jpg"></div></div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="tolakLaporan">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Impor Transaksi</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Komentar</label>
            <textarea class="form-control"></textarea>
          </div>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
          <button type="button" class="btn btn-danger">Tolak Laporan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import MonthNavigator from '../navigator/MonthNavigator.vue';

  export default { components: { MonthNavigator } };
</script>
