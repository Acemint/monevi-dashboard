<template>
  <section class="section">
    <div class="container mt-5">
      <div class="row">
        <div class="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-8 offset-xl-2">
          <SimpleHeader />

          <div class="card card-primary">
            <div class="card-header"><h4>Register</h4></div>

            <div class="card-body">
              <form v-on:submit="submit">
                <div class="form-group">
                  <label for="nim">NIM</label>
                  <input v-model="nim" id="nim" type="text" class="form-control" required autofocus />
                  <div class="invalid-feedback">Please fill in NIM</div>
                </div>

                <div class="form-group">
                  <label for="full-name">Nama Lengkap</label>
                  <input v-model="fullName" id="full-name" type="text" class="form-control" required autofocus />
                  <div class="invalid-feedback">Please fill in Nama Lengkap</div>
                </div>

                <div class="form-group">
                  <label for="email">Email</label>
                  <input v-model="email" id="email" type="email" class="form-control" required autofocus />
                  <div class="invalid-feedback">Please fill in Email</div>
                </div>

                <div class="form-group">
                  <label for="password" class="d-block">Password</label>
                  <input
                    v-model="password"
                    id="password"
                    type="password"
                    class="form-control pwstrength"
                    data-indicator="pwindicator"
                    required
                    autofocus />
                  <div id="pwindicator" class="pwindicator">
                    <div class="bar"></div>
                    <div class="label"></div>
                  </div>
                  <div class="invalid-feedback">please fill in your password</div>
                </div>

                <div class="row">
                  <div class="form-group col-6">
                    <label>Kampus</label>
                    <select
                      v-model="regionSelection"
                      v-on:change="getOrganizations($event)"
                      class="form-control selectric"
                      required
                      autofocus>
                      <option selected="true" disabled>Pilih Kampus</option>
                      <option v-for="region in regions">
                        {{ region.name }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group col-6">
                    <label>Unit Kegiatan Mahasiswa</label>
                    <select v-model="organizationSelection" class="form-control selectric" required autofocus>
                      <option selected="true" disabled>Pilih Unit Kegiatan Mahasiswa</option>
                      <option v-for="organization in organizations">
                        {{ organization.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-6">
                    <label>Periode</label>
                    <select v-model="periodYear" class="form-control selectric" required autofocus>
                      <option>2021</option>
                      <option>2022</option>
                      <option>2023</option>
                    </select>
                  </div>
                  <div class="form-group col-6">
                    <label>Role</label>
                    <select v-model="role" class="form-control selectric" required autofocus>
                      <option>Ketua</option>
                      <option>Bendahara</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <button type="submit" class="btn btn-primary btn-lg btn-block">Register</button>
                </div>
              </form>
            </div>
          </div>
          <SimpleFooter />
        </div>
      </div>
    </div>
  </section>

  <RegisterSuccessModal ref="registerSuccessModal" />
</template>

<script lang="ts">
  import { MoneviEnumConverter } from '@/api/methods/monevi-enum-converter';
  import type { Region, Organization } from '@/api/model/monevi-model';
  import SimpleFooter from '@/components/footer/SimpleFooter.vue';
  import SimpleHeader from '@/components/header/SimpleHeader.vue';
  import RegisterSuccessModal from '@/components/modal/RegisterSuccessModal.vue';
  import { authorizationApi } from '@/api/service/authorization-api';
  import { regionApi } from '@/api/service/region-api';
  import { organizationApi } from '@/api/service/organization-api';

  export default {
    beforeMount: function () {
      this.getRegions();
    },

    methods: {
      async getRegions(event: any = null) {
        await regionApi.getRegions().then((response: any) => {
          this.regions = response.data.values;
        });
      },

      async getOrganizations(event: any) {
        if (this.regionSelection == '') {
          return;
        }
        await organizationApi.getOrganizations(this.regionSelection).then((response: any) => {
          this.organizations = response.data.values;
        });
      },

      async submit(event: Event) {
        event.preventDefault();

        await authorizationApi
          .register(
            this.nim,
            this.fullName,
            this.email,
            this.password,
            1,
            this.periodYear,
            this.organizationSelection,
            this.regionSelection,
            MoneviEnumConverter.convertUserAccountRole(this.role)
          )
          .then((response) => {
            var registerSuccessModal: any = this.$refs.registerSuccessModal;
            registerSuccessModal.showModal();
          })
          .catch((error) => {
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
    },

    data: function () {
      return {
        regions: new Array<Region>(),
        organizations: new Array<Organization>(),
        nim: '',
        fullName: '',
        email: '',
        password: '',
        periodYear: 0,
        role: '',
        regionSelection: '',
        organizationSelection: '',
      };
    },

    components: { SimpleHeader, SimpleFooter, RegisterSuccessModal },
  };
</script>
