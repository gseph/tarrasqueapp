import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { MapEntity } from './entities/map.entity';

@Injectable()
export class MapsService {
  private logger: Logger = new Logger(MapsService.name);

  constructor(private prisma: PrismaService) {}

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
        include: { media: true, createdBy: true },
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
  async getMap(mapId: string): Promise<MapEntity> {
    this.logger.verbose(`📂 Getting map "${mapId}"`);
    try {
      // Get the map
      const map = await this.prisma.map.findUniqueOrThrow({
        where: { id: mapId },
        include: {
          tokens: true,
          media: true,
          createdBy: true,
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
   * Get all maps that match the given criteria
   * @param query - The query
   * @returns The maps
   */
  async getMaps(query: Prisma.MapFindManyArgs): Promise<MapEntity[]> {
    this.logger.verbose(`📂 Getting maps`);
    try {
      // Get the maps
      const maps = await this.prisma.map.findMany({
        ...query,
        include: { media: true, createdBy: true },
        orderBy: { order: 'asc' },
      });
      this.logger.debug(`✅️ Found ${maps.length} maps`);
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
   * @param createdById - The user id
   * @returns The created map
   */
  async createMap(data: CreateMapDto, createdById: string): Promise<MapEntity> {
    this.logger.verbose(`📂 Creating map "${data.name} for campaign "${data.campaignId}"`);
    try {
      // Create the map
      const map = await this.prisma.map.create({
        data: {
          name: data.name,
          media: { connect: data.mediaIds.map((id) => ({ id })) },
          selectedMediaId: data.selectedMediaId || data.mediaIds[0],
          campaign: { connect: { id: data.campaignId } },
          createdBy: { connect: { id: createdById } },
        },
        include: { media: true, createdBy: true },
      });
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
    const map = await this.getMap(mapId);
    try {
      // Create the new map
      const newMap = await this.prisma.map.create({
        data: {
          name: `${map.name} - Copy`,
          createdAt: new Date(),
          tokens: {
            create: map.tokens.map((token) => ({
              ...token,
              id: null,
              createdAt: new Date(),
              createdBy: { connect: { id: map.createdById } },
            })),
          },
          media: { connect: map.media.map((media) => ({ id: media.id })) },
          selectedMediaId: map.selectedMediaId,
          campaign: { connect: { id: map.campaign.id } },
          createdBy: { connect: { id: map.createdById } },
        },
        include: {
          media: true,
          createdBy: true,
        },
      });
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
        include: { media: true, createdBy: true },
      });
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
        include: { media: true, createdBy: true },
      });
      this.logger.debug(`✅️ Deleted map "${mapId}"`);
      return map;
    } catch (error) {
      this.logger.error(`🚨 Map "${mapId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Reorder maps for a campaign
   * @param campaignId - The campaign id
   * @param mapIds - The map ids
   * @returns The updated maps in the new order
   */
  async reorderMaps(campaignId: string, mapIds: string[]): Promise<MapEntity[]> {
    this.logger.verbose(`📂 Reordering maps for campaign "${campaignId}"`);
    try {
      // Update the map order
      await this.prisma.$transaction(
        mapIds.map((id, index) =>
          this.prisma.map.update({
            where: { id },
            data: { order: index },
          }),
        ),
      );
      // Return the maps in the new order
      return this.getCampaignMaps(campaignId);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
