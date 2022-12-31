<template>
  <qr-stream @init="onInit" @decode="onDecode"></qr-stream>
  <br />
  <p>{{ errorText }}</p>
  <p>Result: {{ state.data }}</p>
</template>

<script>
import { ref, reactive } from 'vue';
import { QrStream } from 'vue3-qr-reader';

export default {
  components: {
    QrStream,
  },
  setup() {
    let errorText = ref('');
    const state = reactive({ data: null });

    function onDecode(data) {
      state.data = data;
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

    return { onDecode, onInit, errorText, state };
  },
};
</script>
