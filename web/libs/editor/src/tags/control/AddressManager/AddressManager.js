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
import RequiredMixin from "libs/editor/src/mixins/Required";
import PerRegionMixin from "libs/editor/src/mixins/PerRegion";
import { ReadOnlyControlMixin } from "libs/editor/src/mixins/ReadOnlyMixin";
import TextArea from "antd/lib/input/TextArea";
import { AddressInput } from "libs/editor/src/components/AddressInput/AddressInput";

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
      if (!self.blocks.length) return [];
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
    removeBlock(index) {
      if (self.blocks.length > 0) {
        const block = self.blocks[index];
        self.blocks.splice(index, 1);
        destroy(block);
        self.onChange();
      }
    },
    duplicateBlock(index) {
      const block = self.blocks[index];
      const new_block = AddressBlock.create({
        street: block.street,
        unit: block.unit,
        city: block.city,
        placeName: block.placeName,
        state: block.state,
        zip: block.zip,
        county: block.county,
        country: block.country
      });

      self.blocks.splice(index + 1, 0, new_block);
      self.onChange();
    },
    moveUp(index) {
      if (index > 0) {
        const block = self.blocks[index];
        const newBlocks = self.blocks.slice();
        newBlocks.splice(index, 1);
        newBlocks.splice(index - 1, 0, block);
        self.blocks.replace(newBlocks);
        self.onChange();
      }
    },
    moveDown(index) {
      if (index < self.blocks.length - 1) {
        const block = self.blocks[index];
        const newBlocks = self.blocks.slice();
        newBlocks.splice(index, 1);
        newBlocks.splice(index + 1, 0, block);
        self.blocks.replace(newBlocks);
        self.onChange();
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
      const newBlocks = value.map(blockData => {
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

      self.blocks.replace(newBlocks);
    },
    needsUpdate() {
      self.updateFromResult(self.result?.mainValue ?? []);
    },
    beforeSend() {
      // remove empty blocks
      self.blocks = self.blocks.filter(block =>
        Object.values(block).some(value => value)
      );
      self.updateResult();
    },
    updateResult() {
      if (self.result) {
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
  return (
    <Block name="address-manager">
      <Elem name="controls">
        <Elem name="button" onClick={() => item.addBlock()}>
          Add additional address
        </Elem>
      </Elem>
      <Elem name="blocks">
        {item.blocks.map((block, index) => (
          <Elem key={index} name="block">
            <Elem name="move-buttons-container">
              <Elem name="move-button" onClick={() => item.moveUp(index)}>
                UP
              </Elem>
              <Elem name="move-button" onClick={() => item.moveDown(index)}>
                DOWN
              </Elem>
            </Elem>
            <AddressInput
              item={item}
              index={index}
              block={block}
              isReadonly={false}
            />
            <Elem name="control-buttons-container">
              <Elem
                name="control-button"
                onClick={() => item.removeBlock(index)}
              >
                DELETE
              </Elem>
              <Elem
                name="control-button"
                onClick={() => item.duplicateBlock(index)}
              >
                DUPLICATE
              </Elem>
            </Elem>
          </Elem>
        ))}
      </Elem>
    </Block>
  );
});

Registry.addTag("addressmanager", AddressManagerModel, HtxAddressManager);

export { HtxAddressManager, AddressManagerModel };
