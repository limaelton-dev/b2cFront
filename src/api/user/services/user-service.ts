import { get, patch } from "../../http";
import { User, UpdateUserRequest, AvailabilityResponse } from "../types";

const BASE_PATH = "/user";
const USERS_PATH = "/users";

export async function getUser(): Promise<User> {
  return get<User>(BASE_PATH);
}

export async function updateUser(
  userId: number,
  data: UpdateUserRequest
): Promise<User> {
  return patch<User>(`${BASE_PATH}/${userId}`, data);
}

export async function checkEmailAvailability(
  email: string
): Promise<AvailabilityResponse> {
  return get<AvailabilityResponse>(
    `${USERS_PATH}/availability/email?value=${encodeURIComponent(email)}`
  );
}

export async function checkCpfAvailability(
  cpf: string
): Promise<AvailabilityResponse> {
  const cleanCpf = cpf.replace(/\D/g, "");
  return get<AvailabilityResponse>(
    `${USERS_PATH}/availability/cpf?value=${cleanCpf}`
  );
}
