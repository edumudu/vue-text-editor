<template>
  <ul class="menu-group">
    <v-editor-group-item
      v-for="(item, index) in items"
      :key="index"
      :active="item.value === selected"
      :rule="item"
      @click="onClick"
    >
      <component :is="item.icon" />
    </v-editor-group-item>
  </ul>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';
import VEditorGroupItem from '@/components/editor/group/VEditorGroupItem.vue';
import FormatAlignLeft from 'vue-material-design-icons/FormatAlignLeft.vue';
import FormatAlignRight from 'vue-material-design-icons/FormatAlignRight.vue';
import FormatAlignCenter from 'vue-material-design-icons/FormatAlignCenter.vue';
import FormatAlignJustify from 'vue-material-design-icons/FormatAlignJustify.vue';
import FormatListBulleted from 'vue-material-design-icons/FormatListBulleted.vue';
import FormatListNumbered from 'vue-material-design-icons/FormatListNumbered.vue';
import { CommandsItem } from '@/@types/index';

const useClickHandle = (emit: SetupContext['emit']) => {
  const onClick = (rule: CommandsItem) => {
    emit('changeCommand', rule);
  };

  return { onClick };
};

export default defineComponent({
  components: {
    VEditorGroupItem,
    FormatAlignLeft,
    FormatAlignRight,
    FormatAlignCenter,
    FormatAlignJustify,
    FormatListBulleted,
    FormatListNumbered,
  },

  props: {
    items: {
      type: Array,
      required: true,
    },

    selected: {
      type: String,
      default: '',
    },
  },

  setup(props, { emit }) {
    const { onClick } = useClickHandle(emit);

    return { onClick };
  },
});
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/editor/group/editor-group.scss';
</style>
