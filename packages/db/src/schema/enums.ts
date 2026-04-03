import { pgEnum } from "drizzle-orm/pg-core";

export const competencyTypeEnum = pgEnum("competency_type", [
  "technology",
  "practice",
  "methodology",
]);

export const competencyProficiencyLevelEnum = pgEnum(
  "competency_proficiency_level",
  ["aware", "practising", "confident", "leading"],
);

export const comptenyDispositionEnum = pgEnum("competency_disposition", [
  "seeking",
  "neutral",
  "open",
  "winding_down",
  "prefer_not",
]);
