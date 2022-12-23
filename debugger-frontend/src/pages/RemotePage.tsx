import React from "react";
import useStore from "hooks/useStore";
import Remote, {RemoteAction} from "components/remote/Remote";
import {observer} from "mobx-react-lite";

const RemotePage: React.FC = observer(() => {

    const store = useStore();
    const { remote } = store;

    const onAction = async (action: RemoteAction, arg?: string) => {

        switch (action) {
            case RemoteAction.Reset:
                await remote.reset();
                break;
            case RemoteAction.UploadBIOS:
                await remote.uploadBIOS();
                break;
            case RemoteAction.UploadFirmware:
                if (window.confirm('Are you sure you want to upload the firmware?'))
                    await remote.uploadFirmware();
                break;
            case RemoteAction.UploadFullProject:
                await remote.uploadFullProject();
                break;
            case RemoteAction.UploadSingleProject:
                await remote.uploadSingleProject(arg!);
                break;
        }
    }

    return <Remote
        result={remote.lastResult}
        output={remote.output}
        projectList={Object.keys(store.debuggingInfo.projects)}
        onAction={onAction}
    />;

});

export default RemotePage;
