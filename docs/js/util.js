
function removeAllChild(node) {
 while (node.firstChild && node.lastChild) {
  node.removeChild(node.lastChild);
 }
}

export { removeAllChild }