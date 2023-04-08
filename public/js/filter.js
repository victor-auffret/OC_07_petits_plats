import { ZONES } from './util.js'

/*
Ingredient { 
 ingredient: string, -----------------
 quantity: number,
 unit: string?
}

Recipe {
 id: number,
 name: string, ---------------------
 servings: number,
 ingredients: Ingredient[], -------
 time: number,
 description: string, -------------
 appliance: string, ---------------
 ustensils: string[] --------------
}
*/

class Filter {

  constructor(data = []) {
    this.isFormated = false
    this.zones = []
    this.data = data;
    this.formateData()
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
      }
      recipe.zones = zones
      return recipe
    })
    this.isFormated = true
  }

  setData(data = []) {
    this.data = data;
    this.isFormated = false
  }

  setZone(zones = []) {
    this.zones = zones
  }

  async filter(tag = "") {
    return this.data;
  }

  tagIsValid(tag = "") {
    return !(tag == "" || tag.length < 3)
  }

}

class FilterFonctionnel extends Filter {
  constructor(data) {
    super(data)
  }

  async filter(tag = "") {
    if (!this.tagIsValid(tag)) {
      return this.data
    }
    const exp = new RegExp(tag)
    const predicate = async (recipe) => {
      let promises = []
      this.zones.forEach(zone => {
        promises.push(new Promise((resolve, reject) => {
          const i = recipe.zones[zone].findIndex(txt => exp.test(txt))
          if (i < 0) {
            reject(false)
          } else {
            resolve(true)
          }
        }))
      })
      let result = false
      await Promise.any(promises)
        .then(() => {
          result ||= true
          //console.log("au moins un de vrai pour : ", recipe)
          return true
        })
        .catch(() => {
          //console.log("tout est faux pour : ", recipe)
          return false
        })
      return result
    }

    const asyncFilter = async (arr) => {
      return Promise.all(arr.map(predicate))
        .then((results) => arr.filter((_v, index) => results[index]));
    }

    return await asyncFilter(this.data)

  }

}

class FilterForWhile extends Filter {

  async filter(tag = "") {
    if (!this.tagIsValid(tag)) {
      return this.data
    }
    const exp = new RegExp(tag)
    const predicate = (recipe) => {
      let trouve = false
      let zone = 0
      while (!trouve && zone < this.zones.length) {
        let currentZone = this.zones[zone]
        let i = 0
        while (!trouve && i < recipe.zones[currentZone].length) {
          trouve ||= exp.test(recipe.zones[currentZone][i])
          i++
        }
        zone++
      }
      return trouve
    }

    let index = -1
    let resIndex = 0
    const length = this.data.length
    const result = []

    while (++index < length) {
      const value = this.data[index]
      if (predicate(value)) {
        result[resIndex++] = value
      }
    }
    return result
  }
}

export { Filter, FilterFonctionnel, FilterForWhile }
