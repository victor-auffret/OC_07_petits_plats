import { CardRecipe } from "./card-recipe.js"
import { removeAllChild, ZONES } from "./util.js"
import { StateMachine } from "./stateMachine.js";

const [getMachine] = (() => {
  const machine = new StateMachine();
  const getMachine = () => machine;
  return [getMachine]
})()

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

function showTags(machine) {
  const resultPlace = document.querySelector(".list-tags");
  removeAllChild(resultPlace);

  let filtre = machine.currentFilter;
  let tags = []
  while (filtre != null) {
    const tag = {
      tag: filtre.tag,
      couleur: (filtre.zones.length == 1) ? `tag${filtre.zones[0]}` : ""
    }
    tags.push(tag)
    filtre = filtre.parent;
  }

  tags.reverse().forEach(async ({ tag, couleur }) => {
    const span = document.createElement("span");
    span.classList.add("tag");
    if (couleur != "") {
      span.classList.add(couleur);
    }
    span.appendChild(document.createTextNode(tag));
    const croix = document.createElement("img");
    croix.src = "./assets/croix.svg";
    croix.alt = "supprimer";
    croix.addEventListener("click", async (e) => {
      e.preventDefault()
      if (machine.supTag(tag)) {
        resultPlace.removeChild(span);
        return loadRecipes(machine.getResult())
      }
    })
    span.appendChild(croix);
    resultPlace.appendChild(span);
  })

}

async function main() {
  window.customElements.define("card-recipe", CardRecipe);
  let data = await getData();

  const machine = getMachine();
  machine.setData(data?.recipes ?? []);

  let formulaire = document.querySelector("#form-recherche");
  formulaire.addEventListener('submit', async (e) => {
    e.preventDefault();

    const getTagValue = (champ) => {
      const tag = (champ?.value ?? "").replace(/\s+/g, ' ').trim().toLowerCase();
      champ.value = "";
      return tag;
    }

    const champRecherchePrincipal = document.querySelector("#chercher-recette");
    machine.addTag(getTagValue(champRecherchePrincipal), [
      ZONES.titre,
      ZONES.ingredients,
      ZONES.description
    ]);

    const champRechercheIngredients = document.querySelector("#ingredients");
    machine.addTag(getTagValue(champRechercheIngredients), [ZONES.ingredients]);

    const champRechercheAppareils = document.querySelector("#appareils");
    machine.addTag(getTagValue(champRechercheAppareils), [ZONES.appareils]);

    const champRechercheUstenciles = document.querySelector("#ustensiles");
    machine.addTag(getTagValue(champRechercheUstenciles), [ZONES.ustenciles]);

    const result = machine.getResult()
    showTags(machine);
    return loadRecipes(result);
    /*
    await machine.getResult().then(result => {
      // console.log("résultats de la recherche : ", result);
      showTags(machine);
      return loadRecipes(result);
    });*/

  });

  await loadRecipes(data.recipes);
}

document.addEventListener('readystatechange', () => {
  const elem = (window.addEventListener) ? window : document;
  elem.addEventListener('load', main, false);
});