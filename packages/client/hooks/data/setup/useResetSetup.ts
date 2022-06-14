import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../../lib/api';
import { SetupInterface } from '../../../lib/types';

/**
 * Send a request to reset the setup
 * @returns The reseted setup
 */
async function resetSetup() {
  const { data } = await api.post<SetupInterface>(`/api/setup/reset`);
  return data;
}

/**
 * Reset the setup process
 * @returns Setup reset mutation
 */
export function useResetSetup() {
  const queryClient = useQueryClient();

  return useMutation(resetSetup, {
    onSuccess: () => {
      queryClient.invalidateQueries(`setup`);
      queryClient.invalidateQueries(`campaigns`);
      queryClient.invalidateQueries(`users`);
      queryClient.invalidateQueries(`maps`);
    },
  });
}