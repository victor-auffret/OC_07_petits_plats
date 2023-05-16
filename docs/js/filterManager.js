import { formatTag, NOMS_CHAMPS, tagIsValid, ZONES } from "./util.js";
import { FilterHybride } from "./filtres/index.js";
// import { FilterWhile } from "./filtres/index.js";
// import { FilterFonctionnel } from "./filtres/index.js";

class FilterManager {

  constructor() {
    // les données du json (non filtrés)
    this.data = [];
    // le filtre courrant
    this.currentFilter = null;
    // champ actuel en cours d edition de tag
    this.currentInput = null;
  }

  getLastValidateFilter() {
    let filter = this.currentFilter;
    while (filter != null) {
      if (filter.isValidate()) {
        return filter;
      }
      filter = filter.getParent()
    }
    return null;
  }

  setCurrentInput(champ) {
    this.currentInput = champ;
  }

  // creation d un nouveau filtre
  addNewFilter() {
    let lastValidateFilter = this.getLastValidateFilter();
    if (lastValidateFilter == null) {
      this.currentFilter = new FilterHybride(this.data);
    } else {
      let nouveauFiltre = new FilterHybride([], lastValidateFilter);
      this.currentFilter = nouveauFiltre;
    }
    if (this.currentInput != null) {
      this.setCurrentZones(this.currentInput.zones);
      this.currentFilter.setNomChamp(this.currentInput.name);
    }
  }

  setCurrentFilter(champ, tag = "") {
    if (!this.isCurrentInput(champ)) {
      this.setCurrentInput(champ);
      if (this.currentFilter == null) {
        this.addNewFilter()
      } else {
        this.currentFilter.setNomChamp(this.currentInput.name);
        this.setCurrentZones(this.currentInput.zones);
      }
    }
    this.setTag(tag);
  }

  setTag(tag = "") {
    if (this.currentFilter != null && !this.currentFilter.isValidate()) {
      this.currentFilter.setTag(formatTag(tag));
    }
  }

  // modification du filtre actuel
  setCurrentZones(zones = []) {
    if (this.currentFilter != null) {
      this.currentFilter.setZone(zones);
    }
  }

  // modification du filtre actuel
  setCurrentTag(tag = "") {
    if (this.currentFilter != null) {
      tag = formatTag(tag)
      this.setTag(tag);
      if (!tagIsValid(tag)) {
        this.cancelCurrentFilter();
      }
    } else {
      console.log("echec set current tag")
    }
  }

  // vérification du mode edition
  isCurrentInput(champ) {
    return this.currentInput != null && champ.name == this.currentInput.name;
    // && champ.zones.every((zone) => this.currentInput.zones.indexOf(zone) > 0);
  }

  // cree un filtre OU modifie le filtre courrant
  inputChange(champ, tag) {
    if (this.currentFilter != null) {
      if (this.currentFilter.getNomChamp() != champ.name && !this.currentFilter.isValidate()) {
        // on supprime l ancien filtre en cours d edition
        this.cancelCurrentFilter()
      }
    }

    this.setCurrentInput(champ);
    this.addNewFilter();
    this.setCurrentTag(tag);
  }

  // les données json de base
  setData(data = []) {
    // this.data = data;
    this.data = data.map(recipe => {
      const zones = {
        [ZONES.appareils]: (recipe?.appliance ?? "").toLowerCase(),
        [ZONES.description]: (recipe?.description ?? "").toLowerCase(),
        [ZONES.ingredients]: recipe?.ingredients.map(ing => ing.ingredient.toLowerCase()).join(" "),
        [ZONES.titre]: (recipe?.name ?? "").toLowerCase(),
        [ZONES.ustenciles]: (recipe?.ustensils?.join(" ") ?? "").toLowerCase()
      };
      recipe.zones = zones;
      return recipe;
    });
  }

  // QUE FAIT CETTE FONCTION : 
  // elle renvoie les données (filtrées si un filtre existe)
  getResult() {
    if (this.currentFilter != null) {
      console.log("curr filter not null", this.currentFilter)
      return this.currentFilter.filter();
    }
    return this.data;
  }

  // annule le filtre en cours d edition
  cancelCurrentFilter() {
    if (this.currentFilter != null) {
      this.currentFilter = this.currentFilter.getParent();
      this.currentInput = null;
    }
  }

  removeTag({ tag, name }) {
    if (this.currentFilter != null && tagIsValid(tag) && this.tagExist(name, tag)) {
      let filtres = [];
      let filtre = this.currentFilter;
      while (filtre != null && filtre.hasParent()) {
        if (filtre.tag == tag && filtre.getNomChamp() == name) {
          break;
        }
        filtre.isFiltred = false;
        filtres.push(filtre);
        filtre = filtre.getParent();
      }

      if (filtre != null && filtre.tag == tag) {
        let nouveauParent = filtre.getParent();
        if (filtres.length > 0) {
          let nouvelEnfant = filtres.pop();
          nouvelEnfant.setParent(nouveauParent);
          if (!nouvelEnfant.hasParent()) {
            nouvelEnfant.setData(this.data);
          }
        }
        else {
          this.currentFilter = nouveauParent;
        }
        return true;
      }
    }
    return false;
  }

  tagExist(name, tag = "") {
    let filtre = this.currentFilter;
    while (filtre != null) {
      if (filtre.getTag() == tag && filtre.getNomChamp() == name && filtre.isValidate()) {
        return true;
      }
      filtre = filtre.getParent();
    }
    return false;
  }

  // valide le champ en cours d edition pour ajouter le tag de la bonne couleur
  validate() {
    if (this.currentInput != null && this.currentFilter != null) {
      if (this.currentFilter.isValidate()) {
        this.addNewFilter()
      }
      if (this.currentFilter.getTag().length < this.currentInput.input.value.length) {
        this.setTag(this.currentInput.input.value);
      }
      const tag = formatTag(this.currentFilter.getTag());
      console.log("tag validate : ", tag)
      const name = this.currentFilter.getNomChamp();
      //const zones = this.currentFilter.getZones();
      const exist = this.tagExist(name, tag);

      if (!tagIsValid(tag) || exist) {
        // on supprime le filtre courrant
        console.log('CANCEL !!!!!!!!!!!!!!!!!!!!!!!', exist, tag);
        console.log(this)
        this.cancelCurrentFilter();
        return false;
      }
      this.currentFilter.setValidate(true);
      this.currentInput = null;
      return true;
    }
    return false;
  }

  validateClic(champ, tag = "") {

    console.log("validate clic")
    console.log(this)

    this.setCurrentInput(champ);
    this.addNewFilter();
    this.setTag(tag);

    return this.validate()
  }

  // 
  getList(champ, tag = "") {
    tag = formatTag(tag)
    if (tagIsValid(tag)) {
      let elements = this.getResult()
      switch (champ.name) {
        case NOMS_CHAMPS.appareils: {
          return [...new Set(elements
            .filter(recipe => recipe.zones[ZONES.appareils].indexOf(tag) >= 0)
            .map(recipe => recipe.appliance.toLowerCase()))
          ];
        }

        case NOMS_CHAMPS.ustenciles: {
          // (recipe?.ustensils?.join(" ") ?? "").toLowerCase()
          let results = elements.map(recipe => recipe.ustensils).flat()
          //.reduce((ustenciles, acc) => [acc, ...ustenciles], [])
          return [...new Set(results.filter(ustencile => ustencile.indexOf(tag) >= 0))];
        }

        case NOMS_CHAMPS.ingredients: {
          //recipe?.ingredients.map(ing => ing.ingredient.toLowerCase())
          let results = elements
            .map(recipe => recipe?.ingredients.map(ing => ing.ingredient.toLowerCase()))
            .flat();
          return [...new Set(results.filter(ingredient => ingredient.indexOf(tag) >= 0))];
        }

        default: {
          return [...new Set(
            elements
              .map(recipe => recipe.zones[champ.name] ?? "")
              .filter((zone) => zone.indexOf(tag) >= 0))
          ];
        }
      }

    }
    return []
  }

}

export { FilterManager };
