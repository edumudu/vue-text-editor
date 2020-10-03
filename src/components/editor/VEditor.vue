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
      const { range, setRange, moveCursorToEnd } = useRange();
      const { getParentByTagName } = useDOMManipulation();
      const common = range.commonAncestorContainer;
      let newElement;

      if (!el.contains(common)) return moveCursorToEnd(common.lastChild || common);

      if (common.isSameNode(el)) {
        if (!el.childElementCount) {
          newElement = document.createElement('div');
          newElement.style.textAlign = value;
          newElement.textContent = '\u200B';
          common.appendChild(newElement);

          return moveCursorToEnd(newElement || common.lastChild || common);
        }

        let element = common.firstChild as HTMLElement;
        const { startContainer, endContainer, startOffset, endOffset } = range;
        let wrapper;

        if (element.nodeType === 3) {
          wrapper = document.createElement('div');
          wrapper.appendChild(element.cloneNode());
          common.replaceChild(wrapper, element);
          element = wrapper;
        }

        const start = {
          node: startContainer as Text,
          offSet: startOffset,
        };

        const end = {
          node: endContainer as Text,
          offSet: endOffset,
        };

        while (!element.contains(wrapper || startContainer)) {
          element = element.nextSibling as HTMLElement;
        }

        while (element) {
          element.style.textAlign = value;
          element = element.nextSibling as HTMLElement;
        }

        return setRange(start, end);
      }

      if (common.parentElement?.isSameNode(el)) {
        newElement = (common.nodeType === 3 ? document.createElement('div') : common) as HTMLElement;
        newElement.appendChild(common.cloneNode());
        el.replaceChild(newElement, common);
      } else {
        const parent = getParentByTagName(common, ['div', 'li']) as HTMLElement;

        if (parent.isSameNode(el)) {
          newElement = document.createElement('div');

          newElement.append(...el.childNodes);
          el.appendChild(newElement);
        } else {
          newElement = parent;
        }
      }

      newElement.style.textAlign = value;

      return moveCursorToEnd(newElement.lastChild as HTMLElement);
    },

    color(el: HTMLDivElement, value: string): void {
      const { range, setRange, moveCursorToEnd } = useRange();
      const { getEndNode } = useDOMManipulation();
      const { startContainer, startOffset, endOffset, endContainer } = range as Range & { startContainer: Text };
      const endSpan = document.createElement('span');
      const startSpan = document.createElement('span');
      const startTextNode = document.createTextNode('');
      const endTextNode = document.createTextNode('');

      if (!el.contains(startContainer)) return moveCursorToEnd(el.lastChild || el);

      startContainer.textContent = startContainer.textContent?.replace(/\s/g, '\u0020') || '';
      endContainer.textContent = endContainer.textContent?.replace(/\s/g, '\u0020') || '';
      startTextNode.textContent = startContainer.textContent?.slice(startOffset) || '\u200B';
      startSpan.style.color = value;
      endSpan.style.color = value;

      if (startContainer.isSameNode(endContainer)) {
        const nodeValue = startTextNode.textContent || '';
        const offSetDiff = endOffset - startOffset;
        const afterTextNode = document.createTextNode(nodeValue.slice(offSetDiff));

        startTextNode.textContent = nodeValue.slice(0, offSetDiff);

        startSpan.appendChild(startTextNode);
        startContainer.replaceData(startOffset, -1, '');
        startContainer.after(startSpan);
        startSpan.after(afterTextNode);

        return range.selectNodeContents(startSpan);
      }

      startSpan.appendChild(startTextNode);
      startContainer.replaceData(startOffset, startTextNode.nodeValue?.length || -1, '');
      startContainer.after(startSpan);

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
