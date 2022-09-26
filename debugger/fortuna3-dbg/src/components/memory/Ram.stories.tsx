import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import RAM from "./Ram";

export default {
    title: 'ram/RAM',
    component: RAM,
    argTypes: {
        bytes: { control: false },
        stack: { control: false },
        onPageChange: { type: "function" }
    }
} as ComponentMeta<typeof RAM>;

const array = new Uint8Array(256);
window.crypto.getRandomValues(array);

const Template: ComponentStory<typeof RAM> = (args) => <RAM {...args} />;

export const MyRAM = Template.bind({});
MyRAM.args = {
    pc: 0,
    ramPage: 0,
    bytes: array,
    stack: array.slice(0, 16),
    ramBanks: [0, 1, 3, 4],
};
MyRAM.storyName = 'RAM';