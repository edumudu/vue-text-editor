export const useSelection = () => {
  const selection = document.getSelection() as Selection;
  const anchorNode = selection.anchorNode as Node;
  const range = selection.getRangeAt(0);

  const moveCursorToEnd = (el: HTMLElement | Node) => {
    let moveTo = el.nodeType === 3 ? (el.textContent?.length || 1) : 1;
    moveTo = !el.childNodes.length && el.nodeType !== 3 ? 0 : moveTo;

    selection.removeAllRanges();
    range.setStart(el, moveTo);
    range.setEnd(el, moveTo);
    range.collapse(true);
    selection.addRange(range);
  };

  return {
    selection,
    anchorNode,
    range,
    moveCursorToEnd,
  };
};

export const useRange = () => {
  const range = document.createRange();

  return { range };
};
