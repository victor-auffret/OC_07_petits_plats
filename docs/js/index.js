import { CardRecipe } from "./card-recipe.js"
import { removeAllChild, formatTag, ZONES, NOMS_CHAMPS } from "./util.js"
import { FilterManager } from "./filterManager.js";

// récupération des données du fichier json
async function getData() {
  return (await fetch("./data/data.json")).json();
}

// affiche les résultats (supprime les anciens résultats)
function renderRecipes(recipes = []) {
  let resultats = document.querySelector(".resultats");
  removeAllChild(resultats);
  const size = recipes.length;
  if (size == 0) {
    resultats.appendChild(document.createTextNode("Aucun résultats"));
    return;
  }
  for (let i = 0; i < size; i++) {
    let card = document.createElement("card-recipe");
    let recipeZip = JSON.stringify(recipes[i]);
    card.setAttribute("recipe", recipeZip);
    card.recipe = recipeZip;
    resultats.appendChild(card);
  }
}

function createTag(coloredTag, manager, resultPlace) {
  let { tag, couleur, name } = coloredTag
  console.log("tag : ", tag, " couleur : ", couleur, " name : ", name)
  const span = document.createElement("span");
  span.classList.add("tag");
  if (couleur != "") {
    span.classList.add(couleur);
  }
  span.appendChild(document.createTextNode(tag));
  const croix = document.createElement("img");
  croix.classList.add("tag-close");
  croix.src = "./assets/croix.svg";
  croix.alt = "supprimer";
  croix.addEventListener("click", async (e) => {
    e.preventDefault()
    if (manager.removeTag(coloredTag)) {
      resultPlace.removeChild(span);
      renderRecipes(manager.getResult());
    }
  })
  span.appendChild(croix);
  return span;
}

function renderTags(manager) {
  const resultPlace = document.querySelector(".list-tags");
  removeAllChild(resultPlace);

  let filtre = manager.currentFilter;
  let tags = []
  while (filtre != null) {
    const tag = {
      tag: filtre.tag,
      couleur: (filtre.zones.length == 1) ? `tag${filtre.zones[0]}` : "",
      name: filtre.getNomChamp()
    }
    tags.push(tag)
    filtre = filtre.parent;
  }

  tags.reverse().forEach(async (coloredTag) => {
    resultPlace.appendChild(createTag(coloredTag, manager, resultPlace));
  })

}

// main lancé au chargement de la page
async function main() {
  window.customElements.define("card-recipe", CardRecipe);

  // chargement des données
  let dataPromise = getData();
  // element html pour afficher les recettes
  let cardRecipePromise = window.customElements.whenDefined("card-recipe");

  Promise.all([dataPromise, cardRecipePromise]).then(([data, _]) => {

    const manager = new FilterManager();
    manager.setData(data?.recipes ?? []);
    console.log(data.recipes)

    const getAndRemoveTagValue = (champ) => {
      const tag = formatTag(champ?.value ?? "");
      champ.value = "";
      return tag;
    }

    const formulaire = document.querySelector("#form-recherche");
    const champRecherchePrincipal = document.querySelector("#chercher-recette");
    const champRechercheIngredients = document.querySelector("#ingredients");
    const champRechercheAppareils = document.querySelector("#appareils");
    const champRechercheUstenciles = document.querySelector("#ustensiles");

    const champs = [

      {
        input: champRecherchePrincipal,
        name: NOMS_CHAMPS.principale,
        zones: [ZONES.titre, ZONES.ingredients, ZONES.description]
      },
      {
        input: champRechercheIngredients,
        name: NOMS_CHAMPS.ingredients,
        zones: [ZONES.ingredients]
      },
      {
        input: champRechercheAppareils,
        name: NOMS_CHAMPS.appareils,
        zones: [ZONES.appareils]
      },
      {
        input: champRechercheUstenciles,
        name: NOMS_CHAMPS.ustenciles,
        zones: [ZONES.ustenciles]
      },
    ];

    // on ajoute un effet lorsque 3 caractères sont tapés
    champs.forEach(champ => {
      champ.input.addEventListener("input", e => {
        const tag = formatTag(e.target.value);
        // on envoie les données au manager
        manager.inputChange(champ, tag);
        // on récupère les résultats
        const result = manager.getResult();
        // on affiche les résultats
        renderRecipes(result);
      })
    });


    formulaire.addEventListener('submit', e => {
      e.preventDefault();
      // on valide les tags
      if (manager.validate()) {
        // on supprime le contenu du champ
        champs.forEach(champ => champ.input.value = "");
        // on affiche les tags
        renderTags(manager);
      }
    });


    // on affiche les données du json non triées
    renderRecipes(data.recipes);

  });
}

document.addEventListener('readystatechange', () => {
  const elem = (window.addEventListener) ? window : document;
  elem.addEventListener('load', main, false);
});