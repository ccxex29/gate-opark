import React from "react";

const ParkingLot = (props: any) => {
    return (
        <div className={'lotState'}>
            <h2>{ props.lotId }</h2>
            <h4>{ props.lotState ? 'BOOKED' : 'AVAILABLE' }</h4>
        </div>
    )
}

export default ParkingLot;