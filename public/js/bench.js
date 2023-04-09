import { FilterFonctionnel, FilterForWhile, FilterSansPromise } from "./filter.js";
import { ZONES, melanger } from "./util.js";
import * as data from "../data/data.json" assert {
 type: 'json',
 integrity: 'sha384-ABC123'
};

const recipes = melanger(data.recipes)

const tags = [
 "miel",
 "coco",
 "les",
 "poisson",
 "sucre",
 "vers"
]
// nombre d execution de code
const fois = 1_000_000;
// on peut ignorer les premiers resultats
const ignore = 0;

const ZONES_A_TESTER = [
 ZONES.titre,
 ZONES.ingredients,
 ZONES.description
];

// FilterFonctionnel
const f1 = async (tag = "") => {
 const filtre = new FilterFonctionnel(recipes);
 filtre.setZone(ZONES_A_TESTER);
 return filtre.filter(tag);
}

// FilterForWhile
const f2 = async (tag = "") => {
 const filtre = new FilterForWhile(recipes);
 filtre.setZone(ZONES_A_TESTER);
 return filtre.filter(tag);
}

const f3 = async (tag = "") => {
 const filtre = new FilterSansPromise(recipes);
 filtre.setZone(ZONES_A_TESTER);
 return filtre.filter(tag);
}

const algos = [
 {
  nom: "Algo Fonctionnel avec PROMISE",
  fonction: f1,
  temps: 0
 },
 {
  nom: "Algo avec WHILE",
  fonction: f2,
  temps: 0
 },
 {
  nom: "Algo Fonctionnel HYBRIDE (while, sans promise)",
  fonction: f3,
  temps: 0
 },
];

(async () => {
 console.log("test des algos");

 const test = async (algo, tag = "") => {
  //console.log(`test de l'algo ${algo.nom}`);
  const start = performance.now();
  await algo.fonction(tag);
  const stop = performance.now();
  const total = (stop - start);
  algo.temps = (algo.temps + total);
  //console.log(`${algo.nom} : ${total} - temps total : ${algo.temps}ms`);
 }

 let algo_melange = algos

 // on test 100 fois
 for (let i = 0; i < fois; i++) {
  // on change l'ordre des tests
  algo_melange = melanger(algo_melange);
  for (const algo of algo_melange) {
   await test(algo, tags[i % tags.length]);
   if (i < ignore) {
    algo.temps = 0
   }
  }
 }

 //globalThis.setTimeout(() => {
 algo_melange.forEach(algo => {
  console.log(`${algo.temps}ms - algo ${algo.nom} sur ${fois - ignore} exécutions`);
 });

 const premier = algo_melange.sort((a, b) => {
  if (a.temps == b.temps) {
   return 0;
  }
  return (a.temps < b.temps) ? -1 : 1;
 })[0];

 console.log(`Le plus rapide est : ${premier.nom} avec ${premier.temps / (fois - ignore)}ms en moyenne sur ${fois} exécutions et en ignorant les ${ignore} premières exécutions`)
 //}, 5000)

})()
