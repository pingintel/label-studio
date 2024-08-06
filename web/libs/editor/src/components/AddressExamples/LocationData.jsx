import React from 'react';
import CopySpan from './CopySpan.jsx';

const LocationData = ({ data, copyable }) => {
  return <table>
    <thead>
      <tr>
        <th
          style={{
            backgroundColor: "#cecece",
            fontWeight: "bold",
            textAlign: "right",
            maxWidth: "400px",
          }}
        >
          Header
        </th>
        <th
          style={{
            backgroundColor: "#cecece",
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          Value
        </th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(data).map(([key, value], index) => (
        <tr key={index + key}>
          <td
            style={{
              textAlign: "right",
              backgroundColor: "#cecece",
              fontWeight: "bold",
              maxWidth: "400px",
            }}
          >
            {key}
          </td>
          <td style={{ textAlign: "left" }}>
            {copyable && (
              <CopySpan>{value}</CopySpan>
            )}
            {!copyable && value}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
}

export default LocationData;
