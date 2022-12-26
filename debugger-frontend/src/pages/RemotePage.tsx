import React from "react";
import useStore from "hooks/useStore";
import Remote, {RemoteAction} from "components/remote/Remote";
import {observer} from "mobx-react-lite";

const RemotePage: React.FC = observer(() => {

    const store = useStore();
    const { remote } = store;

    const onAction = async (remoteIp: string, action: RemoteAction, arg?: string) => {

        switch (action) {
            case RemoteAction.Reset:
                await remote.reset(remoteIp);
                break;
            case RemoteAction.UploadBIOS:
                if (window.confirm('This will reupload the firmware, are you sure you want to continue?'))
                    await remote.uploadBIOS(remoteIp);
                break;
            case RemoteAction.FormatSDCard:
                if (window.confirm('Are you sure you want to format the SDCard?'))
                    await remote.formatSDCard(remoteIp);
                break;
            case RemoteAction.UploadFullProject:
                await remote.uploadFullProject(remoteIp);
                break;
            case RemoteAction.UploadSingleProject:
                await remote.uploadSingleProject(remoteIp, arg!);
                break;
            case RemoteAction.CleanBuild:
                await remote.cleanLatestBuild(remoteIp);
                break;
            case RemoteAction.UploadFirmware:
                if (window.confirm('Are you sure you want to upload the firmware?'))
                    await remote.uploadFirmware(remoteIp);
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
