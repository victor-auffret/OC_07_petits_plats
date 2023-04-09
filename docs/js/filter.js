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

    const predicate = async (recipe) => {
      let promises = [];
      this.zones.forEach(zone => {
        promises.push(new Promise((resolve, reject) => {
          const ok = recipe.zones[zone].some(txt => exp.test(txt))
          if (ok) {
            resolve(true);
          } else {
            reject(false);
          }
        }))
      })
      return Promise.any(promises).catch((v) => false)
    }
    const asyncFilter = async (arr) => Promise.all(arr.map(predicate))
      .then((results) => arr.filter((_v, index) => results[index]));

    return asyncFilter(this.data)
  }

  /*

  async filter(tag = "") {

    const predicate = async (recipe) => {
      let promises = [];
      this.zones.forEach(
        zone => promises.push(
          new Promise(
            () => recipe.zones[zone].findIndex(txt => exp.test(txt)) >= 0
          )
        )
      )
      return Promise.all(promises).then(tab => tab.some(v => v == true));
    }
    const asyncFilter = async (arr = []) => {
      console.log("enter async", arr)
      let promises = []
      const size = arr.length
      for (let i = 0; i < size; i++) {
        promises.push(new Promise(async (resolve) => predicate(arr[i]).then(resolve)));
      }
      console.log("push", promises.length)
      globalThis.setTimeout(() => {
        console.log(promises)
      }, 5000)
      return Promise.all(promises).then((results) => {
        console.log("results", results)
        arr.filter((_v, index) => results[index])
      }).catch((r) => {
        console.log("erreur", r)
      }).finally(() => {
        console.log("fin wtf", promises)
      });
    }
    return asyncFilter(this.data);
  }

  */
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
        //const currentZone = ;
        const currentList = recipe.zones[this.zones[zone]]
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
    const nb_of_zone = this.zones.length ?? 0;
    const predicate = (recipe) => {
      let trouve = false;
      let i = 0;
      while (!trouve && i < nb_of_zone) {
        //const currentZone = this.zones[i];
        const currentList = recipe.zones[this.zones[i]];
        trouve ||= (currentList.some(chaine => exp.test(chaine)));
        ++i;
      }
      return trouve;
    };

    return this.data.filter(predicate)
  }

}

export { FilterFonctionnel, FilterForWhile, FilterSansPromise }
