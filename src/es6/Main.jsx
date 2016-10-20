import Inferno from "inferno";
import InfernoDOM from "inferno-dom";

import Sandbox from "./Components/Sandbox";

export default function Main() {
  InfernoDOM.render(<Sandbox />, document.getElementById("inferno-mount"));
}

Main();
