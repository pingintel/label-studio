import React from "react";
import { Elem } from "../../utils/bem";
import Input from "antd/lib/input";
import { observer } from "mobx-react";

export const AddressInput = observer(
  ({ block, index = 0, item, isReadonly = false, info = false }) => {
    const getInputStyle = value => {
      const currentValue = value ? value.length : "";

      if (isReadonly && currentValue === "") {
        return {
          backgroundImage: `linear-gradient(
          -45deg,
          #ccc 25%,
          transparent 25%,
          transparent 50%,
          #ccc 50%,
          #ccc 75%,
          transparent 75%,
          transparent
        )`,
          backgroundSize: "40px 40px",
          opacity: 0.5
        };
      }
      return {};
    };

    const itemChangeHandler = (name, value) => {
      if (isReadonly) return;
      item.updateBlock(index, name, value);
    };

    return (
      <Elem
        name="address-inputs-container"
        style={{
          width: "100%"
        }}
      >
        <Elem name="address-row">
          <Elem name="input-container-street-input">
            <Input
              placeholder="Street or Intersection"
              name={`street_${index + 1}`}
              value={block.street}
              onChange={e => itemChangeHandler("street", e.target.value)}
              disabled={isReadonly && block.street && block.street.length === 0}
              style={getInputStyle(block.street)}
            />
            {isReadonly && <Elem name="info">street</Elem>}
          </Elem>
          <Elem name="input-container-unit-input">
            <Input
              placeholder="Unit, Apt, Floor"
              name={`unit_${index + 1}`}
              value={block.unit}
              onChange={e => itemChangeHandler("unit", e.target.value)}
              disabled={isReadonly && block.unit && block.unit.length === 0}
              style={getInputStyle(block.unit)}
            />
            {isReadonly && <Elem name="info">unit</Elem>}
          </Elem>
          <Elem name="input-container-city-input">
            <Input
              placeholder="City"
              name={`city_${index + 1}`}
              value={block.city}
              onChange={e => itemChangeHandler("city", e.target.value)}
              disabled={isReadonly && block.city && block.city.length === 0}
              style={getInputStyle(block.city)}
            />
            {isReadonly && <Elem name="info">city</Elem>}
          </Elem>
          <Elem name="input-container-place-name-input">
            <Input
              placeholder="Place Name (e.g. Walmart, Central Park)"
              name={`place_name_${index + 1}`}
              value={block.placeName}
              onChange={e => itemChangeHandler("placeName", e.target.value)}
              disabled={
                isReadonly && block.placeName && block.placeName.length === 0
              }
              style={getInputStyle(block.placeName)}
            />
            {isReadonly && <Elem name="info">place_name</Elem>}
          </Elem>
        </Elem>

        <Elem name="address-row">
          <Elem name="input-container-state-input">
            <Input
              placeholder="State"
              name={`state_${index + 1}`}
              value={block.state}
              onChange={e => itemChangeHandler("state", e.target.value)}
              disabled={isReadonly && block.state && block.state.length === 0}
              style={getInputStyle(block.state)}
            />
            {isReadonly && <Elem name="info">state</Elem>}
          </Elem>
          <Elem name="input-container-zip-input">
            <Input
              placeholder="Zip"
              name={`zip_${index + 1}`}
              value={block.zip}
              onChange={e => itemChangeHandler("zip", e.target.value)}
              disabled={isReadonly && block.zip && block.zip.length === 0}
              style={getInputStyle(block.zip)}
            />
            {isReadonly && <Elem name="info">zip</Elem>}
          </Elem>
          <Elem name="input-container-county-input">
            <Input
              placeholder="County"
              name={`county_${index + 1}`}
              value={block.county}
              onChange={e => itemChangeHandler("county", e.target.value)}
              disabled={isReadonly && block.county && block.county.length === 0}
              style={getInputStyle(block.county)}
            />
            {isReadonly && <Elem name="info">county</Elem>}
          </Elem>
          <Elem name="input-container-country-input">
            <Input
              placeholder="Country"
              name={`country_${index + 1}`}
              value={block.country}
              onChange={e => itemChangeHandler("country", e.target.value)}
              disabled={
                isReadonly && block.country && block.country.length === 0
              }
              style={getInputStyle(block.country)}
            />
            {isReadonly && <Elem name="info">country</Elem>}
          </Elem>
        </Elem>
      </Elem>
    );
  }
);
