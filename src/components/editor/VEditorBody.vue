<template>
  <div
    id="text-editor"
    ref="textContainer"
    class="text-editor"
    tabindex="1"
    contenteditable
  />
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  ref,
  SetupContext,
} from '@vue/composition-api';
import { useSelection } from '@/shared/selection';
import { rgbToHex } from '@/shared/color';

const useSelectionHandle = (emit: SetupContext['emit']) => {
  const textContainer = ref(document.createElement('div'));

  const getStyle = (node: HTMLElement, rule: string): string => window.getComputedStyle(node).getPropertyValue(rule);

  const onSelection = () => {
    const editor = textContainer.value;
    const { anchorNode } = useSelection();
    const element = (anchorNode.nodeType === 3 ? anchorNode.parentElement : anchorNode) as HTMLElement;

    if ((!editor.contains(anchorNode) || anchorNode.isSameNode(editor))) {
      return;
    }

    emit('updateModel:fontColor', rgbToHex(getStyle(element, 'color')));
    emit('updateModel:fontSize', getStyle(element, 'font-size'));
    emit('updateModel:textAlign', getStyle(element, 'text-align'));

    const getparentListName = (nodeElement: HTMLElement, defaultReturn = ''): string => {
      const names = ['UL', 'OL'];

      if (nodeElement.isSameNode(editor)) return defaultReturn;

      const parentElement = nodeElement.parentElement as HTMLElement;

      return names.includes(parentElement.nodeName) ? parentElement.nodeName : getparentListName(parentElement);
    };

    emit('updateModel:listType', getparentListName(element).toLowerCase());
  };

  document.addEventListener('selectionchange', onSelection);

  onBeforeUnmount(() => {
    document.removeEventListener('selectionchange', onSelection);
  });

  return { textContainer };
};

export default defineComponent({
  setup(props, { emit }) {
    const { textContainer } = useSelectionHandle(emit);

    return { textContainer };
  },
});
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/editor/editor-body.scss';
</style>
