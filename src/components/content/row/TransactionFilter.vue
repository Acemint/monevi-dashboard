<template>
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
              <select v-model="filterGeneralLedgerAccount" id="inputState" class="form-control">
                <option selected>Semua</option>
                <option>Bank</option>
                <option>Kas</option>
              </select>
            </div>
            <div class="form-group col-md-4">
              <label for="inputState">Berdasarkan jenis transaksi</label>
              <select v-model="filterEntryPosition" id="inputState" class="form-control">
                <option selected>Semua</option>
                <option>Debit</option>
                <option>Kredit</option>
              </select>
            </div>
            <div class="form-group col-md-4">
              <label for="inputZip">Berdasarkan kategori</label>
              <select v-model="filterType" id="inputState" class="form-control">
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
</template>

<script lang="ts">
  export default {
    data: function () {
      return {
        filterGeneralLedgerAccount: 'Semua',
        filterType: 'Semua',
        filterEntryPosition: 'Semua',
      };
    },

    watch: {
      filterGeneralLedgerAccount(newFilter: string, oldFilter: string) {
        this.$emit('filterChange', newFilter, this.filterEntryPosition, this.filterType);
      },

      filterType(newFilter: string, oldFilter: string) {
        this.$emit('filterChange', this.filterGeneralLedgerAccount, this.filterEntryPosition, newFilter);
      },

      filterEntryPosition(newFilter: string, oldFilter: string) {
        this.$emit('filterChange', this.filterGeneralLedgerAccount, newFilter, this.filterType);
      },
    },
  };
</script>
