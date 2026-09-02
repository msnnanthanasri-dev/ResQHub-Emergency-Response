import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function Map() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Emergency GIS Map</h1>

      <p>
        Monitor emergencies, relief camps, volunteers and resources.
      </p>

      <div
        style={{
          marginTop: "25px",
          height: "500px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[13.0827, 80.2707]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[13.0827, 80.2707]}>
            <Popup>
              <strong>Flood Emergency</strong>
              <br />
              Chennai
              <br />
              Severity: Critical
            </Popup>
          </Marker>

          <Marker position={[17.6868, 83.2185]}>
            <Popup>
              <strong>Cyclone Emergency</strong>
              <br />
              Visakhapatnam
              <br />
              Severity: High
            </Popup>
          </Marker>

          <Marker position={[11.6854, 76.1320]}>
            <Popup>
              <strong>Landslide</strong>
              <br />
              Wayanad
              <br />
              Severity: Medium
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;