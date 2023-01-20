<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="imageModal">
    <div class="modal-dialog" data-dismiss="modal">
      <div class="modal-content">
        <div class="modal-body">
          <img v-bind:src="convertByteToImageSrc(imageSrc)" ref="test" class="img-responsive" style="width: 100%" />
        </div>
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
      convertByteToImageSrc(data: string | undefined) {
        if (data != undefined) {
          return atob(data);
        }
      },

      showModal() {
        var imageModal: JQuery<HTMLDivElement> = $('#imageModal');
        imageModal.modal('show');
      },
    },
  };
</script>
