import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import Toolbar, { ToolbarActive, ToolbarIconOrSeparator } from "./Toolbar";
import { faMicrochip, faMemory } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react";

export default {
    title: 'mainpage/Toolbar',
    component: Toolbar,
} as ComponentMeta<typeof Toolbar>;

const Template: ComponentStory<typeof Toolbar> = (args) => {
    const [active, setActive] = useState<ToolbarActive>({
        "cpu": false,
        "ram": true,
        "test": false,
    })

    const onToggle = (key: string) => {
        setActive({...active, [key]: !active[key]})
    };

    return <Toolbar {...args} active={active} onToggle={onToggle} />;
};

export const MyToolbar = Template.bind({});
MyToolbar.args = {
    icons: [
        { key: "cpu", icon: faMicrochip },
        "separator",
        { key: "ram", icon: faMemory, color: "green" },
        { key: "test", text: "RAM" },
    ]
};
MyToolbar.storyName = 'Toolbar';