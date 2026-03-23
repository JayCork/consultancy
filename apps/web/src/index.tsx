import "../../../packages/tokens/index.css";
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { App } from "./App";
import {
  AddEvidence,
  EvidenceList,
  PeerReview,
  Register,
  SignIn,
} from "./pages";

render(
  () => (
    <Router>
      <Route path="/" component={App} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/register" component={Register} />
      <Route path="/evidence/add" component={AddEvidence} />
      <Route path="/evidence" component={EvidenceList} />
      <Route path="/peer-review" component={PeerReview} />
    </Router>
  ),
  document.getElementById("root")!,
);
