<template>
  <div class="editor">
    <v-editor-head
      :font-color="fontColor"
      :font-size="fontSize"
      :text-align="textAlign"
      :list-type="listType"
      @executeCommand="onExecuteCommand"
      @execute-command="onExecuteCommand"
    />

    <v-editor-body
      ref="editorBody"
      @updateModel:fontColor="fontColor = $event"
      @updateModel:fontSize="fontSize = $event"
      @updateModel:textAlign="textAlign = $event"
      @updateModel:listType="listType = $event"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from '@vue/composition-api';
import VEditorHead from '@/components/editor/VEditorHead.vue';
import VEditorBody from '@/components/editor/VEditorBody.vue';
import { useRange } from '@/shared/selection';
import { useDOMManipulation } from '@/shared/DOMManipulation';
import { CommandsItem } from '@/@types/index';

const useCommandsHandler = () => {
  const actions: Record<string, Function> = {
    textAlign(el: HTMLDivElement, value: string) {
      const { range, moveCursorToEnd } = useRange();
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
      const { range, moveCursorToEnd } = useRange();
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

    color(el: HTMLDivElement, value: string): void {
      const { range, setRange, moveCursorToEnd } = useRange();
      const { getEndNode } = useDOMManipulation();
      const { startContainer, startOffset, endOffset, endContainer } = range as Range & { startContainer: Text };
      const endSpan = document.createElement('span');
      const startSpan = document.createElement('span');
      const startTextNode = document.createTextNode(startContainer.textContent?.slice(startOffset) || '\u200B');
      const endTextNode = document.createTextNode('');

      if (!el.contains(startContainer)) return moveCursorToEnd(el.lastChild || el);

      startSpan.style.color = value;
      endSpan.style.color = value;
      startSpan.appendChild(startTextNode);
      startContainer.replaceData(startOffset, -1, '');
      startContainer.after(startSpan);

      if (startContainer.isSameNode(endContainer)) return setRange({ node: startTextNode }, { node: startTextNode });

      const endNode = getEndNode(startTextNode, endContainer, (n) => {
        const sibling = (n.nodeType === 3 ? n.parentElement : n) as HTMLElement;
        sibling.style.color = value;
      });

      let textEndNode = (endNode.nodeType === 3 ? endNode : endNode.lastChild) as Text | null;

      if (!textEndNode) {
        textEndNode = document.createTextNode('');
        endNode.appendChild(textEndNode);
      }

      endTextNode.textContent = (textEndNode.textContent || '').slice(0, endOffset);
      endSpan.appendChild(endTextNode);
      textEndNode.replaceData(0, endOffset, '');

      if (endNode.isSameNode(textEndNode)) {
        const parentEndNode = endNode.parentNode as Node;
        parentEndNode.insertBefore(endSpan, textEndNode);
      } else {
        endNode.insertBefore(endSpan, textEndNode);
      }

      return setRange({ node: startTextNode }, { node: endTextNode });
    },
  };

  const onExecuteCommand = (rule: CommandsItem) => {
    actions[rule.command](document.querySelector('#text-editor'), rule.value);
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
    const { onExecuteCommand } = useCommandsHandler();
    const { fontSize, fontColor, textAlign, listType } = useProepertiesControll();

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
