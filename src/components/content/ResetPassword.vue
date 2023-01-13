<template>
  <section class="section">
    <div class="container mt-5">
      <div class="row">
        <div class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
          <div class="login-brand">
            <img src="@/assets/img/logo-full.svg" alt="logo" width="210">
          </div>

          <div class="card card-primary">
              <div class="card-header"><h4>Reset Password</h4></div>

              <div class="card-body">
                <form method="POST">
                  <div class="form-group">
                    <label for="password">New Password</label>
                    <input id="password" type="password" class="form-control pwstrength" data-indicator="pwindicator" name="password" tabindex="2" required>
                    <div id="pwindicator" class="pwindicator">
                      <div class="bar"></div>
                      <div class="label"></div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="password-confirm">Confirm Password</label>
                    <input id="password-confirm" type="password" class="form-control" name="confirm-password" tabindex="2" required>
                  </div>

                  <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-lg btn-block" tabindex="4" data-toggle="modal" data-target="#reset">
                      Reset Password
                    </button>
                  </div>
                </form>
              </div>
            </div>

          <div class="simple-footer">
            Copyright &copy; Monevi 2023
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="reset">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Reset Password</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Password Anda telah berhasil diperbaharui.</p>
          </div>
          <div class="modal-footer bg-whitesmoke br">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary">Login</button>
          </div>
        </div>
      </div>
    </div>
</template>