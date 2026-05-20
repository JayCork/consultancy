import "../../../packages/tokens/index.css";
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { App } from "./App";
import {
  AddEvidence,
  AdminConfig,
  EvidenceList,
  EvidenceReview,
  PeerReview,
  Register,
  SignIn,
} from "./pages";
import { ProjectNewPage } from "./pages/ProjectNew/ProjectNew";
import { PeoplePage } from "./routes/people";

render(
  () => (
    <Router>
      <Route path="/" component={App} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/register" component={Register} />
      <Route path="/evidence/add" component={AddEvidence} />
      <Route path="/evidence" component={EvidenceList} />
      <Route path="/evidence/:id/edit" component={AddEvidence} />
      <Route path="/peer-review" component={PeerReview} />
      <Route path="/peer-review/:id" component={EvidenceReview} />
      <Route path="/projects/new" component={ProjectNewPage} />
      <Route path="/people" component={PeoplePage} />
      <Route path="/admin" component={AdminConfig} />
      {/* <Route path="/organization" component={OrganizationPage} /> */}
    </Router>
  ),
  document.getElementById("root")!,
);
