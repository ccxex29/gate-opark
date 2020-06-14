import React from 'react';
import './App.css';
import axios from 'axios';

import ParkingLot from "./Modules/ParkingLot";

class App extends React.Component {
  serverSyncState : NodeJS.Timeout | undefined;

  state = {
    locId: '0',
    locName: '',
    lotBooked: []
  }

  // openGate = () => {
  //   this.setState({gateState: 1});
  // };
  //
  // closeGate = () => {
  //   this.setState({gateState: 0});
  // };

  serverSync = async () => {
    const parkingData = await axios.get('https://express-opark.herokuapp.com/parkinglot/check', { headers: {'Content-Type': 'application/json'} })
        .then(res => {
          return res.data;
        });
    const locationSlotIndex = parkingData.findIndex((location : any) => location.locationID === this.state.locId);
    if (locationSlotIndex !== -1){
      this.setState({
        locName: parkingData[locationSlotIndex].locationName
      });
      const newLotBooked: any[] = [];
      for (let locationSlotElement of parkingData[locationSlotIndex].locationSlot) {
        newLotBooked.push(locationSlotElement);
      }
      this.setState({
        lotBooked: [...newLotBooked]
      });
    }
  };

  componentDidMount(){
    this.serverSyncState = setInterval(() => {
      this.serverSync();
    }, 1000);
  }
  componentWillUnmount() {
    if (this.serverSyncState instanceof NodeJS.Timeout) {
      clearInterval(this.serverSyncState);
    }
  }



  render() {

    return (
        <div className={'fullPage'}>
          <div className={'contentWrapper'}>
            <h1>PARKING LOCATION: { this.state.locName } (ID:
              <input type={'text'}
                  // @ts-ignore
                    onChange={(event) => this.setState({ locId: event.target.value.toString() })}
                    value={ this.state.locId }
                    style={{
                      width: '20px',
                      height: '30px',
                      padding: '0',
                      fontSize: '1em',
                      textAlign: 'center',
                      fontWeight: 600,
                      border: 'none'
                    }}
              />)
            </h1>

            <div className={'lotWrapper'}>
              {
                this.state.lotBooked.map((lot: any) => {
                  return (<ParkingLot
                      lotId={ lot.locationSlotId }
                      lotState={ lot.locationSlotStatus }
                  />)
                })
              }
            </div>
            {/*<div>*/}
            {/*  <button onClick={this.openGate}>Force Open</button>*/}
            {/*  <button onClick={this.closeGate}>Force Close</button>*/}
            {/*</div>*/}
          </div>
        </div>
    );
  }
}

export default App;
