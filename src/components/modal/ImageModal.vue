<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="imageModal">
    <div class="modal-dialog modal-dialog-centered" data-dismiss="modal">
      <div class="modal-content">
        <img v-if="imageSrc" v-bind:src="convertByteToImageSrc(imageSrc)" class="img-responsive" style="width: 100%" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    props: {
      imageSrc: String,
    },

    methods: {
      convertByteToImageSrc(byte: any) {
        return atob(byte);
      },

      showModal() {
        var imageModal: JQuery<HTMLDivElement> = $('#imageModal');
        imageModal.modal('show');
      },

      closeModal() {
        var imageModal: JQuery<HTMLDivElement> = $('#imageModal');
        imageModal.modal('hide');
      },
    },
  };
</script>
