<template>
  <div class="editor">
    <v-editor-head
      :font-color="fontColor"
      :font-size="fontSize"
      :text-align="textAlign"
      :list-type="listType"
      @executeCommand="onExecuteCommand"
    />

    <v-editor-body
      ref="editorBody"
      @updateModel:fontColor="fontColor = $event"
      @updateModel:fontSize="fontSize = $event"
      @updateModel:textAlign="textAlign = $event"
      @updateModel:listType="listType = $event"
    />

    {{ fontColor }}
    {{ fontSize }}
    {{ textAlign }}
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from '@vue/composition-api';
import VEditorHead from '@/components/editor/VEditorHead.vue';
import VEditorBody from '@/components/editor/VEditorBody.vue';
import { useSelection } from '@/shared/selection';
import { CommandsItem } from '@/@types/index';

const useCommandsHandler = (editorBody: Ref<typeof VEditorBody>) => {
  const actions: Record<string, Function> = {
    textAlign(el: HTMLDivElement, value: string) {
      const { range, moveCursorToEnd } = useSelection();
      const common = range.commonAncestorContainer;
      let newElement;

      if (!el.contains(common) || common.isSameNode(el)) return;

      if (common.parentElement?.isSameNode(el) && common.parentElement?.nodeType === 3) {
        newElement = document.createElement('div');
        newElement.appendChild(common.cloneNode());
        el.replaceChild(newElement, common);
      } else {
        newElement = (common.nodeType === 3 ? common.parentElement : common) as HTMLElement;
      }

      newElement.style.textAlign = value;
      moveCursorToEnd(newElement.lastChild as HTMLElement);
    },

    list(el: HTMLDivElement, value: string) {
      const { range, moveCursorToEnd } = useSelection();
      const common = range.commonAncestorContainer;

      if (!el.contains(common) || common.isSameNode(el)) return;

      const getChild = (node: HTMLElement | Node): HTMLElement => {
        if (node.parentElement?.isSameNode(el)) return node as HTMLElement;

        return getChild(node.parentElement as HTMLElement);
      };

      const myNode = getChild(common);
      const newEl = document.createElement(value);
      const li = document.createElement('li');

      if (myNode.firstChild?.nodeName === 'LI') {
        newEl.append(...Array.from(myNode.children));
      } else {
        newEl.appendChild(li);

        Array.from(myNode.childNodes.length ? myNode.childNodes : [myNode.cloneNode()], (item) => {
          li.appendChild(item);
          return item;
        });
      }

      el.replaceChild(newEl, myNode);
      moveCursorToEnd(newEl);
    },
  };

  const onExecuteCommand = (rule: CommandsItem) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    actions[rule.command](editorBody.value.$data.textContainer, rule.value);
  };

  return { onExecuteCommand };
};

const useProepertiesControll = () => {
  const fontSize = ref('16px');
  const fontColor = ref('#000000');
  const textAlign = ref('left');
  const listType = ref('');

  return {
    fontSize,
    fontColor,
    textAlign,
    listType,
  };
};

export default defineComponent({
  components: {
    VEditorBody,
    VEditorHead,
  },

  setup() {
    const editorBody = ref(VEditorBody);
    const { onExecuteCommand } = useCommandsHandler(editorBody);
    const {
      fontSize, fontColor, textAlign, listType,
    } = useProepertiesControll();

    return {
      fontSize,
      fontColor,
      textAlign,
      editorBody,
      onExecuteCommand,
      listType,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/editor/main.scss';
</style>
