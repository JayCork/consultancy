import {
  EvidenceForm,
  EvidenceFormInitialData,
  type EvidenceFormProps,
} from "../../organisms/EvidenceForm/EvidenceForm";
import styles from "./EvidenceAdd.module.css";

interface EvidenceAddProps extends EvidenceFormProps {
  title?: string;
  intro?: string;
  initialData?: EvidenceFormInitialData;
}

export const EvidenceAdd = (props: EvidenceAddProps) => {
  return (
    <div class={styles.base}>
      <h1 class={styles.title}>{props.title ?? "Record Evidence"}</h1>
      <p class={styles.intro}>
        {props.intro ??
          "Record a piece of evidence using the STAR method. Be specific, the more detail you provide, the more useful it is for your progression reviews."}
      </p>
      <EvidenceForm {...props} />
    </div>
  );
};
