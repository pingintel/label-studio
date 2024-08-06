import React from "react";
import { Table } from "antd";
import { inject, observer } from "mobx-react";
import { flow, getEnv, types } from "mobx-state-tree";
import Papa from "papaparse";
import { Block, Elem } from "../../utils/bem";
import { errorBuilder } from "../../core/DataValidator/ConfigValidator";
import Registry from "../../core/Registry";
import { AnnotationMixin } from "../../mixins/AnnotationMixin";
import ProcessAttrsMixin from "../../mixins/ProcessAttrs";
import Base from "./Base";
import { parseTypeAndOption, parseValue } from "../../utils/data";
import { InstructionsModal } from "../../components/InstructionsModal/InstructionsModal";
import { AddressExamples } from "libs/editor/src/components/AddressExamples/AddressExamples";
import FAQButton from "/libs/editor/src/components/AddressExamples/FAQButton";

/**
 * The `AddressTasble` tag is used to display object keys and values in a table. Customized version of the Table tag for displaying address information.
 * @example
 * <!-- Basic labeling configuration for text in a table -->
 * <View>
 *   <Address name="text-1" value="$text"></Address>
 * </View>
 * @name AddressTable
 * @meta_title Address Tag to Display Keys & Values in Tables and Copy Address
 * @meta_description Customize Label Studio by displaying key-value pairs in tasks for machine learning and data science projects.
 * @param {string} value Data field value containing JSON type for Table
 * @param {string} [valueType] Value to define the data type in Table
 */
const Model = types
  .model({
    type: "addresstable",
    value: types.maybeNull(types.string),
    _value: types.frozen([]),
    valuetype: types.optional(types.string, "json")
  })
  .views(self => ({
    get dataSource() {
      const { type } = parseTypeAndOption(self.valuetype);

      if (type === "json") {
        return Object.keys(self._value)
          .sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
          })
          .map(k => {
            let val = self._value[k];

            if (typeof val === "object") val = JSON.stringify(val);
            return { type: k, value: val };
          });
      }
      return self._value;
    },
    get columns() {
      if (self.valuetype === "json" || !self._value[0]) {
        return [
          { title: "Name", dataIndex: "type" },
          { title: "Value", dataIndex: "value" }
        ];
      }

      return Object.keys(self._value[0]).map(value => ({
        title: value,
        dataIndex: value
      }));
    }
  }))
  .actions(self => ({
    updateValue: flow(function*(store) {
      const { type, options } = parseTypeAndOption(self.valuetype);
      let originData = parseValue(self.value, store.task.dataObj);

      if (options.url) {
        try {
          const response = yield fetch(originData);
          const { ok, status, statusText } = response;

          if (!ok) throw new Error(`${status} ${statusText}`);

          originData = yield response.text();
        } catch (error) {
          const message = getEnv(self).messages.ERR_LOADING_HTTP({
            attr: self.value,
            error: String(error),
            url: originData
          });

          self.annotationStore.addErrors([errorBuilder.generalError(message)]);
        }
      }

      switch (type) {
        case "csv":
          {
            Papa.parse(originData, {
              delimiter: options.separator,
              header: !options.headless,
              download: false,
              complete: ({ data }) => {
                self._value = data;
              }
            });
          }
          break;
        default:
          self._value =
            typeof originData === "string"
              ? JSON.parse(originData)
              : originData;
          break;
      }
    })
  }));

const AddressTableModel = types.compose(
  "AddressTableModel",
  Base,
  ProcessAttrsMixin,
  AnnotationMixin,
  Model
);

const HtxAddressTable = inject("store")(
  observer(({ item }) => {
    const [modal, setModal] = React.useState(false);
    console.log("dataSource", item);

    const handleCellClick = text => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          message.success(`Copied: ${text}`);
        })
        .catch(err => {
          message.error("Failed to copy!");
          console.error("Could not copy text: ", err);
        });
    };

    const columns = item.columns.map(col => ({
      ...col,
      render: text => {
        const isTitle = col.title === "Name";
        const pointerStyle = isTitle ? "default" : "pointer";
        const fontWeight = isTitle ? "normal" : "bold";

        return (
          <span
            onClick={() => {
              if (!isTitle) {
                handleCellClick(text);
              }
            }}
            style={{
              cursor: pointerStyle,
              textDecoration: "none",
              fontWeight: fontWeight,
              textTransform: "uppercase"
            }}
            onMouseEnter={e => {
              if (!isTitle) {
                e.target.style.textDecoration = "underline";
                e.target.style.color = "var(--grape_500)";
              }
            }}
            onMouseLeave={e => {
              if (!isTitle) {
                e.target.style.textDecoration = "none";
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "black";
              }
            }}
          >
            {text}
          </span>
        );
      }
    }));

    return (
      <>
        <Elem name="button" onClick={() => setModal(true)}>
          <FAQButton />
        </Elem>
        {modal && (
          <InstructionsModal
            title="FAQ"
            visible={modal}
            onCancel={() => setModal(false)}
          >
            <AddressExamples />
          </InstructionsModal>
        )}
        <Table
          bordered
          dataSource={item.dataSource}
          columns={columns}
          pagination={{ hideOnSinglePage: true }}
        />
      </>
    );
  })
);

Registry.addTag("addresstable", AddressTableModel, HtxAddressTable);
Registry.addObjectType(AddressTableModel);

export { HtxAddressTable, AddressTableModel };
