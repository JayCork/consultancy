import { For } from "solid-js";
import styles from "./Dashboard.module.css";
import { NavMenu } from "../../molecules/NavMenu/NavMenu";
import { Header } from "../../molecules/Header/Header";
import { StarInput } from "../../templates";

interface DashboardProps {
  // Define your props here
}

export const Dashboard = (props: DashboardProps) => {
  return (
    <>
      <Header title="Dashboard" />
      <div class={styles.app}>
        <NavMenu />
        <main class={styles.main}>
          <StarInput />
        </main>
      </div>
      <footer class={styles.footer}>
        ~Footer
        {/* Add your footer content here */}
      </footer>
    </>
  );
};
