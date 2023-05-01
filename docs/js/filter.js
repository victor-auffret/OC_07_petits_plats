import { ZONES, tagIsValid, formatTag } from './util.js';

class Filter {

  constructor(data = [], parent = null) {
    this.isFiltred = false;
    this.zones = [];
    this.tag = "";
    this.parent = parent;
    this.data = data;
    this.results = [];
    this.nomChamp = ""
    //this.formateData();
  }

  // fonction réécrite dans les différentes classes héritées
  filter() {
    return this.data;
  }

  canFilter() {
    console.log("zones : ", this.zones.length)
    console.log("tag : ", this.tag)
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

  setParent(parent = null /*, data = []*/) {
    this.parent = parent;
    //this.setData(data)
    //this.data = data;
    this.isFiltred = false;
  }

  getTag() {
    return this.tag;
  }

  setTag(tag = "") {
    tag = formatTag(tag);
    console.log("check tag ", tag)
    if (tagIsValid(tag)) {
      console.log("tag valide")
      this.tag = tag;
      this.isFiltred = false;
    }
    console.log("tag valide ou pas !!!")
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
