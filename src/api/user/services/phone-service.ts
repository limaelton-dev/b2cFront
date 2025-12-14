import { get, post, patch, del } from "../../http";
import { Phone, CreatePhoneRequest, UpdatePhoneRequest } from "../types";

const BASE_PATH = "/phone";

export async function getPhones(): Promise<Phone[]> {
  return get<Phone[]>(BASE_PATH);
}

export async function getDefaultPhone(): Promise<Phone | null> {
  try {
    return await get<Phone>(`${BASE_PATH}/default`);
  } catch {
    return null;
  }
}

export async function getPhoneById(phoneId: number): Promise<Phone> {
  return get<Phone>(`${BASE_PATH}/${phoneId}`);
}

export async function createPhone(data: CreatePhoneRequest): Promise<Phone> {
  return post<Phone>(BASE_PATH, data);
}

export async function updatePhone(
  phoneId: number,
  data: UpdatePhoneRequest
): Promise<Phone> {
  return patch<Phone>(`${BASE_PATH}/${phoneId}`, data);
}

export async function verifyPhone(phoneId: number): Promise<Phone> {
  return patch<Phone>(`${BASE_PATH}/${phoneId}/verify`, {});
}

export async function deletePhone(phoneId: number): Promise<void> {
  return del<void>(`${BASE_PATH}/${phoneId}`);
}

export async function setDefaultPhone(phoneId: number): Promise<Phone> {
  return updatePhone(phoneId, { isDefault: true });
}
