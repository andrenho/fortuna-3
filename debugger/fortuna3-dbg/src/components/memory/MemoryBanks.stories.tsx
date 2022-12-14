import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import MemoryBanks from "./MemoryBanks";

export default {
    title: 'ram/MemoryBanks',
    component: MemoryBanks,
} as ComponentMeta<typeof MemoryBanks>;

const Template: ComponentStory<typeof MemoryBanks> = (args) => <MemoryBanks {...args} />;

export const MyMemoryBanks = Template.bind({});
MyMemoryBanks.args = {
    ramBank: 0,
    bankCount: 8,
};
MyMemoryBanks.storyName = 'MemoryBanks';