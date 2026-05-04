import { For } from "solid-js";
import styles from "./OrganisationUsers.module.css";
import { Container } from "../../atoms/Container/Container";

interface OrganisationUsersProps {
  user: {
    id: string;
    name: string;
    projects: { id: string; name: string }[];
    relationships: { id: string; name: string; relationshipType: string }[];
  };
}

const parseRelationshipTypeEnum = (type: string) => {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const OrganisationUsers = (props: OrganisationUsersProps) => {
  return (
    <div class={styles.base}>
      <h2>OrganisationUsers page</h2>
      <Container>
        <h3>Your circle</h3>
        <div class={styles.card}>
          <For each={props.user.relationships}>
            {(relationship) => (
              <div class={styles.person}>
                <span class={styles.name}>{relationship.name}</span>
                <span class={styles.profile}> </span>
                <span class={styles.relationshipType}>
                  {parseRelationshipTypeEnum(relationship.relationshipType)}
                </span>
              </div>
            )}
          </For>
        </div>
      </Container>
      <Container>
        <h3>Your projects</h3>
        <For each={props.user.projects}>
          {(project) => <h4>{project.name}</h4>}
        </For>
      </Container>
    </div>
  );
};
