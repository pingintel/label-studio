import React from "react";
import { useSDK } from "../../providers/SDKProvider";
import { Button } from "./Button/Button";
import { useCurrentUser } from "../../providers/CurrentUser";
import { ROLES } from "../../utils/roles";

const SDKButton = ({ eventName, ...props }) => {
  const sdk = useSDK();
  const { user } = useCurrentUser();

  return sdk.hasHandler(eventName) && user.user_role >= ROLES.LABELING_INFRA ? (
    <Button
      {...props}
      onClick={() => {
        sdk.invoke(eventName);
      }}
    />
  ) : null;
};

export const SettingsButton = ({ ...props }) => {
  return <SDKButton {...props} eventName="settingsClicked" />;
};

export const ImportButton = ({ ...props }) => {
  return <SDKButton {...props} eventName="importClicked" />;
};

export const ExportButton = ({ ...props }) => {
  return <SDKButton {...props} eventName="exportClicked" />;
};
