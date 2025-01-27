import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserEntity } from '@tarrasque/common';

import { api } from '../../../lib/api';

/**
 * Send a request to update the user
 * @param user - The user to update with
 * @returns The updated user
 */
async function updateUser(user: Partial<UserEntity>) {
  const { data } = await api.put<UserEntity>(`/api/auth`, user);
  return data;
}

/**
 * Update user
 * @returns User update mutation
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
