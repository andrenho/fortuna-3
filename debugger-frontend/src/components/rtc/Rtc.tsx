import Box from "components/common/Box/Box";
import React from "react";

type RtcProps = {
    year: number,
    month: number,
    day: number,
    hours: number,
    minutes: number,
    seconds: number,
    running?: boolean,
}

const Rtc : React.FC<RtcProps> = ({ year, month, day, hours, minutes, seconds, running = false }) => {

    return <Box title="RTC" running={running}>
        <div>{month}/{day}/{year} {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</div>
    </Box>
};

export default Rtc;