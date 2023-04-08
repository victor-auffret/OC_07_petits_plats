
function removeAllChild(node) {
 while (node.firstChild && node.lastChild) {
  node.removeChild(node.lastChild);
 }
}

const ZONES = {
 titre: '_TITRE',
 ingredients: '_INGREDIENTS',
 description: '_DESCRIPTION',
 ustenciles: '_USTENCILES',
 appareils: '_APPAREILS'
}

export { removeAllChild, ZONES }