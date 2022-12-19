import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import RAM from "./Ram";

export default {
    title: 'ram/RAM',
    component: RAM,
    argTypes: {
        bytes: { control: false },
        stack: { control: false },
        ramPage: { control: false },
    }
} as ComponentMeta<typeof RAM>;

const array = new Uint8Array(64 * 1024);
window.crypto.getRandomValues(array);

const Template: ComponentStory<typeof RAM> = (args) => {
    const [ramPage, setRamPage] = useState(0);
    return <RAM {...args} ramPage={ramPage} onPageChange={n => setRamPage(n)} bytes={array.slice(ramPage * 256, (ramPage + 1) * 256)} />;
}

export const MyRAM = Template.bind({});
MyRAM.args = {
    pc: 0,
    ramPage: 0,
    bytes: array,
    stack: array.slice(0, 16),
    ramBank: 0
};
MyRAM.storyName = 'RAM';