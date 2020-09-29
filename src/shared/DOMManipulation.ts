type NodeText = Node | Text;
type WrapCallback = (node: NodeText) => void;

export const useDOMManipulation = () => {
  const getEndNode = (n: NodeText, endNode: NodeText = document, wrapCallback: WrapCallback | null): NodeText => {
    if (n.isSameNode(endNode)) return n;
    if (n.contains(endNode)) return getEndNode(n.firstChild as Node, endNode, wrapCallback);
    if (n.nextSibling?.contains(endNode)) return getEndNode(n.nextSibling, endNode, wrapCallback);

    if (n.nextSibling && wrapCallback) {
      wrapCallback(n.nextSibling);

      return getEndNode(n.nextSibling, endNode, wrapCallback);
    }

    return getEndNode(n.parentNode as NodeText, endNode, wrapCallback);
  };

  return { getEndNode };
};
