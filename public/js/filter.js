import { ZONES } from './util.js';

class Filter {

  constructor(data = []) {
    this.isFormated = false;
    this.zones = [];
    this.data = data;
    this.formateData();
  }

  // on transforme tout en tableau de string
  formateData() {
    this.data = this.data.map(recipe => {
      const zones = {
        [ZONES.appareils]: [recipe.appliance ?? ""],
        [ZONES.description]: [recipe.description ?? ""],
        [ZONES.ingredients]: recipe.ingredients.map(ing => ing.ingredient),
        [ZONES.titre]: [recipe.name ?? ""],
        [ZONES.ustenciles]: recipe.ustensils ?? []
      };
      recipe.zones = zones;
      return recipe;
    });
    this.isFormated = true;
  }

  setData(data = []) {
    this.data = data;
    this.isFormated = false;
  }

  setZone(zones = []) {
    this.zones = zones;
  }

  async filter(tag = "") {
    return this.data;
  }

  tagIsValid(tag = "") {
    return !(tag == "" || tag.length < 3);
  }

}

class FilterFonctionnel extends Filter {

  async filter(tag = "") {
    if (!this.tagIsValid(tag)) {
      return this.data;
    }
    const exp = new RegExp(tag);

    const zones_size = this.zones.length;

    const predicate = async (recipe) => {
      let promises = [];
      for (let i = 0; i < zones_size; i++) {
        const zone = this.zones[i];
        promises.push(new Promise((resolve, reject) => {
          const currentList = recipe?.zones?.[zone];
          const ok = currentList.some(txt => exp.test(txt))
          if (ok) {
            resolve(true);
          } else {
            reject(false);
          }
        }));
      }
      return Promise.any(promises).catch(() => false);
    }
    // OK
    return this.data.reduce(async (results, recipe) => await predicate(recipe) ? [...(await results), recipe] : results, []);
    // predicate(recipe).then(async ok => ok ? [...(await results), recipe] : results)
    // Promise.all([results, predicate(recipe)]).then(([r, ok]) => ok ? [...r, recipe] : r)

    // NE FONCTIONNE PAS
    // return this.data.filter(predicate)

    // FAIT 2 BOUCLES
    // return Promise.all(this.data.map(recipe => predicate(recipe))).then(boolTab => this.data.filter((_, i) => boolTab[i]))
  }

}

class FilterForWhile extends Filter {

  async filter(tag = "") {
    if (!this.tagIsValid(tag)) {
      return this.data;
    }
    const exp = new RegExp(tag);
    const zones_size = this.zones.length;
    const predicate = (recipe) => {
      let trouve = false;
      let zone = 0;
      while (!trouve && zone < zones_size) {
        const currentZone = this.zones[zone];
        const currentList = recipe.zones[currentZone]
        const currentListSize = currentList.length
        let i = 0;
        while (!trouve && i < currentListSize) {
          trouve ||= exp.test(currentList[i]);
          i++;
        }
        zone++;
      }
      return trouve;
    };

    let index = -1;
    let resIndex = 0;
    const length = this.data.length;
    const result = [];

    while (++index < length) {
      const value = this.data[index];
      if (predicate(value)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
}

class FilterSansPromise extends Filter {

  async filter(tag = "") {
    if (!this.tagIsValid(tag)) {
      return this.data;
    }
    const exp = new RegExp(tag);
    const nb_of_zone = this.zones.length;
    const predicate = (recipe) => {
      let trouve = false;
      let i = 0;
      while (!trouve && i < nb_of_zone) {
        const currentZone = this.zones[i];
        const currentList = recipe.zones[currentZone];
        trouve = (currentList.some(chaine => exp.test(chaine)));
        ++i;
      }
      return trouve;
    };
    return this.data.filter(predicate)
  }

}

export { FilterFonctionnel, FilterForWhile, FilterSansPromise }
