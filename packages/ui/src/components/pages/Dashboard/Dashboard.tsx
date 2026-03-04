import { For } from "solid-js";
import styles from "./Dashboard.module.css";
import { NavMenu } from "../../molecules/NavMenu/NavMenu";
import { Header } from "../../molecules/Header/Header";
import { StarInput } from "../../organisms";
import { AppShell } from "../../templates";
import { Container } from "../../atoms/Container/Container";
import { ProgressTracker } from "../../organisms/ProgressTracker/ProgressTracker";

interface DashboardProps {
  // Define your props here
}

export const Dashboard = (props: DashboardProps) => {
  return (
    <AppShell
      navMenuProps={{
        title: "Dashboard",
        items: [
          { id: 1, href: "/home", label: "Home" },
          { id: 2, href: "/profile", label: "Profile" },
        ],
      }}
    >
      <>
        <Container>
          <h2>Your SFIA</h2>
          <ProgressTracker percentComplete={70} />
          <p>
            You're evidence and feedback suggests that you already fulfill ~70%
            of the requirements for the next SFIA level.
          </p>
        </Container>
        <Container>
          <StarInput />
        </Container>
      </>
    </AppShell>
  );
};
