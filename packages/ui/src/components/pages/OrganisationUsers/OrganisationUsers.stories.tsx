import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { OrganisationUsers } from "./OrganisationUsers";

const meta: Meta<typeof OrganisationUsers> = {
  component: OrganisationUsers,
  title: "Pages/OrganisationUsers",
};

export default meta;
type Story = StoryObj<typeof OrganisationUsers>;

export const Default: Story = {
  args: {
    user: {
      id: "user-id",
      name: "Demo User",
      projects: [{ id: "p1", name: "Project Alpha" }],
      relationships: [
        {
          id: "2",
          name: "Jason Curtz",
          relationshipType: "line_manager",
        },
        {
          id: "3",
          name: "Donald McRibs",
          relationshipType: "peer",
        },
        {
          id: "4",
          name: "Jessica Rabbit",
          relationshipType: "peer",
        },
        {
          id: "5",
          name: "Alice Wonderland",
          relationshipType: "mentee",
        },
        {
          id: "6",
          name: "Bob Builder",
          relationshipType: "mentor",
        },
        {
          id: "7",
          name: "Charlie Chaplin",
          relationshipType: "technical_manager",
        },
      ],
    },
  },
};
