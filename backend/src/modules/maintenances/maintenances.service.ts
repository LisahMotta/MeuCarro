import { MaintenancesRepository } from './maintenances.repository';
import { VehiclesRepository } from '../vehicles/vehicles.repository';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from './maintenances.dto';

const repo = new MaintenancesRepository();
const vehiclesRepo = new VehiclesRepository();

export class MaintenancesService {
  async getAll(vehicleId: string, userId: string) {
    await this.assertOwnership(vehicleId, userId);
    return repo.findAllByVehicle(vehicleId);
  }

  async getById(id: string, vehicleId: string, userId: string) {
    await this.assertOwnership(vehicleId, userId);
    const m = await repo.findById(id, vehicleId);
    if (!m) throw new Error('Maintenance not found');
    const attachments = await repo.getAttachments(id);
    return { ...m, attachments };
  }

  async create(vehicleId: string, userId: string, dto: CreateMaintenanceDto) {
    const vehicle = await this.assertOwnership(vehicleId, userId);
    const maintenance = await repo.create({
      vehicleId,
      date: dto.date,
      odometer: dto.odometer,
      category: dto.category,
      shopName: dto.shopName,
      mechanicName: dto.mechanicName,
      laborCost: dto.laborCost.toString(),
      partsCost: dto.partsCost.toString(),
      totalCost: dto.totalCost.toString(),
      warrantyUntil: dto.warrantyUntil,
      nextServiceDate: dto.nextServiceDate,
      nextServiceKm: dto.nextServiceKm,
      notes: dto.notes,
      status: dto.status,
    });

    if (dto.odometer > vehicle.currentKm) {
      await vehiclesRepo.updateKm(vehicleId, dto.odometer);
    }

    return maintenance;
  }

  async update(id: string, vehicleId: string, userId: string, dto: UpdateMaintenanceDto) {
    await this.getById(id, vehicleId, userId);
    return repo.update(id, vehicleId, {
      ...dto,
      laborCost: dto.laborCost?.toString(),
      partsCost: dto.partsCost?.toString(),
      totalCost: dto.totalCost?.toString(),
    });
  }

  async delete(id: string, vehicleId: string, userId: string) {
    await this.getById(id, vehicleId, userId);
    await repo.delete(id, vehicleId);
  }

  async getStats(vehicleId: string, userId: string) {
    await this.assertOwnership(vehicleId, userId);
    const [stats, byCategory] = await Promise.all([
      repo.getStats(vehicleId),
      repo.getByCategory(vehicleId),
    ]);
    return { ...stats, byCategory };
  }

  async addAttachment(
    id: string, vehicleId: string, userId: string,
    type: 'photo' | 'invoice' | 'other', url: string, filename?: string
  ) {
    await this.getById(id, vehicleId, userId);
    return repo.addAttachment({ maintenanceId: id, type, url, filename });
  }

  private async assertOwnership(vehicleId: string, userId: string) {
    const vehicle = await vehiclesRepo.findById(vehicleId, userId);
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }
}
