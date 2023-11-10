import { useQuery } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { CampaignEntity } from '../../../lib/types';

/**
 * Send a request to get the user's campaigns
 * @returns The user's campaigns
 */
async function getUserCampaigns() {
  const { data } = await api.get<CampaignEntity[]>(`/api/campaigns`);
  return data;
}

/**
 * Get the user's campaigns
 * @returns Campaigns query
 */
export function useGetUserCampaigns() {
  return useQuery([`campaigns`], () => getUserCampaigns());
}
