import React, { useState } from "react";
import { Checkbox, Userpic } from "../../../components";
import { CopyableTooltip } from "../../../components/CopyableTooltip/CopyableTooltip";
import { Block, cn, Elem } from "../../../utils/bem";
import { useCurrentUser } from "apps/labelstudio/src/providers/CurrentUser";
import { ROLES } from "apps/labelstudio/src/utils/roles";

const AccessRow = ({ user, initialValue, onUserSelected }) => {
  const [checked, setChecked] = useState(initialValue ?? false);
  const { user: currUser } = useCurrentUser();

  return (
    <Elem name="user">
      <Elem name="field" mix="avatar">
        <CopyableTooltip title={`User ID: ${user.id}`} textForCopy={user.id}>
          <Userpic user={user} style={{ width: 28, height: 28 }} />
        </CopyableTooltip>
      </Elem>
      <Elem name="field" mix="email">
        {user.email}
      </Elem>
      <Elem name="field" mix="access">
        {currUser.user_role >= ROLES.LABELING_INFRA ? (
          <Checkbox
            checked={checked}
            onChange={e => {
              const isChecked = e.target.checked;
              onUserSelected({ user_id: user.id, enabled: isChecked });
              setChecked(isChecked);
            }}
          />
        ) : null}
      </Elem>
    </Elem>
  );
};

export default AccessRow;
