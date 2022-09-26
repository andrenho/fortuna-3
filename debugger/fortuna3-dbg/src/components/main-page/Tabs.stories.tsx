import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import { useState } from "react";
import Tabs from "./Tabs";

export default {
    title: 'mainpage/Tabs',
    component: Tabs,
} as ComponentMeta<typeof Tabs>;


const Template: ComponentStory<typeof Tabs> = (args) => {
    const [selected, setSelected] = useState(0);

    return <Tabs 
        {...args}
        selected={selected} 
        onChange={n => setSelected(n)}
    />;
};

export const MyTabs = Template.bind({});
MyTabs.args = {
    tabs: ["Tab 1", "Tab 2"]
};
MyTabs.storyName = 'Tabs';