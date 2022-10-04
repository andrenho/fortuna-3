import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import ComputeUnit from "./ComputeUnit";

export default {
    title: 'standalone/ComputeUnit',
    component: ComputeUnit,
} as ComponentMeta<typeof ComputeUnit>;

const Template: ComponentStory<typeof ComputeUnit> = (args) => <div style={{display:'table'}}>
    <ComputeUnit {...args} />
</div>;

const rnd = () => Math.floor(Math.random() * 0x10000);
const rndb = () => Math.random() < 0.5;

export const MyComputeUnit = Template.bind({});
MyComputeUnit.args = {
    p: 0x12345678,
    q: 0xfedcba98,
    r: 0,
}
MyComputeUnit.storyName = 'ComputeUnit';
