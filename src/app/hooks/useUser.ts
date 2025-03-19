import { useEffect, useState } from "react";
import { fetchUser, fetchWithDetails } from "../services/user";
import { User } from "../types/user";
import { getToken } from "../utils/auth";

interface UseUserOptions {
  includeDetails?: boolean;
}

export const useUser = ({ includeDetails = false }: UseUserOptions = {}) => {
  const token = getToken();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    setLoading(true);

    const fetchData = includeDetails ? fetchWithDetails : fetchUser;

    fetchData()
      .then((data) => {
        setUser(data);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [token, includeDetails]);

  return { user, loading, error };
};