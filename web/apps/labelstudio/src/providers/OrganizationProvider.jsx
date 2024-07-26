import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { useAPI } from "./ApiProvider";

const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {
  const api = useAPI();
  const [owner, setOwner] = useState();

  const fetch = useCallback(() => {
    api
      .callApi("detail", {
        params: { pk: 1 }
      })
      .then(organization_detail => {
        setOwner(organization_detail.created_by);
      });
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <OrganizationContext.Provider value={{ owner, fetch }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => useContext(OrganizationContext) ?? {};
