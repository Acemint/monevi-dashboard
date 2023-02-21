<template>
  <nav class="navbar navbar-light navbar-expand-md fixed-top py-3" ref="indexNavigator" id="mainNav">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="/">
        <img style="height: 30px" src="@/assets/img/logo-full.svg" />
      </a>
      <button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1">
        <span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navcol-1">
        <a class="btn btn-outline-primary shadow" role="button" href="/login">Login</a>
        <a class="btn btn-primary shadow" role="button" href="/register">Register</a>
      </div>
    </div>
  </nav>
  <header class="pt-5">
    <div class="container pt-4 pt-xl-5">
      <div class="row pt-5">
        <div class="col-md-8 text-center text-md-start mx-auto">
          <div class="text-center">
            <h1 class="display-4 fw-bold mb-5">
              Teratur dan Transparan dengan&nbsp;<span class="underline">Monevi</span>.
            </h1>
            <p></p>
            <a class="btn btn-primary shadow" role="button" href="/register ">Register</a>
          </div>
        </div>
        <div class="col-12 col-lg-10 mx-auto">
          <div class="text-center position-relative">
            <img class="img-fluid" src="@/assets/img/illustration/meeting.svg" style="width: 800px; padding: 50px" />
          </div>
        </div>
      </div>
    </div>
  </header>
  <section>
    <div class="container py-4 py-xl-5">
      <div class="row gy-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
        <div class="col">
          <div class="card border-light border-1 d-flex justify-content-center p-4">
            <div class="card-body">
              <div
                class="bs-icon-lg bs-icon-rounded bs-icon-secondary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-4 bs-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div>
                <h4 class="fw-bold">Bendahara</h4>
                <p class="text-muted">Dapat menyusun laporan keuangan dengan lebih efisien.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card border-light border-1 d-flex justify-content-center p-4">
            <div class="card-body">
              <div
                class="bs-icon-lg bs-icon-rounded bs-icon-secondary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-4 bs-icon">
                <i class="fas fa-file-import"></i>
              </div>
              <div>
                <h4 class="fw-bold">Ketua</h4>
                <p class="text-muted">Dapat mengecek laporan keuangan dengan mudah dan cepat.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card border-light border-1 d-flex justify-content-center p-4">
            <div class="card-body">
              <div
                class="bs-icon-lg bs-icon-rounded bs-icon-secondary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-4 bs-icon">
                <i class="fas fa-file-export"></i>
              </div>
              <div>
                <h4 class="fw-bold">Pengawas</h4>
                <p class="text-muted">Dapat mengecek detail transaksi keuangan dengan cepat.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="container py-4 py-xl-5">
      <div class="row">
        <div class="col-md-6">
          <h3 class="display-6 fw-bold pb-md-4"><span class="underline">Fitur</span></h3>
        </div>
      </div>
      <div class="row gy-4 gy-md-0">
        <div
          class="col-md-6 d-flex d-sm-flex d-md-flex justify-content-center align-items-center justify-content-md-start align-items-md-center justify-content-xl-center">
          <div>
            <div class="row gy-2 row-cols-1 row-cols-sm-2">
              <div class="col text-center text-md-start">
                <div class="d-flex justify-content-center align-items-center justify-content-md-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icon-tabler-sun fs-3 text-primary bg-warning">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <circle cx="12" cy="12" r="4"></circle>
                    <path
                      d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path>
                  </svg>
                  <h5 class="fw-bold mb-0 ms-2">Terbatas</h5>
                </div>
                <p class="text-muted my-3">Akses yang terbatas hanya untuk pengurus organisasi yang berwenang.</p>
              </div>
              <div class="col text-center text-md-start">
                <div class="d-flex justify-content-center align-items-center justify-content-md-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icon-tabler-sun fs-3 text-primary bg-warning">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <circle cx="12" cy="12" r="4"></circle>
                    <path
                      d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path>
                  </svg>
                  <h5 class="fw-bold mb-0 ms-2">Efisien</h5>
                </div>
                <p class="text-muted my-3">Pencatatan transaksi dan perhitungan saldo secara otomatis.</p>
              </div>
              <div class="col text-center text-md-start">
                <div class="d-flex justify-content-center align-items-center justify-content-md-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icon-tabler-sun fs-3 text-primary bg-warning">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <circle cx="12" cy="12" r="4"></circle>
                    <path
                      d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path>
                  </svg>
                  <h5 class="fw-bold mb-0 ms-2">Terstruktur</h5>
                </div>
                <p class="text-muted my-3">Pembuatan laporan keuangan yang terstruktur dan mudah dipahami.</p>
              </div>
              <div class="col text-center text-md-start">
                <div class="d-flex justify-content-center align-items-center justify-content-md-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icon-tabler-sun fs-3 text-primary bg-warning">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <circle cx="12" cy="12" r="4"></circle>
                    <path
                      d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path>
                  </svg>
                  <h5 class="fw-bold mb-0 ms-2">Pengesahan</h5>
                </div>
                <p class="text-muted my-3">Pengesahan laporan keuangan oleh ketua dan pengawas.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 order-first order-md-last">
          <div>
            <img
              class="rounded img-fluid w-100 fit-cover"
              style="min-height: 300px"
              src="@/assets/img/illustration/teamwork.svg" />
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="py-4 py-xl-5 mb-5">
    <div class="container">
      <div class="row mb-2">
        <div class="col-md-8 col-xl-6 text-center mx-auto">
          <h2 class="display-6 fw-bold mb-5">
            <span class="pb-3 underline">FAQ<br /></span>
          </h2>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-md-8 mx-auto">
          <div class="accordion text-muted" role="tablist" id="accordion-1">
            <div class="accordion-item">
              <h2 class="accordion-header" role="tab">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordion-1 .item-1"
                  aria-expanded="true"
                  aria-controls="accordion-1 .item-1">
                  Apa itu Monevi?
                </button>
              </h2>
              <div class="accordion-collapse collapse show item-1" role="tabpanel" data-bs-parent="#accordion-1">
                <div class="accordion-body">
                  <p class="mb-0">
                    Monevi adalah sebuah platform yang digunakan untuk mengatur keuangan organisasi yang berada di Universitas Bina Nusantara.
                  </p>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" role="tab">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordion-1 .item-2"
                  aria-expanded="false"
                  aria-controls="accordion-1 .item-2">
                  Bagaimana cara melakukan login setelah registrasi?
                </button>
              </h2>
              <div class="accordion-collapse collapse item-2" role="tabpanel" data-bs-parent="#accordion-1">
                <div class="accordion-body">
                  <p class="mb-0">
                    Untuk melakukan login, user dengan role Bendahara atau Ketua harus menunggu pendaftarannya diterima oleh Pengawas. Pemberitahuan penerimaan akun  akan diberikan melalui email yang didaftarkan.
Sedangkan user dengan role Pengawas hanya dapat melakukan login setelah melakukan penggantian password melalui link yang dikirimkan pada email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <footer>
    <div class="container py-4 py-lg-5">
      <hr />
      <div class="text-muted d-flex justify-content-between align-items-center pt-3">
        <p class="mb-0">Copyright © 2023 Monevi</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Raleway:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&amp;display=swap');
  @import '@/assets/css/index.css';
</style>

<script lang="ts">
  export default {
    mounted() {
      document.addEventListener('scroll', this.setupMainNavigatorMotion);
    },

    methods: {
      setupMainNavigatorMotion() {
        var mainNav: any = this.$refs.indexNavigator;
        var scrollTop =
          window.pageYOffset !== undefined
            ? window.pageYOffset
            : (document.documentElement || document.body.parentNode || document.body).scrollTop;

        if (scrollTop > 100) {
          mainNav.classList.add('navbar-shrink');
        } else {
          mainNav.classList.remove('navbar-shrink');
        }
      },
    },
  };
</script>
