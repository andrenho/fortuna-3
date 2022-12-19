import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import ProjectSelector from "./ProjectSelector";

export default {
    title: 'code/ProjectSelector',
    component: ProjectSelector,
    argTypes: {
        selectedProject: { control: false }
    }
} as ComponentMeta<typeof ProjectSelector>;

const Template: ComponentStory<typeof ProjectSelector> = (args) => {
    const [selectedProject, setSelectedProject] = useState("bios");

    return <ProjectSelector 
        {...args}
        selectedProject={selectedProject}
        onSelectProject={newFile => setSelectedProject(newFile)}
    />;
};

export const MyProjectSelector = Template.bind({});
MyProjectSelector.args = {
    projects: ["bios", "main"]
};
MyProjectSelector.storyName = 'ProjectSelector';