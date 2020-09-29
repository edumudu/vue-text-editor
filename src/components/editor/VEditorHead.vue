<template>
  <div class="editor-menu">
    <v-editor-group
      :items="commands.align"
      :selected="textAlign"
      @changeCommand="onChangeCommand"
    />

    <v-editor-group
      :items="commands.lists"
      :selected="listType"
      @changeCommand="onChangeCommand"
    />

    <input
      type="color"
      :value="fontColor"
      @change="e => $emit('execute-command', { command: 'color', value: e.target.value })"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, ref, SetupContext,
} from '@vue/composition-api';
import VEditorGroup from '@/components/editor/group/VEditorGroup.vue';
import { CommandsItem } from '@/@types/index';

const useExecuteCommand = (emit: SetupContext['emit']) => {
  const onChangeCommand = (rule: CommandsItem) => emit('executeCommand', rule);

  return { onChangeCommand };
};

export default defineComponent({
  components: { VEditorGroup },

  props: {
    textAlign: {
      type: String,
      required: true,
    },

    listType: {
      type: String,
      required: true,
    },

    fontColor: {
      type: String,
      required: true,
    },
  },

  setup(props, { emit }) {
    const commands = reactive({
      align: [
        {
          command: 'textAlign',
          value: 'left',
          icon: 'format-align-left',
        },
        {
          command: 'textAlign',
          value: 'right',
          icon: 'format-align-right',
        },
        {
          command: 'textAlign',
          value: 'center',
          icon: 'format-align-center',
        },
        {
          command: 'textAlign',
          value: 'justify',
          icon: 'format-align-justify',
        },
      ],

      lists: [
        {
          command: 'list',
          value: 'ul',
          icon: 'format-list-bulleted',
        },
        {
          command: 'list',
          value: 'ol',
          icon: 'format-list-numbered',
        },
      ],
    });

    const { onChangeCommand } = useExecuteCommand(emit);

    return {
      commands,
      onChangeCommand,
    };
  },
});
</script>
