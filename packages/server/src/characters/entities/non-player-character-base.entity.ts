import { NonPlayerCharacter } from '@prisma/client';

import { MediaEntity } from '../../media/entities/media.entity';
import { UserEntity } from '../../users/entities/user.entity';

export class NonPlayerCharacterBaseEntity implements NonPlayerCharacter {
  id: string;
  name: string;
  size: string;
  alignment: string;
  // DateTime
  createdAt: Date;
  updatedAt: Date;
  // Media
  media: MediaEntity;
  mediaId: string | null;
  // Created by
  createdById: string;
  // Controlled by
  controlledBy: UserEntity[];
  // Campaign
  campaignId: string;
}
