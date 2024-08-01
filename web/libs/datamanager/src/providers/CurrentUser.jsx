import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ sdk, children }) => {
  const [user, setUser] = useState();

  const fetch = useCallback(() => {
    console.log(window)
    window.dataManager.api.me().then(user => {
      setUser(user);
      console.log(user)
    });
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <CurrentUserContext.Provider value={{ user, fetch }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(CurrentUserContext) ?? {};
