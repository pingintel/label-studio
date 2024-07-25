import { useCallback, useMemo, useState } from "react";
import { HeidiTips } from "../../../components/HeidiTips/HeidiTips";
import { Space } from "../../../components/Space/Space";
import { useAPI } from "../../../providers/ApiProvider";
import { Block, Elem } from "../../../utils/bem";
import { FF_LSDV_E_297, isFF } from "../../../utils/feature-flags";
import "./PeopleInvitation.styl";
import { PeopleList } from "./PeopleList";
import "./PeoplePage.styl";
import { SelectedUser } from "./SelectedUser";
import { useCurrentUser } from "apps/labelstudio/src/providers/CurrentUser";
import AddPeopleButton from "./AddPeopleButton";
import { ROLES } from "apps/labelstudio/src/utils/roles";

export const PeoplePage = () => {
  const api = useAPI();
  
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useCurrentUser();

  const [link, setLink] = useState();

  const selectUser = useCallback(
    user => {
      setSelectedUser(user);

      localStorage.setItem("selectedUser", user?.id);
    },
    [setSelectedUser]
  );

  const defaultSelected = useMemo(() => {
    return localStorage.getItem("selectedUser");
  }, []);


  return (
    <Block name="people">
      <Elem name="controls">
        <Space spread>
          <Space />
          <Space>
            {user && user.user_role >= ROLES.LABELING_INFRA && <AddPeopleButton />}
          </Space>
        </Space>
      </Elem>
      <Elem name="content">
        <PeopleList
          selectedUser={selectedUser}
          defaultSelected={defaultSelected}
          onSelect={user => selectUser(user)}
        />

        {selectedUser ? (
          <SelectedUser user={selectedUser} onClose={() => selectUser(null)} />
        ) : (
          isFF(FF_LSDV_E_297) && <HeidiTips collection="organizationPage" />
        )}
      </Elem>
    </Block>
  );
};

PeoplePage.title = "People";
PeoplePage.path = "/";
