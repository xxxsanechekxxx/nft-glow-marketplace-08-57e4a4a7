import type { Meta, StoryObj } from "@storybook/react";
import { NFTCard } from "./NFTCard";
import { BrowserRouter } from "react-router-dom";

const meta = {
  title: "Components/NFTCard",
  component: NFTCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof NFTCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "1",
    name: "Cosmic Perspective #1",
    image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=800&auto=format&fit=crop",
    price: "2.5",
    creator: "CryptoArtist",
  },
};

export const LongTitle: Story = {
  args: {
    ...Default.args,
    name: "This is a very long NFT title that might wrap to multiple lines",
  },
};

export const HighPrice: Story = {
  args: {
    ...Default.args,
    price: "999.99",
  },
};