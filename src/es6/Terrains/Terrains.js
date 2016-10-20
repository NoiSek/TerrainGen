import * as Cave from "./Cave";
import * as Desert from "./Desert";

export default function Terrains() {
  return {
    "cave": Cave.API,
    "desert": Desert.API
  };
}