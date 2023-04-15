import { Filter } from "../filter.js";

class FilterHybride extends Filter {

 filter() {
  // memoisation
  if (this.isFiltred) {
   return this.data;
  }

  if (this.parent != null && !this.parent.isFiltred) {
   this.parent.filter();
  }

  if (!this.canFilter()) {
   return this.getData();
  }

  const nb_of_zone = this.zones.length;
  const predicate = (recipe) => {
   let trouve = false;
   let i = 0;
   while (!trouve && i < nb_of_zone) {
    const currentZone = this.zones[i];
    const currentList = recipe.zones[currentZone];
    trouve = (currentList.indexOf(this.tag) > 0);
    ++i;
   }
   return trouve;
  };
  this.data = this.getData().filter(predicate)
  this.isFiltred = true;
  return this.data;
 }

}

export { FilterHybride }