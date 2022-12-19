import { ComponentMeta, ComponentStory } from "@storybook/react";
import Rtc from "./Rtc";

export default {
    title: 'standalone/Rtc',
    component: Rtc,
} as ComponentMeta<typeof Rtc>;

const Template: ComponentStory<typeof Rtc> = (args) => <div style={{display:'table'}}>
    <Rtc {...args} />
</div>;

export const MyRtc = Template.bind({});
MyRtc.args = {
    year: 2022, month: 8, day: 24, hours: 19, minutes: 28, seconds: 32,
};
MyRtc.storyName = 'Rtc';