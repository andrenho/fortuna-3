import { observer } from "mobx-react-lite";

type ProjectSelectorProps = {
    projects: string[],
    selectedProject: string,
    onSelectProject: (s: string) => void,
}

const ProjectSelector : React.FC<ProjectSelectorProps> = observer(({projects, selectedProject, onSelectProject}) => {
    
    return <>
        <label htmlFor="projects">Project: </label>
        <select name="projects" style={{fontSize: "18px", height: "32px"}} value={selectedProject} onChange={e => onSelectProject(e.target.value)}>
            { projects.map(p => <option key={`projects_${p}`} value={p}>{p}</option>) }
        </select>
    </>;
});

export default ProjectSelector;