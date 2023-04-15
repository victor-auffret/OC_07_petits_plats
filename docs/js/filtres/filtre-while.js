import { Filter } from "../filter.js";

class FilterWhile extends Filter {

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

  const zones_size = this.zones.length;
  const predicate = (recipe) => {
   let trouve = false;
   let zone = 0;
   while (!trouve && zone < zones_size) {
    const currentZone = this.zones[zone];
    const currentList = recipe.zones[currentZone]
    trouve = (currentList.indexOf(this.tag) > 0)
    zone++;
   }
   return trouve;
  };
  let index = -1;
  let resIndex = 0;
  const data = this.getData();
  const length = data.length;
  const result = [];
  while (++index < length) {
   const value = data[index];
   if (predicate(value)) {
    result[resIndex++] = value;
   }
  }
  this.data = result;
  this.isFiltred = true;
  return result;
 }
}

export { FilterWhile }
