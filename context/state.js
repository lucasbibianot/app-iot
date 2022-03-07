import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [user, setUser] = useState(null);
  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  return (
    <AppContext.Provider value={providerValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
