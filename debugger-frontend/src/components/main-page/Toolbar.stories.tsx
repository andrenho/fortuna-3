import { ComponentMeta, ComponentStory } from "@storybook/react";
import Toolbar, { ToolbarButton, ToolbarSeparator, ToolbarToggle } from "./Toolbar";
import { faMicrochip, faMemory } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react";

export default {
    title: 'mainpage/Toolbar',
    component: Toolbar,
} as ComponentMeta<typeof Toolbar>;

const Template: ComponentStory<typeof Toolbar> = () => {
    const [microchip, setMicrochip] = useState(false);
    const [memory, setMemory] = useState(false);
    const [ram, setRam] = useState(false);

    return <Toolbar>
        <ToolbarToggle icon={faMicrochip} value={microchip} onToggle={() => setMicrochip(!microchip)} />
        <ToolbarSeparator />
        <ToolbarToggle icon={faMemory} color="green" value={memory} onToggle={() => setMemory(!memory)} />
        <ToolbarToggle text="RAM" value={ram} onToggle={() => setRam(!ram)} />
        <ToolbarButton text="Step" onClick={() => console.log("click")} />
    </Toolbar>;
};

export const MyToolbar = Template.bind({});
MyToolbar.args = {};
MyToolbar.storyName = 'Toolbar';