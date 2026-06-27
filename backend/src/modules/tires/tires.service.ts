import { TiresRepository } from './tires.repository';
import { VehiclesRepository } from '../vehicles/vehicles.repository';
import { CreateTireDto, UpdateTireDto, CreateTireEventDto } from './tires.dto';

const repo = new TiresRepository();
const vehiclesRepo = new VehiclesRepository();

export class TiresService {
  async getAll(vehicleId: string, userId: string) {
    await this.assertOwnership(vehicleId, userId);
    return repo.findAllByVehicle(vehicleId);
  }

  async create(vehicleId: string, userId: string, dto: CreateTireDto) {
    await this.assertOwnership(vehicleId, userId);
    return repo.create({
      vehicleId,
      ...dto,
      purchasePrice: dto.purchasePrice?.toString(),
    });
  }

  async update(id: string, vehicleId: string, userId: string, dto: UpdateTireDto) {
    await this.assertOwnership(vehicleId, userId);
    const tire = await repo.findById(id, vehicleId);
    if (!tire) throw new Error('Tire not found');
    return repo.update(id, vehicleId, {
      ...dto,
      purchasePrice: dto.purchasePrice?.toString(),
    });
  }

  async delete(id: string, vehicleId: string, userId: string) {
    await this.assertOwnership(vehicleId, userId);
    const tire = await repo.findById(id, vehicleId);
    if (!tire) throw new Error('Tire not found');
    await repo.delete(id, vehicleId);
  }

  async getEvents(vehicleId: string, userId: string) {
    await this.assertOwnership(vehicleId, userId);
    return repo.findEventsByVehicle(vehicleId);
  }

  async createEvent(vehicleId: string, userId: string, dto: CreateTireEventDto) {
    await this.assertOwnership(vehicleId, userId);
    return repo.createEvent({
      vehicleId,
      tireId: dto.tireId,
      date: dto.date,
      odometer: dto.odometer,
      type: dto.type,
      pressureFL: dto.pressureFL?.toString(),
      pressureFR: dto.pressureFR?.toString(),
      pressureRL: dto.pressureRL?.toString(),
      pressureRR: dto.pressureRR?.toString(),
      cost: dto.cost?.toString(),
      notes: dto.notes,
    });
  }

  private async assertOwnership(vehicleId: string, userId: string) {
    const vehicle = await vehiclesRepo.findById(vehicleId, userId);
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }
}
