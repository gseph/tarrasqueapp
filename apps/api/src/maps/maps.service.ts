import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { MapEntity } from './entities/map.entity';
import { MapsGateway } from './maps.gateway';

@Injectable()
export class MapsService {
  private logger: Logger = new Logger(MapsService.name);

  constructor(
    private prisma: PrismaService,
    private mapsGateway: MapsGateway,
  ) {}

  /**
   * Get all maps for a campaign
   * @param campaignId - The campaign id
   * @returns The maps
   */
  async getCampaignMaps(campaignId: string): Promise<MapEntity[]> {
    this.logger.verbose(`📂 Getting maps for campaign "${campaignId}"`);
    try {
      // Get the maps
      const maps = await this.prisma.map.findMany({
        where: { campaignId },
        include: { media: true, createdBy: { include: { avatar: true } } },
        orderBy: { order: 'asc' },
      });
      this.logger.debug(`✅️ Found ${maps.length} maps for campaign "${campaignId}"`);
      return maps;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get a map that matches the given criteria
   * @param mapId - The map id
   * @returns The map
   */
  async getMapById(mapId: string): Promise<MapEntity> {
    this.logger.verbose(`📂 Getting map "${mapId}"`);
    try {
      // Get the map
      const map = await this.prisma.map.findUniqueOrThrow({
        where: { id: mapId },
        include: {
          media: true,
          createdBy: { include: { avatar: true } },
          campaign: true,
        },
      });
      this.logger.debug(`✅️ Found map "${mapId}"`);
      return map;
    } catch (error) {
      this.logger.error(`🚨 Map "${mapId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get all maps that contain the given media id
   * @param mediaId - The media id
   * @returns The maps
   */
  async getMapsWithMediaId(mediaId: string): Promise<MapEntity[]> {
    this.logger.verbose(`📂 Getting maps with media id "${mediaId}"`);
    try {
      // Get the maps
      const maps = await this.prisma.map.findMany({
        where: { media: { some: { id: mediaId } } },
        include: { media: true, createdBy: { include: { avatar: true } } },
        orderBy: { order: 'asc' },
      });
      this.logger.debug(`✅️ Found ${maps.length} maps with media id "${mediaId}"`);
      return maps;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get map count
   * @returns Map count
   */
  async getMapCount(): Promise<number> {
    this.logger.verbose(`📂 Getting map count`);
    try {
      // Get the map count
      const count = await this.prisma.map.count();
      this.logger.debug(`✅️ Found ${count} maps`);
      return count;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Create a new map
   * @param data - The map data
   * @returns The created map
   */
  async createMap(data: CreateMapDto): Promise<MapEntity> {
    this.logger.verbose(`📂 Creating map "${data.name} for campaign "${data.campaignId}"`);
    try {
      // Create the map
      const map = await this.prisma.map.create({
        data: {
          name: data.name,
          media: { connect: data.mediaIds.map((id) => ({ id })) },
          selectedMediaId: data.selectedMediaId || data.mediaIds[0],
          campaign: { connect: { id: data.campaignId } },
          createdBy: { connect: { id: data.createdById } },
        },
        include: { media: true, createdBy: { include: { avatar: true } } },
      });

      // Emit the new map to the campaign's room
      this.mapsGateway.createMap(map);

      this.logger.debug(`✅️ Created map "${data.name}"`);
      return map;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Duplicate a map based on an existing one
   * @param mapId - The map id
   * @returns The duplicated map
   */
  async duplicateMap(mapId: string): Promise<MapEntity> {
    this.logger.verbose(`📂 Duplicating map "${mapId}"`);

    // Get the map
    const map = await this.getMapById(mapId);

    // Get the map's tokens
    const tokens = await this.prisma.token.findMany({
      where: { mapId },
    });

    try {
      // Create the new map
      const newMap = await this.prisma.map.create({
        data: {
          name: `${map.name} - Copy`,
          createdAt: new Date(),
          tokens: {
            create: tokens.map((token) => ({
              width: token.width,
              height: token.height,
              x: token.x,
              y: token.y,
              createdAt: token.createdAt,
              updatedAt: token.updatedAt,
              createdBy: { connect: { id: token.createdById } },
              character: { connect: { id: token.characterId } },
            })),
          },
          media: { connect: map.media.map((media) => ({ id: media.id })) },
          selectedMediaId: map.selectedMediaId,
          campaign: { connect: { id: map.campaign.id } },
          createdBy: { connect: { id: map.createdById } },
        },
        include: {
          media: true,
          createdBy: { include: { avatar: true } },
        },
      });

      // Emit the new map to the campaign's room
      this.mapsGateway.createMap(map);

      this.logger.debug(`✅️ Duplicated map "${mapId}" to "${newMap.id}"`);
      return newMap;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Update a map
   * @param mapId - The map id
   * @param data - The map data
   * @returns The updated map
   */
  async updateMap(mapId: string, data: UpdateMapDto): Promise<MapEntity> {
    this.logger.verbose(`📂 Updating map "${mapId}"`);
    try {
      // Update the map
      const map = await this.prisma.map.update({
        where: { id: mapId },
        data: {
          name: data.name,
          ...(data.mediaIds && { media: { connect: data.mediaIds.map((id) => ({ id })) } }),
          ...(data.selectedMediaId && { selectedMediaId: data.selectedMediaId }),
          campaign: { connect: { id: data.campaignId } },
        },
        include: { media: true, createdBy: { include: { avatar: true } } },
      });

      // Emit the updated map to the campaign's room
      this.mapsGateway.updateMap(map);

      this.logger.debug(`✅️ Updated map "${mapId}"`);
      return map;
    } catch (error) {
      this.logger.error(`🚨 Map "${mapId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Delete a map
   * @param mapId - The map id
   * @returns The deleted map
   */
  async deleteMap(mapId: string): Promise<MapEntity> {
    this.logger.verbose(`📂 Deleting map "${mapId}"`);
    try {
      // Delete the map
      const map = await this.prisma.map.delete({
        where: { id: mapId },
        include: { media: true, createdBy: { include: { avatar: true } } },
      });

      // Emit the deleted map to the campaign's room
      this.mapsGateway.deleteMap(map);

      this.logger.debug(`✅️ Deleted map "${mapId}"`);
      return map;
    } catch (error) {
      this.logger.error(`🚨 Map "${mapId}" not found`);
      throw new NotFoundException(error.message);
    }
  }
}
