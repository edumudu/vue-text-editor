<template>
  <div id="app">
    <the-header />

    <main>
      <div class="container">
        <VEditor />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import TheHeader from '@/components/unique/TheHeader.vue';
import VEditor from '@/components/editor/VEditor.vue';

export default defineComponent({
  name: 'App',

  components: {
    TheHeader,
    VEditor,
  },
});

</script>

<style lang="scss">
@import '@/assets/scss/app.scss';
</style>
