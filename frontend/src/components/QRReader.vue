<template>
  <qrcode-stream @init="onInit" @decode="onDecode" />
  <br />
  <p>{{ text }}</p>
</template>

<script>
import { ref } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';

export default {
  components: {
    QrcodeStream,
  },
  setup() {
    let text = ref('');

    function onDecode(decodedString) {
      text.value = decodedString;
    }

    async function onInit(promise) {
      try {
        const { capabilities } = await promise;
        // successfully initialized
        console.log(capabilities);
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          text.value = 'Denied! No permission';
          // user denied camera access permisson
        } else if (error.name === 'NotFoundError') {
          // no suitable camera device installed
        } else if (error.name === 'NotSupportedError') {
          // page is not served over HTTPS (or localhost)
        } else if (error.name === 'NotReadableError') {
          // maybe camera is already in use
        } else if (error.name === 'OverconstrainedError') {
          // did you requested the front camera although there is none?
        } else if (error.name === 'StreamApiNotSupportedError') {
          // browser seems to be lacking features
        }
      } finally {
        // hide loading indicator
      }
    }

    return { onDecode, onInit, text };
  },
};
</script>
