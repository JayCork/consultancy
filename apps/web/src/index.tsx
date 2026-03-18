import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { App } from "./App";
import { SignIn } from "./pages/SignIn";

render(
  () => (
    <Router>
      <Route path="/" component={App} />
      <Route path="/sign-in" component={SignIn} />
    </Router>
  ),
  document.getElementById("root")!,
);
