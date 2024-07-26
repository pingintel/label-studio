import "./AccessSettings.styl";
import React, { useCallback, useEffect, useState } from "react";
import { Block, cn, Elem } from "../../../utils/bem";
import { useAPI } from "../../../providers/ApiProvider";
import { useParams } from "react-router";
import {
  Pagination,
  usePage,
  usePageSize
} from "../../../components/Pagination/Pagination";
import { debounce } from "../../../utils/debounce";
import { Button, Spinner } from "../../../components";
import AccessRow from "./AccessRow";
import { useOrganization } from "apps/labelstudio/src/providers/OrganizationProvider";

const SEARCH_DEBOUNCE_DELAY = 500;

export const AccessSettings = () => {
  // Hooks
  const api = useAPI();
  const params = useParams();
  const { owner } = useOrganization();

  // Pagination
  const [currentPage] = usePage("page", 1);
  const [currentPageSize] = usePageSize("page_size", 50);
  const [totalItems, setTotalItems] = useState(0);

  const [usersList, setUsersList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async (page, pageSize, search) => {
    const response = await api.callApi("projectMemberships", {
      params: {
        pk: params.id,
        page,
        page_size: pageSize,
        search: search ?? ""
      }
    });

    if (response.results) {
      setUsersList(response.results);
      setTotalItems(response.count);
    }
  }, []);

  const debouncedFetchUsers = useCallback(
    debounce(search => fetchUsers(1, 10, search), SEARCH_DEBOUNCE_DELAY),
    [fetchUsers]
  );

  const handleSearchChange = useCallback(
    e => {
      debouncedFetchUsers(e.target.value);
    },
    [debouncedFetchUsers]
  );

  const handleSearchInputChange = e => {
    setSearch(e.target.value);
    handleSearchChange(e);
  };

  useEffect(() => {
    fetchUsers(currentPage, currentPageSize, search);
  }, []);

  const handleSaveAccess = () => {
    console.log(selectedUsers);
  };

  const handleUserSelected = userData => {
    setSelectedUsers(prev => {
      const existsInSelected = prev.find(u => u.user_id === userData.user_id);

      if (existsInSelected) {
        return prev.filter(u => u.user_id !== userData.user_id);
      } else {
        return [...prev, userData];
      }
    });
  };

  return (
    <Block name="annotation-settings">
      <Elem name={"wrapper"}>
        <h1>Access Settings</h1>
        <Block name="settings-wrapper">
          <div className={cn("div-wrapper")}>
            <div className={cn("search-bar-wrapper")}>
              <input
                type="text"
                value={search}
                onChange={handleSearchInputChange}
                className={cn("input")}
                placeholder="Search users"
              />
              <Button onClick={handleSaveAccess}>Save Permissions</Button>
            </div>
            <Block name="access-list">
              <Elem name="wrapper">
                {usersList ? (
                  <Elem name="users">
                    <Elem name="header">
                      <Elem name="column" mix="avatar" />
                      <Elem name="column" mix="email">
                        Email
                      </Elem>
                      <Elem name="column" mix="access">
                        Add
                      </Elem>
                    </Elem>
                    <Elem name="body">
                      {usersList
                        .sort((a, b) => {
                          if (a.user.id === owner) return -1;
                          if (b.user.id === owner) return 1;

                          if (a.enabled && !b.enabled) return -1;
                          if (!a.enabled && b.enabled) return 1;

                          return 0;
                        })
                        .map(({ user, enabled }) => {
                          return (
                            <AccessRow
                              user={user}
                              initialValue={enabled}
                              isOwner={owner === user.id}
                              onUserSelected={handleUserSelected}
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
          </div>
        </Block>
      </Elem>
    </Block>
  );
};
AccessSettings.title = "Access Settings";
AccessSettings.path = "/access-settings";
