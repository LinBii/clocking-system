<template>
  <qrcode-stream @init="onInit" @decode="onDecode"></qrcode-stream>
  <br />
  <p>{{ errorText }}</p>
  <p>{{ decodedString }}</p>
</template>

<script>
import { ref } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';

export default {
  components: {
    QrcodeStream,
  },
  setup() {
    let errorText = ref('');
    let decodedString = ref('');

    function onDecode(decodedString) {
      decodedString.value = decodedString;
    }

    async function onInit(promise) {
      try {
        const { capabilities } = await promise;
        // successfully initialized
        console.log(capabilities);
      } catch (error) {
        console.log(error);
        if (error.name === 'NotAllowedError') {
          errorText.value = 'Denied! No permission 允許攝影機功能後才能使用！';
        } else if (error.name === 'NotFoundError') {
          errorText.value = 'no suitable camera device installed';
        } else if (error.name === 'NotSupportedError') {
          errorText.value = 'page is not served over HTTPS (or localhost)';
        } else if (error.name === 'NotReadableError') {
          errorText.value = 'maybe camera is already in use';
        } else if (error.name === 'OverconstrainedError') {
          errorText.value =
            'did you requested the front camera although there is none?';
        } else if (error.name === 'StreamApiNotSupportedError') {
          errorText.value = 'browser seems to be lacking features';
        }
      } finally {
        // hide loading indicator
      }
    }

    return { onDecode, onInit, errorText, decodedString };
  },
};
</script>
