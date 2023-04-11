import { CardRecipe } from "./card-recipe.js"
import { FilterSansPromise, FilterFonctionnel, FilterForWhile } from "./filter.js"
import { removeAllChild, ZONES } from "./util.js"

async function getData() {
  return (await fetch("./data/data.json")).json();
}

async function loadRecipes(recipes = []) {
  let resultats = document.querySelector(".resultats");
  removeAllChild(resultats);
  await window.customElements
    .whenDefined("card-recipe")
    .then(async () => {
      for (let i = 0; i < recipes.length; i++) {
        let card = document.createElement("card-recipe");
        let recipeZip = JSON.stringify(recipes[i]);
        card.setAttribute("recipe", recipeZip);
        card.recipe = recipeZip;
        resultats.appendChild(card);
      }
    });
}

async function main() {
  window.customElements.define("card-recipe", CardRecipe);
  let data = await getData();

  // console.log(data)

  let champRecherchePrincipal = document.querySelector("#chercher-recette");

  let formulaire = document.querySelector("#form-recherche");
  formulaire.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tag = champRecherchePrincipal.value;
    if (tag.length >= 3) {
      //let filtre = new FilterForWhile(data.recipes);    // le plus rapide
      let filtre = new FilterSansPromise(data.recipes);   // le plus lisible
      //let filtre = new FilterFonctionnel(data.recipes); // le plus farfelu
      filtre.setZone([
        ZONES.titre,
        ZONES.ingredients,
        ZONES.description
      ]);
      await filtre.filter(tag).then(result => {
        console.log("résultats de la recherche : ", result);
        return loadRecipes(result);
      })
    }
  })

  await loadRecipes(data.recipes);
}

document.addEventListener('readystatechange', () => {
  const elem = (window.addEventListener) ? window : document;
  elem.addEventListener('load', main, false);
});