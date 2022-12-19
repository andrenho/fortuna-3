import { ComponentMeta, ComponentStory } from "@storybook/react";
import Lcd from "./Lcd";

export default {
    title: 'standalone/Lcd',
    component: Lcd,
} as ComponentMeta<typeof Lcd>;

const Template: ComponentStory<typeof Lcd> = (args) => <div style={{display:'table'}}>
    <Lcd {...args} />
</div>;

export const MyLcd = Template.bind({});
MyLcd.args = {
    line1: "This is line1",
    line2: "This is line2",
};
MyLcd.storyName = 'Lcd';