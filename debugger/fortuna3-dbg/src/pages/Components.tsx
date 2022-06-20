import SDCard from "../components/SDCard";
import useStore from "../hooks/useStore";

export default function Components() : JSX.Element {

    const { state } = useStore();

    return (<>
        { state.lastError ?? <h2 style={{color:"red"}}>{ state.lastError }</h2> }
        <SDCard />
    </>);
}