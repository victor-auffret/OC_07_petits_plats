import { Filter } from "../filter.js";

class FilterHybride extends Filter {

 filter() {
  // memoisation
  if (this.isFiltred) {
   return this.results;
  }

  if (!this.canFilter()) {
   return this.getData();
  }

  const nb_of_zone = this.zones.length;
  const predicate = (recipe) => {
   let trouve = false;
   let zone = -1;
   while (!trouve && ++zone < nb_of_zone) {
    const currentZone = this.zones[zone];
    const currentList = recipe.zones[currentZone];
    trouve = (currentList.indexOf(this.tag) >= 0);
   }
   return trouve;
  };
  this.results = this.getResults().filter(predicate);
  this.isFiltred = true;
  return this.results;
 }

}

export { FilterHybride }