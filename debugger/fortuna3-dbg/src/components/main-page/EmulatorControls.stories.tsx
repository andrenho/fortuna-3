import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import EmulatorControls from "./EmulatorControls";

export default {
    title: 'mainpage/EmulatorControls',
    component: EmulatorControls,
} as ComponentMeta<typeof EmulatorControls>;

const Template: ComponentStory<typeof EmulatorControls> = () => <EmulatorControls />;

export const MyEmulatorControls = Template.bind({});
MyEmulatorControls.storyName = 'EmulatorControls';