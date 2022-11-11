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
        <div>{month}/{day}/{year} {hours}:{minutes}:{seconds}</div>
    </Box>
};

export default Rtc;