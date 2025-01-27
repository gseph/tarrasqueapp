import { Campaign } from '@prisma/client';
import { IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ActionTokenEntity } from '../../action-tokens/entities/action-token.entity';
import { CharacterEntity } from '../../characters/entities/character.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { MembershipEntity } from '../modules/memberships/entities/membership.entity';

export class CampaignEntity implements Campaign {
  @IsString()
  id: string;

  @IsString()
  name: string;

  // DateTime
  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  // Created by
  @IsOptional()
  @ValidateNested()
  createdBy?: UserEntity;

  @IsString()
  createdById: string;

  // Characters
  @IsOptional()
  @ValidateNested({ each: true })
  characters?: CharacterEntity[];

  // Memberships
  @IsOptional()
  @ValidateNested({ each: true })
  memberships?: MembershipEntity[];

  // Invites
  @IsOptional()
  @ValidateNested({ each: true })
  invites?: ActionTokenEntity[];
}
