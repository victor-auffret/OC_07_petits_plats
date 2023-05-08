import { Filter } from "../filter.js";

class FilterFonctionnel extends Filter {

 filter() {
  // memoisation
  if (this.isFiltred) {
   return this.results;
  }

  if (!this.canFilter()) {
   return this.getData();
  }
  const predicate = (recipe) => this.zones.some(zone => recipe.zones[zone].includes(this.tag));
  this.results = this.getData().filter(predicate);
  this.isFiltred = true;
  return this.results;
 }

}


export { FilterFonctionnel }