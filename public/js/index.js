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

// creer un tag pouvant etre supprime ou edite
function createTag(coloredTag, manager, resultPlace) {
  let { tag, couleur, name } = coloredTag
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
  const supprimerTag = async (e) => {
    e.preventDefault()
    if (manager.removeTag(coloredTag)) {
      resultPlace.removeChild(span);
      // renderRecipes(manager.getResult());
    }
  };
  //croix.addEventListener("click", supprimerTag)
  span.appendChild(croix);
  span.addEventListener("click", e => {
    supprimerTag(e);
    renderRecipes(manager.getResult());
    /*
    // permet d editer un tag
    if (e.target == span) {
      let input = document.querySelector(`.champ${name.toLowerCase()}`)
      if (input) {
        input.value = tag;
        input.focus();
        let champ = {
          input,
          name,
          zones: (name == NOMS_CHAMPS.principale) ? [
            ZONES.titre,
            ZONES.description,
            ZONES.ingredients
          ] : [name],
        };
        // on envoie les données au manager
        manager.inputChange(champ, tag);
        showAutocomplete(tag, champ, manager);
      }
    }
    */
  })
  return span;
}

// affiche la liste des tags validés
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

// affiche la liste des ingedients et autres pour auto completion des tags
function showAutocomplete(tag, champ, manager) {
  // on récupère la liste des éléments correspondant
  let list = manager.getList(champ, tag);
  if (list.length > 0) {
    let autoComplet = document.querySelector(`.list${champ.name}`)
    if (autoComplet) {
      removeAllChild(autoComplet)
      let uls = [
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div")
      ];
      list.forEach((elem, i) => {
        let li = document.createElement("p")
        li.classList.add("auto-tag-clic")
        let span = document.createElement("span")
        span.appendChild(document.createTextNode(elem))
        li.appendChild(span)
        li.addEventListener('click', e => {
          e.preventDefault();
          // todo : changer pour tag complet
          let tagComplet = elem; //tag;
          // manager.inputChange(champ, tagComplet);
          manager.inputChange(champ, tagComplet);
          manager.validate();
          // manager.validateClic(champ, tagComplet);
          renderRecipes(manager.getResult());
          champ.input.value = "";
          // on affiche les tags
          renderTags(manager);
        })
        uls[i % 3].appendChild(li);
      })
      uls.forEach(ul => {
        ul.classList.add("list-auto-tag")
        autoComplet.appendChild(ul)
      })

    }
  } else {
    removeAllChild(document.querySelector(`.list${champ.name}`))
  }
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

    const formulaire = document.querySelector("#form-recherche");
    const champRecherchePrincipal = document.querySelector("#chercher-recette");
    const champRechercheIngredients = document.querySelector("#ingredients");
    const champRechercheAppareils = document.querySelector("#appareils");
    const champRechercheUstenciles = document.querySelector("#ustensiles");

    const champInfos = {
      input: champRecherchePrincipal,
      name: NOMS_CHAMPS.principale,
      zones: [ZONES.titre, ZONES.ingredients, ZONES.description]
    };

    champRecherchePrincipal.addEventListener("input", e => {
      const tag = formatTag(e.target.value);
      // on envoie les données au manager
      manager.inputChange(champInfos, tag);
      // on récupère les résultats
      const result = manager.getResult();
      // on affiche les résultats
      renderRecipes(result);
    })

    const champs = [
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

      champ.input.addEventListener("focusout", e => {
        window.setTimeout(() => removeAllChild(document.querySelector(`.list${champ.name}`)), 200)
      })

      champ.input.addEventListener("click", e => {
        let tag = ""
        if (champ.input.value == "" && champRecherchePrincipal.value != "") {
          if (manager.currentFilter != null &&
            manager.currentFilter.getTag() == champRecherchePrincipal.value &&
            !manager.currentFilter.isValidate()) {
            if (manager.validate()) {
              champRecherchePrincipal.value = "";
              renderTags(manager);
            }
            manager.setCurrentInput(champ);
          }
        }
        tag = formatTag(champ.input.value);
        manager.inputChange(champ, tag);
        showAutocomplete(tag, champ, manager);
      })

      champ.input.addEventListener("input", e => {
        const tag = formatTag(e.target.value);

        if (!manager.isCurrentInput(champ)) {
          manager.setCurrentInput(champ);
          manager.addNewFilter();
        } else {
          manager.setCurrentInput(champ);
          manager.setCurrentTag(tag);
          //manager.inputChange(champ, tag);
        }

        /*
        const result = manager.getResult();
        // on affiche les résultats
        renderRecipes(result);*/
        showAutocomplete(tag, champ, manager);
      });
    });


    formulaire.addEventListener('submit', e => {
      e.preventDefault();
      // on valide les tags
      if (champRecherchePrincipal.value != "") {
        const tag = formatTag(champRecherchePrincipal.value);
        // on envoie les données au manager
        manager.inputChange(champInfos, tag);
        manager.validate()
        // on supprime le contenu du champ
        //champs.forEach(champ => champ.input.value = "");
      }
      champRecherchePrincipal.value = ""
      champs.forEach(champ => removeAllChild(document.querySelector(`.list${champ.name}`)));
      // on affiche les tags
      renderTags(manager);

    });


    // on affiche les données du json non triées
    renderRecipes(data.recipes);

  });
}

document.addEventListener('readystatechange', () => {
  const elem = (window.addEventListener) ? window : document;
  elem.addEventListener('load', main, false);
});