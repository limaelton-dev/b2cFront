import { get, post, patch, del } from "../../http";
import { Card, CreateCardRequest, UpdateCardRequest } from "../types";

const BASE_PATH = "/user/profile/card";

export async function getCards(): Promise<Card[]> {
  return get<Card[]>(BASE_PATH);
}

export async function getDefaultCard(): Promise<Card | null> {
  try {
    return await get<Card>(`${BASE_PATH}/default`);
  } catch {
    return null;
  }
}

export async function getCardById(cardId: number): Promise<Card> {
  return get<Card>(`${BASE_PATH}/${cardId}`);
}

export async function createCard(data: CreateCardRequest): Promise<Card> {
  return post<Card>(BASE_PATH, data);
}

export async function updateCard(
  cardId: number,
  data: UpdateCardRequest
): Promise<Card> {
  return patch<Card>(`${BASE_PATH}/${cardId}`, data);
}

export async function deleteCard(cardId: number): Promise<void> {
  return del<void>(`${BASE_PATH}/${cardId}`);
}

export async function setDefaultCard(cardId: number): Promise<Card> {
  return updateCard(cardId, { isDefault: true });
}
