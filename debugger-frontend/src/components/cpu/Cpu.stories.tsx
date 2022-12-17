import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import Cpu from "./Cpu";
import {Z80State} from "api/fortuna3-emulator";

export default {
    title: 'standalone/Cpu',
    component: Cpu,
} as ComponentMeta<typeof Cpu>;

const Template: ComponentStory<typeof Cpu> = (args) => <div style={{display:'table'}}>
    <Cpu {...args} />
</div>;

const rnd = () => Math.floor(Math.random() * 0x10000);
const rndb = () => Math.random() < 0.5;

const cpu : Z80State = {
    af: rnd(), afx: rnd(), bc: rnd(), bcx: rnd(), de: rnd(), dex: rnd(), hl: rnd(), hlx: rnd(),
    ix: rnd(), iy: rnd(), i: rnd(), pc: rnd(), sp: rnd(),
    c: rndb(), h: rndb(), n: rndb(), pv: rndb(), s: rndb(), z: rndb(),
}

export const MyCpu = Template.bind({});
MyCpu.args = { cpu }
MyCpu.storyName = 'Cpu';