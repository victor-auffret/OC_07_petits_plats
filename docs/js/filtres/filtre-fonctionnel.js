import { Filter } from "../filter.js";

class FilterFonctionnel extends Filter {

 filter() {
  // memoisation
  if (this.isFiltred) {
   return this.data;
  }

  if (!this.canFilter()) {
   return this.getData();
  }
  const predicate = (recipe) => this.zones.some(zone => recipe.zones[zone].includes(this.tag));
  this.data = this.getData().filter(predicate);
  this.isFiltred = true;
  return this.data;
 }

}


export { FilterFonctionnel }