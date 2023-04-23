import { ZONES, tagIsValid } from './util.js';

class Filter {

  constructor(data = [], parent = null) {
    this.isFormated = false;
    this.isFiltred = false;
    this.zones = [];
    this.tag = "";
    this.parent = parent;
    this.data = data;
    this.formateData();
  }

  setParent(parent = null, data = []) {
    this.parent = parent;
    this.data = data;
    this.isFiltred = false;
    if (data.length > 0) {
      this.formateData();
    }
  }

  setTag(tag = "") {
    if (tagIsValid(tag)) {
      this.tag = tag.replace(/\s+/g, ' ').trim().toLowerCase();
      this.isFiltred = false;
    }
  }

  getData() {
    if (this.parent == null || this.isFiltred) {
      return this.data;
    }
    //if (!this.parent.isFiltred) {
    return this.parent.filter();
    //}
    //return this.parent.data;
  }

  canFilter() {
    return this.zones.length > 0 && tagIsValid(this.tag);
  }

  // on transforme tout en tableau de string
  formateData() {
    this.data = this.getData().map(recipe => {
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
    this.isFormated = true;
  }

  setData(data = []) {
    this.data = data;
    if (data.length > 0) {
      this.formateData();
    }
    this.isFormated = false;
  }

  setZone(zones = []) {
    this.zones = zones;
  }

  filter() {
    return this.data;
  }

}

export { Filter }
