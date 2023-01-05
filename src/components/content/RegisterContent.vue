<template>
    <section class="section">
      <div class="container mt-5">
        <div class="row">
          <div class="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-8 offset-xl-2">
            <div class="login-brand">
              <img src="@/assets/img/logo-full.svg" alt="logo" width="200">
            </div>

            <div class="card card-primary">
              <div class="card-header"><h4>Register</h4></div>

              <div class="card-body">
                <form v-on:submit="submit">
                  <div class="form-group">
                    <label for="nim">NIM</label>
                    <input v-model="nim" id="nim" type="text" class="form-control">
                    <div class="invalid-feedback">
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="full-name">Nama Lengkap</label>
                    <input v-model="fullName" id="full-name" type="text" class="form-control">
                    <div class="invalid-feedback">
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="email">Email</label>
                    <input v-model="email" id="email" type="email" class="form-control">
                    <div class="invalid-feedback">
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="password" class="d-block">Password</label>
                      <input v-model="password" id="password" type="password" class="form-control pwstrength" data-indicator="pwindicator">
                      <div id="pwindicator" class="pwindicator">
                        <div class="bar"></div>
                        <div class="label"></div>
                      </div>
                  </div>

                  <div class="row">
                    <div class="form-group col-6">
                      <label>Kampus</label>
                      <select v-model="regionSelection" v-on:change="getOrganizations($event)" class="form-control selectric">
                        <option selected="true" disabled>Pilih Kampus</option>    
                        <option v-for="region in regions">{{ region.name }}</option>
                      </select>
                    </div>
                    <div class="form-group col-6">
                      <label>Unit Kegiatan Mahasiswa</label>
                      <select v-model="organizationSelection" class="form-control selectric">
                        <option selected="true" disabled>Pilih Unit Kegiatan Mahasiswa</option>    
                        <option v-for="organization in organizations">{{ organization.name }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div class="form-group col-6">
                      <label>Periode</label>
                      <select v-model="periodYear" class="form-control selectric">
                        <option>2022</option>
                        <option>2023</option>
                      </select>
                    </div>
                    <div class="form-group col-6">
                      <label>Role</label>
                      <select v-model="role" class="form-control selectric">
                        <option>Ketua</option>
                        <option>Bendahara</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" name="agree" class="custom-control-input" id="agree">
                      <label class="custom-control-label" for="agree">I agree with the terms and conditions</label>
                    </div>
                  </div>

                  <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-lg btn-block">
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div class="simple-footer">
              Copyright &copy; Monevi 2022
            </div>
          </div>
        </div>
      </div>
    </section>
</template>

<script lang="ts">
import { MoneviAPI } from '@/api/methods/monevi-api';
import type { Region, Organization } from '@/api/model/monevi-model';

export default {
  
  methods: {
    async getRegions(event: any = null) {
      await this.monevi_api.getRegions()
      .then(response => {
        this.regions = response;
      });
    },
    
    async getOrganizations(event: any) {
      let options: HTMLOptionsCollection = event.target.options;
      await this.monevi_api.getOrganizations(options[options.selectedIndex].value)
      .then(response => {
        this.organizations = response;
      })
    },

    async submit(event: Event) {
      event.preventDefault();
      await this.monevi_api.registerStudent(this.nim, 
        this.fullName,
        this.email,
        this.password,
        1,
        this.periodYear,
        this.regionSelection,
        this.organizationSelection, 
        this.role)
    }
  },

  data: function() {
    return {
      monevi_api: new MoneviAPI(),
      regions: new Array<Region>(),
      organizations: new Array<Organization>(),
      nim: "",
      fullName: "",
      email: "",
      password: "",
      periodYear: 0,
      role: "",
      regionSelection: "",
      organizationSelection: ""
    }
  },

  mounted: function() {
    this.getRegions();
  }
}
</script>