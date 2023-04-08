import pkg from "benchmark"
import { FilterFonctionnel, FilterForWhile } from "./filter.js"
import { ZONES } from "./util.js"
import * as data from "../data/data.json" assert {
 type: 'json',
 integrity: 'sha384-ABC123'
}

const { Benchmark } = pkg
const suite = new Benchmark.Suite;

suite
 .add('test 1 FilterFonctionnel : ', async () => {
  let filtre = new FilterFonctionnel(data.recipes)
  filtre.setZone([
   ZONES.titre,
   ZONES.ingredients,
   ZONES.description
  ])
  const tag = "coco"
  await filtre.filter(tag)
 })
 .add('test 2 FilterForWhile : ', async () => {
  let filtre = new FilterForWhile(data.recipes)
  filtre.setZone([
   ZONES.titre,
   ZONES.ingredients,
   ZONES.description
  ])
  const tag = "coco"
  await filtre.filter(tag)
 })
 .on('cycle', function (event) {
  console.log(String(event.target))
 })
 .on('complete', function () {
  console.log('fini !');
 })
 .run({ 'async': true });
