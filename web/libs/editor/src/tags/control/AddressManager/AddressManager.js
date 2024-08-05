import React from "react";
import { observer } from "mobx-react";
import { types, getParent, getParentOfType, destroy } from "mobx-state-tree";
import Registry from "../../../core/Registry";
import ControlBase from "../Base";
import { Block, Elem } from "../../../utils/bem";
import Input from "antd/lib/input/index";
import "./AddressManager.styl";
import { AnnotationMixin } from "../../../mixins/AnnotationMixin";
import ClassificationBase from "../ClassificationBase";
import ProcessAttrsMixin from "libs/editor/src/mixins/ProcessAttrs";
import RequiredMixin from "libs/editor/src/mixins/Required";
import PerRegionMixin from "libs/editor/src/mixins/PerRegion";
import { ReadOnlyControlMixin } from "libs/editor/src/mixins/ReadOnlyMixin";
import TextArea from "antd/lib/input/TextArea";

const TagAttrs = types.model({
  toname: types.maybeNull(types.string)
});

export const AddressBlock = types
  .model({
    street: types.optional(types.string, ""),
    unit: types.optional(types.string, ""),
    city: types.optional(types.string, ""),
    placeName: types.optional(types.string, ""),
    state: types.optional(types.string, ""),
    zip: types.optional(types.string, ""),
    county: types.optional(types.string, ""),
    country: types.optional(types.string, "")
  })
  .views(self => ({
    get parent() {
      return getParentOfType(self, AddressManagerModel);
    }
  }))
  .actions(self => ({
    updateField(name, value) {
      self[name] = value;

      self.parent.onChange();
      return self;
    }
  }));

const Model = types
  .model({
    type: "addressmanager",
    blocks: types.array(AddressBlock),
    dynamic: true
  })
  .views(self => ({
    get serializableValue() {
      if (!self.blocks.length) return null;
      return self.blocks.map(block => block.toJSON());
    },
    selectedValues() {
      return self.serializableValue;
    }
  }))
  .actions(self => ({
    addBlock() {
      self.blocks.push(AddressBlock.create());
      self.updateResult();
    },
    removeLastBlock() {
      if (self.blocks.length > 0) {
        const lastBlock = self.blocks.pop();
        destroy(lastBlock);
      }
    },
    setValue(value) {
      if (self.from_name.valueType === "addressmanager") {
        self.value.addressmanager = value.map(block =>
          AddressBlock.create(block)
        );
      } else {
        self.value[self.from_name.valueType] = value;
      }
    },
    updateBlock(index, field, value) {
      self.blocks[index] = self.blocks[index].updateField(field, value);
    },
    updateFromResult(value) {
      console.log("value", value);
      const newBlocks = value.map(blockData => {
        console.log("blockData", blockData);
        const addressData = {
          street: blockData.street || "",
          unit: blockData.unit || "",
          city: blockData.city || "",
          placeName: blockData.placeName || "",
          state: blockData.state || "",
          zip: blockData.zip || "",
          county: blockData.county || "",
          country: blockData.country || ""
        };

        return AddressBlock.create(addressData);
      });
      console.log(newBlocks);
      self.blocks.replace(newBlocks);
    },
    needsUpdate() {
      self.updateFromResult(self.result?.mainValue ?? []);
    },
    requiredModal() {
      InfoModal.warning(
        self.requiredmessage || `Input for the "${self.name}" is required.`
      );
    },
    deserializeResults(json) {
      console.log("deserializing Results");
      console.log(json);
    },
    afterResultCreated(area) {},
    updateResult() {
      if (self.result) {
        console.log("self", self);
        console.log("selfResult", self.result);
        self.result.setValue(self.serializableValue);
      } else {
        self.annotation.createResult(
          {},
          { value: self.serializableValue },
          self,
          self.toname
        );
      }
    },
    onChange() {
      self.updateResult();
    }
  }));

const AddressManagerModel = types.compose(
  "AddressManagerModel",
  ControlBase,
  ClassificationBase,
  TagAttrs,
  AnnotationMixin,
  Model
);

const HtxAddressManager = observer(({ item }) => {
  console.log(item);
  return (
    <Block name="address-manager">
      <Elem name="controls">
        <Elem name="button" onClick={() => item.addBlock()}>
          Add Block
        </Elem>
        <Elem name="button" onClick={() => item.removeLastBlock()}>
          Remove Last Block
        </Elem>
      </Elem>
      <Elem name="blocks">
        {item.blocks.map((block, index) => (
          <Elem key={index} name="block">
            <Input
              placeholder="Street or Intersection"
              name={`street_${index + 1}`}
              value={block.street}
              onChange={e => item.updateBlock(index, "street", e.target.value)}
            />
            <Input
              placeholder="Unit"
              name={`unit_${index + 1}`}
              value={block.unit}
              onChange={e => item.updateBlock(index, "unit", e.target.value)}
            />
            <Input
              placeholder="City"
              name={`city_${index + 1}`}
              value={block.city}
              onChange={e => item.updateBlock(index, "city", e.target.value)}
            />
            <Input
              placeholder="Place Name"
              name={`place_name_${index + 1}`}
              value={block.placeName}
              onChange={e =>
                item.updateBlock(index, "placeName", e.target.value)
              }
            />
            <Input
              placeholder="State"
              name={`state_${index + 1}`}
              value={block.state}
              onChange={e => item.updateBlock(index, "state", e.target.value)}
            />
            <Input
              placeholder="Zip"
              name={`zip_${index + 1}`}
              value={block.zip}
              onChange={e => item.updateBlock(index, "zip", e.target.value)}
            />
            <Input
              placeholder="County"
              name={`county_${index + 1}`}
              value={block.county}
              onChange={e => item.updateBlock(index, "county", e.target.value)}
            />
            <Input
              placeholder="Country"
              name={`country_${index + 1}`}
              value={block.country}
              onChange={e => item.updateBlock(index, "country", e.target.value)}
            />
          </Elem>
        ))}
      </Elem>
    </Block>
  );
});

Registry.addTag("addressmanager", AddressManagerModel, HtxAddressManager);

export { HtxAddressManager, AddressManagerModel };
