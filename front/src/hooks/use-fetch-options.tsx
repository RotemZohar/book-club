import { CachePolicies, IncomingOptions } from "use-http";
import { acquireToken } from "../auth/auth-utils";

const useFetchOptions = () => {
  const fetchOptions: IncomingOptions = {
    cachePolicy: CachePolicies.NO_CACHE,
    interceptors: {
      // This will run before any request is made
      // We use it to inject authorization header
      request: async ({ options }) => {
        options.headers = options.headers || {};
        const token = await acquireToken();

        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          };
        }

        return options;
      },
    },
  };

  return fetchOptions;
};

export default useFetchOptions;
