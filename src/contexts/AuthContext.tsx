import React, { createContext, useContext, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AuthContextType, User } from "../types";

const mapAuth0UserToAppUser = (auth0User: any): User | null => {
  console.log(auth0User);

  if (!auth0User) {
    return null;
  }
  const displayName =
    auth0User.given_name ||
    auth0User.name?.split("@")[0] || // extract a username if email
    auth0User.nickname ||
    auth0User.email;
  return {
    id: auth0User.sub, // 'sub' is the standard user ID in Auth0
    email: auth0User.email,
    name: displayName,
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  // The 'login' function now just calls Auth0's redirect.
  // Registration is handled by Auth0's Universal Login page.
  const login = async (): Promise<boolean> => {
    await loginWithRedirect();
    return true; // The redirect will handle success/failure.
  };

  // The logout function now uses Auth0's logout.
  const logout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const user = useMemo(() => mapAuth0UserToAppUser(auth0User), [auth0User]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    // We no longer manage our own login/register functions
    login,
    register: login, // The register button can just trigger the same login flow
    logout,
    // Add isLoading from the Auth0 hook for better UI feedback
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
