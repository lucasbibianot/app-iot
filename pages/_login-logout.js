import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Button, Card, Collapse } from "antd";
import Avatar from "antd/lib/avatar/avatar";

const { Panel } = Collapse;

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    !isAuthenticated && (
      <Button type="primary" onClick={() => loginWithRedirect()}>
        Log In
      </Button>
    )
  );
};

export const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      type="primary"
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      Log Out
    </Button>
  );
};

export const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "lucas-bibiano.us.auth0.com";
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        });

        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const { user_metadata } = await metadataResponse.json();
        setUserMetadata(user_metadata);
      } catch (e) {
        console.log(e.message);
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub, user]);
  return (
    isAuthenticated && (
      <Collapse key={"c3"} bordered={false}>
        <Panel
          key="1"
          extra={[<Avatar key={"av01"} src={user.picture} alt={user.name} />]}
        >
          <p>{user.name} ({user.profile})</p>
          <p>{user.email}</p>
          <LogoutButton />
        </Panel>
      </Collapse>
    )
  );
};

export default LoginButton;