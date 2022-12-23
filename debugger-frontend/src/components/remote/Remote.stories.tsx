import {ComponentMeta, ComponentStory} from "@storybook/react";
import Remote from "./Remote";
import {RemoteResult} from "store/remoteStore";

export default {
    title: 'standalone/Remote',
    component: Remote,
} as ComponentMeta<typeof Remote>;

const Template: ComponentStory<typeof Remote> = (args) => <div style={{display:'table'}}>
    <Remote {...args} />
</div>;

export const MyRemote = Template.bind({});
MyRemote.args = {
    result: RemoteResult.Success,
    output: "This is an output messsage.\nNew line.",
    projectList: ["os", "list"],
};
MyRemote.storyName = 'Remote';