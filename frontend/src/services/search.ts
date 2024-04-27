import { API_HOST } from '../config';
import { type IApiSearchUsersResponse } from '../types';

export const searchUsers = async (
  search: string
): Promise<[Error | null, IApiSearchUsersResponse?]> => {
  try {
    const res = await fetch(`${API_HOST}/api/users?q=${search}`);

    if (!res.ok) return [new Error(`Error searching users: ${res.statusText}`)];
    const json = (await res.json()) as IApiSearchUsersResponse;
    return [null, json];
  } catch (error) {
    if (error instanceof Error) return [error];
  }

  return [new Error('Unknown error')];
};
