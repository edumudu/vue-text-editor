<template>
  <li>
    <button
      class="menu-group-btn"
      :class="{ active }"
      @click="onClick"
    >
      <slot />
    </button>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  props: {
    active: {
      type: Boolean,
      default: false,
    },

    rule: {
      type: Object,
      required: true,
    },
  },

  setup(props, { emit }) {
    const onClick = () => emit('click', props.rule);

    return { onClick };
  },
});
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/editor/group/editor-group-item.scss';
</style>
