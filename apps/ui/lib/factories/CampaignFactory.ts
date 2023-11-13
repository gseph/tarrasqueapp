import { CampaignEntity } from '@tarrasque/sdk';

export class CampaignFactory implements Partial<CampaignEntity> {
  name = '';

  /**
   * Generate new campaign
   * @param campaign - The campaign to generate
   */
  constructor(campaign?: Partial<CampaignEntity>) {
    Object.assign(this, campaign);
  }
}
