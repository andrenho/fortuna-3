import Box from "components/common/box/Box";

type RtcProps = {
    year: number,
    month: number,
    day: number,
    hours: number,
    minutes: number,
    seconds: number,
}

const Rtc : React.FC<RtcProps> = ({ year, month, day, hours, minutes, seconds }) => {

    return <Box title="RTC">
        <div>{month}/{day}/{year} {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</div>
    </Box>
};

export default Rtc;