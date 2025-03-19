import { useEffect, useState, useCallback } from "react";
import { Card } from "../types/card";
import { fetchUserCards, createUserCard, updateUserCard, deleteUserCard } from "../services/user";

export const useUserCards = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCards = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchUserCards();
            setCards(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createCard = useCallback(async (cardData: Partial<Card>) => {
        setLoading(true);
        try {
            const newCard = await createUserCard(cardData);
            setCards(prev => [...prev, newCard]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCard = useCallback(async (cardId: number, cardData: Partial<Card>) => {
        setLoading(true);
        try {
            const updated = await updateUserCard(cardId, cardData);
            setCards(prev => prev.map(card => (card.id === cardId ? updated : card)));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCard = useCallback(async (cardId: number) => {
        setLoading(true);
        try {
            await deleteUserCard(cardId);
            setCards(prev => prev.filter(card => card.id !== cardId));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    return { cards, loading, error, fetchCards, createCard, updateCard, deleteCard };
};
