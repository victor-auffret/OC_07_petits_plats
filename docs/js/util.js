
function removeAllChild(node) {
  while (node.firstChild && node.lastChild) {
    node.removeChild(node.lastChild);
  }
}

function melanger(tab = []) {
  let currentIndex = tab.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [tab[currentIndex], tab[randomIndex]] = [
      tab[randomIndex], tab[currentIndex]];
  }

  return tab;
}

function tagIsValid(tag = "") {
  return tag.length >= 3;
}

const ZONES = {
  titre: '_TITRE',
  ingredients: '_INGREDIENTS',
  description: '_DESCRIPTION',
  ustenciles: '_USTENCILES',
  appareils: '_APPAREILS'
};

export { removeAllChild, melanger, tagIsValid, ZONES }