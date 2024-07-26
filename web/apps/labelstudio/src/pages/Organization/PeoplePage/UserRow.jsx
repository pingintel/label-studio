import { useState } from "react";
import { formatDistance } from "date-fns";
import { CopyableTooltip } from "../../../components/CopyableTooltip/CopyableTooltip";
import { Elem } from "../../../utils/bem";
import { Select } from "../../../components/Form";
import { Userpic } from "../../../components";
import { getRoleName, ROLES } from "apps/labelstudio/src/utils/roles";
import { useAPI } from "apps/labelstudio/src/providers/ApiProvider";
import { useCurrentUser } from "apps/labelstudio/src/providers/CurrentUser";

const UserRow = ({ user, active, isOwner, onSelectUser }) => {
  const [role, setRole] = useState(user.user_role);
  const [changing, setChanging] = useState(false);
  const { user: currUser } = useCurrentUser();

  const api = useAPI();

  const handleRoleChange = async event => {
    event.preventDefault();
    setChanging(true);

    const newRoleValue = +event.target.value;

    const response = await api.callApi("updatePermission", {
      params: {
        pk: 1,
        user_pk: user.id
      },
      body: {
        role: newRoleValue
      }
    });

    setChanging(false);
  };

  const roleChangeDisabled = changing || currUser.id === user.id || isOwner;

  return (
    <Elem name="user" mod={{ active }} onClick={() => onSelectUser(user)}>
      <Elem name="field" mix="avatar">
        <CopyableTooltip title={`User ID: ${user.id}`} textForCopy={user.id}>
          <Userpic user={user} style={{ width: 28, height: 28 }} />
        </CopyableTooltip>
      </Elem>
      <Elem name="field" mix="email">
        {user.email}
      </Elem>
      <Elem name="field" mix="name">
        {user.first_name} {user.last_name}
      </Elem>
      <Elem name="field" mix="last-activity">
        {formatDistance(new Date(user.last_activity), new Date(), {
          addSuffix: true
        })}
      </Elem>
      {currUser.user_role >= ROLES.LABELING_INFRA && (
        <Elem name="field" mix="role">
          <Select
            placeholder="Select a role"
            value={role}
            disabled={roleChangeDisabled}
            onChange={handleRoleChange}
            options={Array.from(Object.values(ROLES)).map(role => {
              return {
                label: getRoleName(role),
                value: role
              };
            })}
          />
        </Elem>
      )}
    </Elem>
  );
};

export default UserRow;
