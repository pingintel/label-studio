import { formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Pagination, Spinner } from "../../../components";
import {
  usePage,
  usePageSize
} from "../../../components/Pagination/Pagination";
import { Select } from "../../../components/Form";
import { useAPI } from "../../../providers/ApiProvider";
import { Block, Elem } from "../../../utils/bem";
import { isDefined } from "../../../utils/helpers";
import { useUpdateEffect } from "../../../utils/hooks";

import "./PeopleList.styl";
import UserRow from "./UserRow";
import { useCurrentUser } from "apps/labelstudio/src/providers/CurrentUser";
import { ROLES } from "apps/labelstudio/src/utils/roles";

export const PeopleList = ({ onSelect, selectedUser, defaultSelected }) => {
  const api = useAPI();
  const { user: currUser } = useCurrentUser();
  const [usersList, setUsersList] = useState();
  const [currentPage] = usePage("page", 1);
  const [currentPageSize] = usePageSize("page_size", 30);
  const [totalItems, setTotalItems] = useState(0);

  console.log({ currentPage, currentPageSize });

  const fetchUsers = useCallback(async (page, pageSize) => {
    const response = await api.callApi("memberships", {
      params: {
        pk: 1,
        contributed_to_projects: 1,
        page,
        page_size: pageSize
      }
    });

    if (response.results) {
      setUsersList(response.results);
      setTotalItems(response.count);
    }
  }, []);

  const selectUser = useCallback(
    user => {
      if (selectedUser?.id === user.id) {
        onSelect?.(null);
      } else {
        onSelect?.(user);
      }
    },
    [selectedUser]
  );

  useEffect(() => {
    fetchUsers(currentPage, currentPageSize);
  }, []);

  useEffect(() => {
    if (isDefined(defaultSelected) && usersList) {
      const selected = usersList.find(
        ({ user }) => user.id === Number(defaultSelected)
      );

      if (selected) selectUser(selected.user);
    }
  }, [usersList, defaultSelected]);

  return (
    <>
      <Block name="people-list">
        <Elem name="wrapper">
          {usersList ? (
            <Elem name="users">
              <Elem name="header">
                <Elem name="column" mix="avatar" />
                <Elem name="column" mix="email">
                  Email
                </Elem>
                <Elem name="column" mix="name">
                  Name
                </Elem>
                <Elem name="column" mix="last-activity">
                  Last Activity
                </Elem>
                {currUser && currUser.user_role >= ROLES.LABELING_INFRA && (
                  <Elem name="column" mix="role">
                    Role
                  </Elem>
                )}
              </Elem>
              <Elem name="body">
                {usersList.map(({ user }) => {
                  const active = user.id === selectedUser?.id;
                  return (
                    <UserRow
                      key={`user-${user.id}`}
                      user={user}
                      active={active}
                      onSelectUser={user => selectUser(user)}
                    />
                  );
                })}
              </Elem>
            </Elem>
          ) : (
            <Elem name="loading">
              <Spinner size={36} />
            </Elem>
          )}
        </Elem>
        <Pagination
          page={currentPage}
          urlParamName="page"
          totalItems={totalItems}
          pageSize={currentPageSize}
          pageSizeOptions={[30, 50, 100]}
          onPageLoad={fetchUsers}
          style={{ paddingTop: 16 }}
        />
      </Block>
    </>
  );
};
