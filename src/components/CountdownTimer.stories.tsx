import type { Meta, StoryObj } from "@storybook/react";
import { CountdownTimer } from "./CountdownTimer";

const meta = {
  title: "Components/CountdownTimer",
  component: CountdownTimer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CountdownTimer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Set end time to 24 hours from now
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export const Default: Story = {
  args: {
    endTime: tomorrow.toISOString(),
  },
};

// Set end time to 5 minutes from now
const fiveMinutesFromNow = new Date();
fiveMinutesFromNow.setMinutes(fiveMinutesFromNow.getMinutes() + 5);

export const ShortDuration: Story = {
  args: {
    endTime: fiveMinutesFromNow.toISOString(),
  },
};

// Set end time to 7 days from now
const sevenDaysFromNow = new Date();
sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

export const LongDuration: Story = {
  args: {
    endTime: sevenDaysFromNow.toISOString(),
  },
};