import { CardRecipe } from "./card-recipe.js"
// import { Filter } from "./filter.js"
import { removeAllChild } from "./util.js"

async function getData() {
 return (await fetch("./data/data.json")).json()
}

async function loadRecipes(data) {
 console.log(data)
 let resultats = document.querySelector(".resultats")
 removeAllChild(resultats)
 await window.customElements
  .whenDefined("card-recipe")
  .then(async () => {
   const { recipes = [] } = data
   for (let i = 0; i < recipes.length; i++) {
    let card = document.createElement("card-recipe")
    let recipeZip = JSON.stringify(recipes[i])
    card.setAttribute("recipe", recipeZip)
    card.recipe = recipeZip
    resultats.appendChild(card)
   }
  })
}

async function main() {
 window.customElements.define("card-recipe", CardRecipe)
 let data = await getData()
 /*
 let filter = new Filter(data)

 let searchForm = document.querySelector("")
 searchForm.addEventListener("submit", e => {
  e.preventDefault()
  let inputValue = document.querySelector("").value
  let filtredData = filter.filter(inputValue)
  loadRecipes(filtredData)
 })
 */

 await loadRecipes(data)
}

document.addEventListener('readystatechange', () => {
 const elem = (window.addEventListener) ? window : document;
 elem.addEventListener('load', main, false);
});