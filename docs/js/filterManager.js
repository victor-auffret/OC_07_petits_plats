import { formatTag, tagIsValid, ZONES } from "./util.js";
import { FilterHybride } from "./filtres/index.js";
// import { FilterWhile } from "./filtres/index.js";
// import { FilterFonctionnel } from "./filtres/index.js";

class FilterManager {

  constructor() {
    // les données du json (non filtrés)
    this.data = [];
    // la liste des tags validés
    this.tags = [];
    // le filtre courrant
    this.currentFilter = null;
    // champ actuel en cours d edition de tag
    this.currentInput = null;
  }

  // creation d un nouveau filtre
  addNewFilter() {
    if (this.currentFilter == null) {
      this.currentFilter = new FilterHybride(this.data);
    } else {
      let nouveauFiltre = new FilterHybride([], this.currentFilter);
      this.currentFilter = nouveauFiltre;
    }
    this.setCurrentZones(this.currentInput.zones);
    this.currentFilter.setNomChamp(this.currentInput.name);
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
      this.currentFilter.setTag(tag);
      if (!tagIsValid(this.currentFilter.getTag())) {
        this.cancelCurrentFilter();
      }
    }
  }

  // vérification du mode edition
  isCurrentInput(champ) {
    return this.currentInput != null && champ.name == this.currentInput.name;
    // && champ.zones.every((zone) => this.currentInput.zones.indexOf(zone) > 0);
  }

  // cree un filtre OU modifie le filtre courrant
  inputChange(champ, tag) {
    if (!this.isCurrentInput(champ)) {
      this.currentInput = champ;
      this.addNewFilter();
      this.currentFilter.setNomChamp(champ.name)
    }
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
    console.log("get results", this)
    if (this.currentFilter != null) {
      console.log("pas null")
      return this.currentFilter.filter();
    }
    console.log("null")
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
    if (this.currentFilter != null && tagIsValid(tag) && this.tags.some(c => tag == c.tag && c.name == name)) {
      console.log("REMOVE TAG OK", tag, " - ", name)
      let filtres = [];
      let filtre = this.currentFilter;
      console.log(filtre)
      while (filtre != null && filtre.hasParent()) {
        if (filtre.tag == tag && filtre.getNomChamp() == name) {
          console.log("--break")
          break;
        }
        console.log("-no-break")
        filtre.isFiltred = false;
        filtres.push(filtre);
        filtre = filtre.getParent();
        console.log("parent : ", filtre)
      }

      console.log("parent : ", filtre)

      if (filtre != null && filtre.tag == tag) {
        console.log("filtre non null tag ok")
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

  // valide le champ en cours d edition pour ajouter le tag de la bonne couleur
  validate() {
    if (this.currentInput != null && this.currentFilter != null) {
      const tag = this.currentFilter.getTag();
      const name = this.currentFilter.getNomChamp();
      const zones = this.currentFilter.getZones();
      const exist = (this.tags.some(el => el.tag.indexOf(tag) > 0 && el.name == name) > 0);
      console.log(this.tags, " index ", exist)
      if (!tagIsValid(tag) || exist) {
        // on supprime le filtre courrant
        this.cancelCurrentFilter();
        return false;
      }
      this.currentInput = null;
      this.tags.push({ tag, zones, name });
      return true;
    }
    return false;
  }

}

export { FilterManager };
