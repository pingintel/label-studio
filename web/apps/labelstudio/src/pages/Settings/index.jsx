import React, { useMemo } from "react";
import { SidebarMenu } from "../../components/SidebarMenu/SidebarMenu";
import { WebhookPage } from "../WebhookPage/WebhookPage";
import { DangerZone } from "./DangerZone";
import { GeneralSettings } from "./GeneralSettings";
import { AnnotationSettings } from "./AnnotationSettings";
import { LabelingSettings } from "./LabelingSettings";
import { MachineLearningSettings } from "./MachineLearningSettings/MachineLearningSettings";
import { PredictionsSettings } from "./PredictionsSettings/PredictionsSettings";
import { StorageSettings } from "./StorageSettings/StorageSettings";
import {
  isInLicense,
  LF_CLOUD_STORAGE_FOR_MANAGERS
} from "../../utils/license-flags";
import { AccessSettings } from "./AccessSettings/AccessSettings";
import { useCurrentUser } from "../../providers/CurrentUser";
import { Spinner } from "../../components/Spinner/Spinner";
import { ROLES } from "../../utils/roles";

const isAllowCloudStorage = !isInLicense(LF_CLOUD_STORAGE_FOR_MANAGERS);

export const MenuLayout = ({ children, ...routeProps }) => {
  const { user } = useCurrentUser();

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
        <Spinner size={32} />
      </div>
    );
  }
  
  return (
    <SidebarMenu
      menuItems={[
        GeneralSettings,
        LabelingSettings,
        AnnotationSettings,
        MachineLearningSettings,
        PredictionsSettings,
        isAllowCloudStorage && StorageSettings,
        WebhookPage,
        user.user_role >= ROLES.LABELING_INFRA && AccessSettings,
        user.user_role >= ROLES.LABELING_INFRA && DangerZone
      ].filter(Boolean)}
      path={routeProps.match.url}
      children={children}
    />
  );
};

const pages = {
  AnnotationSettings,
  LabelingSettings,
  MachineLearningSettings,
  PredictionsSettings,
  WebhookPage,
  AccessSettings,
  DangerZone
};

isAllowCloudStorage && (pages.StorageSettings = StorageSettings);

export const SettingsPage = {
  title: "Settings",
  path: "/settings",
  exact: true,
  layout: MenuLayout,
  component: GeneralSettings,
  pages
};
