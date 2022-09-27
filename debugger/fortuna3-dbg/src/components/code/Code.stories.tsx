import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import { useState } from "react";
import { SourceLine } from "store/types/debuggingInfo";
import Code from "./Code";

export default {
    title: 'code/Code',
    component: Code,
    argTypes: {
        selectedFile: { control: false }
    }
} as ComponentMeta<typeof Code>;

const sourceLines : SourceLine[] = [
    { line: '\t; Hello world' },
    { line: 'start:' },
    { line: '\tnop\t; do nothing', address: 0, bytes:[0x0] },
    { line: '\tjp start', address: 1, bytes:[0xc3, 0x0, 0x0] },
];

const Template: ComponentStory<typeof Code> = (args) => {
    const [breakpoints, setBreakpoints] = useState<number[]>([]);

    const swapBreakpoint = (addr: number) => {
        if (breakpoints.includes(addr)) {
            setBreakpoints(breakpoints.filter(n => n !== addr));
        } else {
            setBreakpoints([...breakpoints, addr]);
        }
    };

    return <Code {...args} breakpoints={breakpoints} swapBreakpoint={swapBreakpoint} />;
} 

export const MyCode = Template.bind({});
MyCode.args = {
    pc: 0,
    sourceLines: sourceLines,
};
MyCode.storyName = 'Code';