import { Filter } from "../filter.js";

class FilterAsyncPromise extends Filter {

 async filter() {
  // memoisation
  if (this.isFiltred) {
   return this.data;
  }

  if (this.parent != null && !this.parent.isFiltred) {
   await this.parent.filter();
  }

  if (!this.canFilter()) {
   return this.getData();
  }

  const zones_size = this.zones.length;

  const predicate = async (recipe) => {
   let promises = [];
   for (let i = 0; i < zones_size; i++) {
    const zone = this.zones[i];
    promises.push(new Promise((resolve, reject) => {
     const currentList = recipe.zones[zone];
     const ok = (currentList.indexOf(this.tag) > 0);
     if (ok) {
      resolve(true);
     } else {
      reject(false);
     }
    }));
   }
   return Promise.any(promises).catch(() => false);
  };
  // OK

  this.data = await this.getData().then(data => data.reduce(async (results, recipe) => await predicate(recipe) ? [...(await results), recipe] : results, []));
  this.isFiltred = true;
  return this.data;
 }

}

export { FilterAsyncPromise }