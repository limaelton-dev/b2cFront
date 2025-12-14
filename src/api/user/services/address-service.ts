import { get, post, put, del } from "../../http";
import { Address, CreateAddressRequest, UpdateAddressRequest } from "../types";

const BASE_PATH = "/address";

export async function getAddresses(): Promise<Address[]> {
  return get<Address[]>(BASE_PATH);
}

export async function getDefaultAddress(): Promise<Address | null> {
  try {
    return await get<Address>(`${BASE_PATH}/default`);
  } catch {
    return null;
  }
}

export async function getAddressById(addressId: number): Promise<Address> {
  return get<Address>(`${BASE_PATH}/${addressId}`);
}

export async function createAddress(data: CreateAddressRequest): Promise<Address> {
  return post<Address>(BASE_PATH, data);
}

export async function updateAddress(
  addressId: number,
  data: UpdateAddressRequest
): Promise<Address> {
  return put<Address>(`${BASE_PATH}/${addressId}`, data);
}

export async function deleteAddress(addressId: number): Promise<void> {
  return del<void>(`${BASE_PATH}/${addressId}`);
}

export async function setDefaultAddress(addressId: number): Promise<Address> {
  return updateAddress(addressId, { isDefault: true });
}
