import { VehiclesRepository } from './vehicles.repository';
import { CreateVehicleDto, UpdateVehicleDto } from './vehicles.dto';

const repo = new VehiclesRepository();

export class VehiclesService {
  async getAll(userId: string) {
    return repo.findAllByUser(userId);
  }

  async getById(id: string, userId: string) {
    const vehicle = await repo.findById(id, userId);
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }

  async create(userId: string, dto: CreateVehicleDto) {
    return repo.create({
      ...dto,
      userId,
      tankCapacity: dto.tankCapacity?.toString(),
      oilQuantity: dto.oilQuantity?.toString(),
    });
  }

  async update(id: string, userId: string, dto: UpdateVehicleDto) {
    await this.getById(id, userId);
    return repo.update(id, userId, {
      ...dto,
      tankCapacity: dto.tankCapacity?.toString(),
      oilQuantity: dto.oilQuantity?.toString(),
    });
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);
    await repo.delete(id, userId);
  }

  async updatePhoto(id: string, userId: string, photoUrl: string) {
    await this.getById(id, userId);
    return repo.updatePhoto(id, userId, photoUrl);
  }
}
