import { tagIsValid } from "./util.js";
import { FilterHybride } from "./filtres/index.js";
// import { FilterWhile } from "./filtres/index.js";
// import { FilterFonctionnel } from "./filtres/index.js";

class FilterManager {

 constructor() {
  this.data = [];
  this.tags = [];
  this.currentFilter = null;
 }

 setData(data = []) {
  this.data = data;
 }

 getResult() {
  if (this.currentFilter != null) {
   return this.currentFilter.filter();
   //return await this.currentFilter.filter();
  }
  return this.data;
 }

 handleAddTag(tag = "", zones = []) {
  if (this.currentFilter == null) {
   //this.currentFilter = new FilterFonctionnel(this.data);
   // this.currentFilter = new FilterForWhile(this.data);
   this.currentFilter = new FilterHybride(this.data);
   // this.currentFilter = new FilterArrayMethodOnly(this.data); 
   this.currentFilter.setZone(zones);
   this.currentFilter.setTag(tag);
  } else {
   //let nextFilter = new FilterFonctionnel([], this.currentFilter);
   // let nextFilter =  new FilterForWhile([], this.currentFilter);
   let nextFilter = new FilterHybride([], this.currentFilter);
   // let nextFilter = new FilterArrayMethodOnly([], this.currentFilter); 
   nextFilter.setZone(zones);
   nextFilter.setTag(tag);
   this.currentFilter = nextFilter;
  }
 }

 addTag(tag = "", zones = []) {
  console.log("add tag : ", tag);
  tag = tag.toLowerCase();
  if (tagIsValid(tag) && !this.tags.includes(tag)) {
   this.tags.push(tag);
   this.handleAddTag(tag, zones);
  }
 }

 handleRemoveTag(tag = "") {

  if (this.currentFilter != null) {
   let filtres = [];
   let filtre = this.currentFilter;
   while (filtre != null && filtre.tag != tag && filtre.parent != null) {
    filtre.isFiltred = false;
    filtres.push(filtre);
    filtre = filtre.parent
   }

   if (filtre != null && filtre.tag == tag) {
    let nouveauParent = filtre.parent;
    let nouvelEnfant = filtres.pop();
    if (nouvelEnfant) {
     console.log(nouvelEnfant)
     nouvelEnfant?.setParent(nouveauParent, this.data);
    }
    else {
     this.currentFilter = nouveauParent;
    }
   }
  }
 }

 supTag(tag = "") {
  tag = tag.toLowerCase();
  if (tagIsValid(tag) && this.tags.includes(tag)) {
   this.tags = this.tags.filter(t => t != tag);
   this.handleRemoveTag(tag);
   return true;
  }
  return false;
 }


}

export { FilterManager };
