import { get, post, patch } from "../../http";
import {
  ProfileDetails,
  ProfilePF,
  ProfilePJ,
  UserWithProfile,
} from "../types";

const BASE_PATH = "/user/profile";

export async function getProfile(): Promise<UserWithProfile> {
  return get<UserWithProfile>(BASE_PATH);
}

export async function getProfileDetails(): Promise<ProfileDetails> {
  return get<ProfileDetails>(`${BASE_PATH}/details`);
}

export async function getProfileById(profileId: number): Promise<UserWithProfile> {
  return get<UserWithProfile>(`${BASE_PATH}/${profileId}`);
}

export async function getProfilePF(profileId: number): Promise<ProfilePF> {
  return get<ProfilePF>(`${BASE_PATH}/${profileId}/pf`);
}

export async function getProfilePJ(profileId: number): Promise<ProfilePJ> {
  return get<ProfilePJ>(`${BASE_PATH}/${profileId}/pj`);
}

export async function createProfilePF(data: Omit<ProfilePF, "id">): Promise<ProfilePF> {
  return post<ProfilePF>(`${BASE_PATH}/pf`, data);
}

export async function createProfilePJ(data: Omit<ProfilePJ, "id">): Promise<ProfilePJ> {
  return post<ProfilePJ>(`${BASE_PATH}/pj`, data);
}

export async function updateProfilePF(
  profileId: number,
  data: Partial<Omit<ProfilePF, "id">>
): Promise<ProfilePF> {
  return patch<ProfilePF>(`${BASE_PATH}/${profileId}/pf`, data);
}

export async function updateProfilePJ(
  profileId: number,
  data: Partial<Omit<ProfilePJ, "id">>
): Promise<ProfilePJ> {
  return patch<ProfilePJ>(`${BASE_PATH}/${profileId}/pj`, data);
}
