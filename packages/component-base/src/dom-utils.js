export function getAncestorRootNodes(node) {
  const result = [];

  while (node.parentNode) {
    const parentNode = node.parentNode;

    if (parentNode.nodeType === Node.DOCUMENT_NODE) {
      result.push(parentNode);
      break;
    }

    if (parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      result.push(parentNode);
      node = parentNode.host;
      continue;
    }

    if (parentNode.assignedSlot) {
      node = parentNode.assignedSlot;
      continue;
    }

    node = parentNode;
  }

  return result;
}
