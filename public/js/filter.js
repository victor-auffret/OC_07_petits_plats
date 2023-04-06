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
   recipe.name = [recipe.name ?? ""]
   recipe.ingredients = recipe.ingredients.map(ing => ing.ingredient)
   recipe.description = [recipe.description ?? ""]
   recipe.appliance = [recipe.appliance ?? ""]
   return recipe
  })
  this.isFormated = true
 }

 setData(data = []) {
  this.data = data;
  this.isFormated = false
 }

 // titre       = name, 
 // ingredient  = ingredients, 
 // description = description
 // ustenciles  = ustensils
 // appareils   = appliance
 setZone(zones = []) {
  this.zones = zones
 }

 filter(tag = "") {
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

 filter(tag = "") {
  if (!this.tagIsValid(tag)) {
   return this.data
  }
  const predicate = async recipe => {
   const exp = new RegExp(tag)
   let promises = []
   this.zones.forEach(zone => {
    promises.add(new Promise((resolve, reject) => {
     const i = recipe[zone].findIndex(txt => exp.test(txt))
     const callback = (i < 0) ? reject : resolve
     callback()
    }))
   })
   let result = false
   await Promise.any(promises)
    .then(() => result = true)
    .catch(() => result = false)
   return result
  }

  return this.data.filter(async recipe => await predicate(recipe.name))
 }

}

class FilterForWhile extends Filter {

 filter(tag = "") {
  if (!this.tagIsValid(tag)) {
   return this.data
  }

  const predicate = recipe => {
   const exp = new RegExp(tag)
   let trouve = false
   let zone = 0
   while (!trouve || zone < this.zones.length) {
    let tab = recipe[zone]
    let i = 0
    while (!trouve && i < tab.length) {
     trouve = exp.test(tab[i])
     i++
    }
    zone++
   }
   return trouve
  }

  let index = -1
  let resIndex = 0
  const length = this.data == null ? 0 : this.data.length
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
