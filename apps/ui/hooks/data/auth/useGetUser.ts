import { useQuery } from '@tanstack/react-query';
import { RawAxiosRequestConfig } from 'axios';

import { api } from '../../../lib/api';
import { UserEntity } from '../../../lib/types';

/**
 * Send a request to get the user
 * @returns The user data
 */
export async function getUser(requestConfig?: RawAxiosRequestConfig) {
  const { data } = await api.get<UserEntity>(`/api/auth`, requestConfig);
  return data;
}

/**
 * Get the user
 * @returns User query
 */
export function useGetUser() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: getUser,
  });
}