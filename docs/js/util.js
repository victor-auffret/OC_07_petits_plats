// supprimer tout le contenu d un element
function removeAllChild(node) {
  //if (node && node.children.length > 0) {
  while (node.firstChild && node.lastChild) {
    node.removeChild(node.lastChild);
  }
  //}
}

// melanger les elements d un array 
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

// format du tag
function formatTag(unformattedTag = "") {
  return unformattedTag.replace(/\s+/g, ' ').trim().toLowerCase();
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

const NOMS_CHAMPS = {
  principale: '_PRINCIPALE',
  ingredients: '_INGREDIENTS',
  ustenciles: '_USTENCILES',
  appareils: '_APPAREILS'
}

export { removeAllChild, melanger, tagIsValid, formatTag, ZONES, NOMS_CHAMPS }