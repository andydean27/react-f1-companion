const TimingHeader = ({ expanded, sessionType }) => {
    return sessionType === "Race" ?      
        <tr>
            <th>Pos</th>
            <th>Name</th>
            <th></th>
            <th>Interval</th>
            <th>Gap</th>
            {expanded && <>
                <th>Fastest Lap</th>
                <th>Sector 1</th>
                <th>Sector 2</th>
                <th>Sector 3</th>
            </>}
            <th>Tyre</th>
        </tr> : 
        <tr>
            <th>Pos</th>
            <th>Name</th>
            <th>Fastest Lap</th>
            <th>Sector 1</th>
            <th>Sector 2</th>
            <th>Sector 3</th>
            <th>Tyre</th>
            <th></th>
        </tr>
};
export default TimingHeader;