import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper, Polyline, InfoWindow } from "google-maps-react";
import Locations from "./components/Locations/Locations";
let style = require("./style.scss");

export class App extends Component {
  constructor() {
    super();
    this.state = {
      positions: [],
      text:'',
      locations: [],
      activeMarker: {},
      selectedPlace: {},
      showingInfoWindow: false
    };
    this.onChange = this.onChange.bind(this)
    this.removeItem = this.removeItem.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
  }

  componentDidMount() {
    this.renderAutoComplete();
  }

  onChange(e){
    this.setState({
      text: e.target.value
    })
  }


  removeItem(i) {
    const arrLocations = [...this.state.locations];
    const arrPositions = [...this.state.positions];
    arrLocations.splice(i, 1);
    arrPositions.splice(i, 1);
    this.setState({
      locations: arrLocations,
      positions: arrPositions
    });
  }

  renderAutoComplete() {
    const { google } = this.props;
    if (!google) return;

    const autocomplete = new google.maps.places.Autocomplete(this.autocomplete);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const coordinate = place.geometry;
      if (!(this.state.locations[length - 1] == place.formatted_address)&&coordinate) {
        this.setState({
          text: "",
          positions: [...this.state.positions, coordinate.location],
          locations: [...this.state.locations, place.formatted_address],
        });
      } else {
        this.setState({
          text: ""
        });
      }
    });
  }

  onMarkerClick(props, marker) {
    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      showingInfoWindow: true
    });
  }

  onInfoWindowClose() {
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });
  }

  render() {
    const bounds = new this.props.google.maps.LatLngBounds()
    const { positions, locations } = this.state;
    if (positions) {
      for (let i = 0; i < positions.length; i++) {
        bounds.extend(positions[i]);
      }}
    return (
      <div className={style.container}>
        <div className={style.box}>
          <div className={style.locations}>
            <input
              type="text"
              value={this.state.text}
              ref={ref => (this.autocomplete = ref)}
              className={style.input}
              onChange={this.onChange}
            />
            <Locations locations={locations} removeItem={this.removeItem} />
          </div>
          <div className={style.map}>
            <Map
              {...this.props}
              initialCenter={{ lat: 0, lng: 0 }}
              centerAroundCurrentLocation={false}
              bounds={bounds}
            >
              {positions
                ? positions.map((position, i) => (
                    <Marker
                      name={locations[i]}
                      onClick={this.onMarkerClick}
                      key={i}
                      position={position}
                    />
                  ))
                : null}
              <Polyline
                fillColor="#0000FF"
                fillOpacity={0.35}
                path={positions || null}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                strokeWeight={2}
              />
              <InfoWindow
                marker={this.state.activeMarker}
                onClose={this.onInfoWindowClose}
                visible={this.state.showingInfoWindow}
              >
                <div>
                  <p style={{ fontWeight: 1000 }}>{this.state.selectedPlace.name}</p>
                </div>
              </InfoWindow>
            </Map>
          </div>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyClcLWvnllja8srQvjzNlrHpYQEPydakNE",
  language: "ru"
})(App);
