import { EvidenceForm, type EvidenceFormProps } from "../../organisms/EvidenceForm/EvidenceForm";
import styles from "./EvidenceAdd.module.css";

export const EvidenceAdd = (props: EvidenceFormProps) => {
  return (
    <div class={styles.base}>
      <h1 class={styles.title}>Record Evidence</h1>
      <p class={styles.intro}>
        Record a piece of evidence using the STAR method. Be specific, the more
        detail you provide, the more useful it is for your progression reviews.
      </p>
      <EvidenceForm {...props} />
    </div>
  );
};
