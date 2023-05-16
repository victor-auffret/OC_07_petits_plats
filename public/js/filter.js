import { tagIsValid, formatTag } from './util.js';

class Filter {

  constructor(data = [], parent = null) {
    this.isFiltred = false;
    this.zones = [];
    this.tag = "";
    this.parent = parent;
    this.data = data;
    this.results = [];
    this.nomChamp = "";
  }

  // fonction réécrite dans les différentes classes héritées
  filter() {
    return this.data;
  }

  canFilter() {
    return this.zones.length > 0 && tagIsValid(this.tag);
  }

  /** GETTER & SETTER **/

  getNomChamp() {
    return this.nomChamp;
  }

  setNomChamp(nom) {
    this.nomChamp = nom;
  }

  hasParent() {
    return this.parent != null;
  }

  getParent() {
    return this.hasParent() ? this.parent : null;
  }

  setParent(parent = null) {
    this.parent = parent;
    this.isFiltred = false;
  }

  getTag() {
    return this.tag;
  }

  setTag(tag = "") {
    tag = formatTag(tag);
    if (tagIsValid(tag)) {
      this.tag = tag;
      this.isFiltred = false;
    }
  }

  // retourne les dernières données non filtrées valides (à utiliser pour un nouveau filtre)
  getData() {
    return (this.parent == null) ? this.data : this.parent.filter();
  }

  // on retourne les resultats filtrés ou les données du parent
  getResults() {
    if (this.isFiltred) {
      return this.results;
    } else {
      return this.getData();
    }
  }

  setData(data = []) {
    this.data = data;
    this.isFiltred = false;
  }

  getZones() {
    return this.zones;
  }

  setZone(zones = []) {
    this.zones = zones;
  }

}

export { Filter }
