interface SelectionParameter {
  node: Text;
  offSet?: number;
}

export const useSelection = () => {
  const selection = document.getSelection() as Selection;
  const anchorNode = selection.anchorNode as Node;

  return {
    selection,
    anchorNode,
  };
};

export const useRange = () => {
  const { selection } = useSelection();
  const range = selection.getRangeAt(0);

  const moveCursorToEnd = (el: HTMLElement | Node): void => {
    let moveTo = el.nodeType === 3 ? (el.textContent?.length || 1) : 1;
    moveTo = !el.childNodes.length && el.nodeType !== 3 ? 0 : moveTo;

    selection.removeAllRanges();
    range.setStart(el, moveTo);
    range.setEnd(el, moveTo);
    range.collapse(true);
    selection.addRange(range);
  };

  const setRange = (start: SelectionParameter, end: SelectionParameter): void => {
    selection.removeAllRanges();
    range.setStart(start.node, start.offSet || 0);
    range.setEnd(end.node, end.offSet || end.node.length);
    selection.addRange(range);
  };

  return {
    range,
    moveCursorToEnd,
    setRange,
  };
};
