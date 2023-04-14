// utils/supabase.js

import { createClient } from '@supabase/supabase-js';
import { useAuth0 } from '@auth0/auth0-react';

const GetSupabase = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const domain = process.env.AUTH0_DOMAIN;
  const options = {};
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options
  );
  getAccessTokenSilently({
    redirect_uri: process.env.URL,
    audience: `https://${domain}/api/v2/`,
    scope: 'openid profile email read:current_user update:current_user_metadata',
  }).then((access_token) => {
    console.log(access_token);
    if (access_token) {
      options.global = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };
    }
    console.log(options)
  });

  return supabase;
};

export default GetSupabase;
