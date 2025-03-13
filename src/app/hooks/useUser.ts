import { useEffect, useState } from "react";
import { fetchUser, fetchWithDetails, fetchUserCards, fetchUserAddresses, fetchUserPhones } from "../services/user";
import { User } from "../types/user";
import { getToken } from "../utils/auth";

interface UseUserOptions {
  includeDetails?: boolean;
}

export const useUser = ({ includeDetails = false }: UseUserOptions = {}) => {
  const token = getToken();

  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<User['card']>([]);
  const [addresses, setAddresses] = useState<User['address']>([]);
  const [phones, setPhones] = useState<User['phone']>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    setLoading(true);

    // Se includeDetails for true, usamos fetchWithDetails, senão fetchUser.
    const fetchData = includeDetails ? fetchWithDetails : fetchUser;

    fetchData()
      .then((data) => {
        setUser(data);
        // Buscando os dados que podem não estar inclusos na resposta principal
        return Promise.all([
          fetchUserCards(),
          fetchUserAddresses(),
          fetchUserPhones()
        ]);
      })
      .then(([cardsData, addressesData, phonesData]) => {
        setCards(cardsData);
        setAddresses(addressesData);
        setPhones(phonesData);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [token, includeDetails]);

  // Mescla os dados no objeto user, sobrescrevendo os campos card, address e phone
  const mergedUser = user ? { ...user, card: cards, address: addresses, phone: phones } : null;

  return { user: mergedUser, loading, error };
};
