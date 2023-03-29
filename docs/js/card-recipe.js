import { removeAllChild } from "./util.js"

class CardRecipe extends HTMLElement {

 static get observedAttributes() {
  return ["recipe"];
 }

 constructor() {
  super()
  //this.setAttribute("recipe", null)
 }

 connectedCallback() {
  this.render()
 }

 disconnectedCallback() {

 }

 attributeChangedCallback(name) {
  if (name == "recipe") {
   this.render();
  }
 }

 render() {
  const data = this.getAttribute("recipe")
  if (data != null && data != "") {
   const recipe = JSON.parse(data)
   removeAllChild(this)
   console.log(recipe)
   let card = document.createElement("article")
   card.classList.add("card-recette")
   let cardImage = document.createElement("div")
   cardImage.classList.add("card-image")
   card.appendChild(cardImage)

   let cardFooter = document.createElement("footer")
   cardFooter.classList.add("card-footer")
   card.appendChild(cardFooter)

   let cardHeader = document.createElement("div")
   cardHeader.classList.add("card-header")
   cardFooter.appendChild(cardHeader)

   let cardTitle = document.createElement("h4")
   cardTitle.classList.add("card-title")
   cardTitle.innerText = `${recipe?.name}`
   cardHeader.appendChild(cardTitle)

   let cardTemps = document.createElement("p")
   cardTemps.classList.add("card-temps")
   cardHeader.appendChild(cardTemps)

   let horloge = document.createElement("img")
   horloge.src = "./assets/horloge.svg"
   horloge.alt = "logo horloge"
   cardTemps.appendChild(horloge)

   let temps = document.createElement("data")
   temps.value = recipe?.time ?? 0
   temps.innerText = ` ${temps.value} min `
   cardTemps.appendChild(temps)

   let cardContent = document.createElement("div")
   cardContent.classList.add("card-content")
   cardFooter.appendChild(cardContent)

   let cardIngredients = document.createElement("div")
   cardIngredients.classList.add("card-ingredients")
   cardContent.appendChild(cardIngredients)

   let listIngredient = document.createElement("ul")
   for (let i = 0; i < recipe?.ingredients?.length ?? 0; i++) {
    let ingredient = recipe?.ingredients?.[i]
    let li = document.createElement("li")
    li.classList.add("card-ingredient")

    let quoi = document.createTextNode(`${ingredient?.ingredient ?? ""} `)

    li.appendChild(quoi)
    let qte = document.createElement("data")
    qte.classList.add("card-ingredient-quantite")
    qte.value = ingredient?.quantity ?? 0
    qte.innerText = ` ${ingredient?.quantity ?? 0} ${ingredient?.unit ?? ""}`
    li.appendChild(qte)
    listIngredient.appendChild(li)
   }
   cardIngredients.appendChild(listIngredient)

   let cardInstructions = document.createElement("div")
   cardInstructions.classList.add("card-instructions")

   let instructions = recipe?.description?.split(", ") ?? []
   for (let i = 0; i < instructions.length; i++) {
    let p = document.createElement("p")
    p.innerText = instructions[i]
    cardInstructions.appendChild(p)
   }

   cardContent.appendChild(cardInstructions)

   this.appendChild(card)
  }
 }

}

export { CardRecipe }
