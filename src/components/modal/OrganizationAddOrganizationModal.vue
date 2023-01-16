<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="addOrganizationModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tambah Organisasi Kemahasiswaan</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form method="POST">
            <div class="form-group">
              <label for="namaok">Nama Organisasi Kemahasiswaan*</label>
              <input v-model="organizationName" id="namaok" type="text" class="form-control" name="namaok" />
              <div class="invalid-feedback"></div>
            </div>

            <div class="form-group">
              <label for="namaok">Singkatan Nama Organisasi Kemahasiswaan*</label>
              <input v-model="organizationAbbreviation" id="namaok" type="text" class="form-control" name="namaok" placeholder="(contoh: HIMTI)" />
              <div class="invalid-feedback"></div>
            </div>

            <div class="form-group">
              <label>Area Kampus*</label>
              <div class="form-check" v-for="region of regions">
                <input type="checkbox" v-bind:id="region.name" v-model="regionCheckbox" v-bind:value="region.name" class="form-check-input" />
                <label class="form-check-label" v-bind:for="region.name"> Binus @{{ region.name }} </label>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button ref="closeModalButton" v-on:click="closeModal($event)" type="button" class="btn btn-secondary">Tutup</button>
          <button v-on:click="addOrganization($event)" type="button" class="btn btn-primary">Tambah Organisasi Kemahasiswaan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import moneviAxios from '@/api/configuration/monevi-axios';
  import type { Region } from '@/api/model/monevi-model';
  import type { MoneviBodyCreateOrganization } from '@/api/model/monevi-config';
  import { MoneviPath } from '@/api/path/path';
  export default {
    props: {
      regions: Array<Region>,
    },

    data: function () {
      return {
        regionCheckbox: [],
        organizationName: '',
        organizationAbbreviation: '',
      };
    },

    methods: {
      showModal() {
        var addOrganizationModal: JQuery<HTMLDivElement> = $('#addOrganizationModal');
        addOrganizationModal.modal('show');
      },

      closeModal(event: Event) {
        var addOrganizationModal: JQuery<HTMLDivElement> = $('#addOrganizationModal');
        addOrganizationModal.modal('hide');
      },

      addOrganization(event: MouseEvent) {
        var body = {} as MoneviBodyCreateOrganization;
        if (this.organizationName == '') {
          console.error('organization name should not be empty');
        }
        body.name = this.organizationName;
        if (this.organizationAbbreviation == '') {
          console.error('organization abbreviation should not be empty');
        }
        body.abbreviation = this.organizationAbbreviation;
        body.regionNames = this.regionCheckbox;
        return moneviAxios
          .post(MoneviPath.CREATE_NEW_ORGANIZATION_PATH, body)
          .then((response) => {
            if (this.$refs.closeModalButton instanceof HTMLButtonElement) {
              this.$refs.closeModalButton.click();
            }
            this.$emit('successAddOrganization');
          })
          .catch((error) => {
            console.error('cannot create new organization');
            return;
          });
      },
    },
  };
</script>
