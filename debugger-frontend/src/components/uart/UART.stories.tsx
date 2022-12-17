import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import UART from "./UART";

export default {
    title: 'standalone/UART',
    component: UART,
} as ComponentMeta<typeof UART>;

const array = new Uint8Array(64 * 1024);
window.crypto.getRandomValues(array);

const Template: ComponentStory<typeof UART> = (args) => <UART {...args} />;

export const MyUART = Template.bind({});
MyUART.args = {
    columns: 60,
    rows: 20,
    cursorX: 0,
    cursorY: 0,
    lines: ["Hello world!".split(""), "This is line 2".split("")]
};
MyUART.storyName = 'UART';