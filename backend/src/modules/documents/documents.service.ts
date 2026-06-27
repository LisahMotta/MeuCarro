import { DocumentsRepository } from './documents.repository';
import { VehiclesRepository } from '../vehicles/vehicles.repository';
import { CreateDocumentDto, UpdateDocumentDto } from './documents.dto';

const repo = new DocumentsRepository();
const vehiclesRepo = new VehiclesRepository();

export class DocumentsService {
  async getAll(vehicleId: string, userId: string) {
    await this.assertOwnership(vehicleId, userId);
    const docs = await repo.findAllByVehicle(vehicleId);
    return docs.map((d) => ({
      ...d,
      daysUntilExpiry: d.expiryDate ? this.daysUntil(d.expiryDate) : null,
      expiryStatus: d.expiryDate ? this.getExpiryStatus(d.expiryDate) : null,
    }));
  }

  async getById(id: string, vehicleId: string, userId: string) {
    await this.assertOwnership(vehicleId, userId);
    const doc = await repo.findById(id, vehicleId);
    if (!doc) throw new Error('Document not found');
    return doc;
  }

  async create(vehicleId: string, userId: string, dto: CreateDocumentDto) {
    await this.assertOwnership(vehicleId, userId);
    return repo.create({
      vehicleId,
      ...dto,
      value: dto.value?.toString(),
    });
  }

  async update(id: string, vehicleId: string, userId: string, dto: UpdateDocumentDto) {
    await this.getById(id, vehicleId, userId);
    return repo.update(id, vehicleId, {
      ...dto,
      value: dto.value?.toString(),
    });
  }

  async delete(id: string, vehicleId: string, userId: string) {
    await this.getById(id, vehicleId, userId);
    await repo.delete(id, vehicleId);
  }

  async uploadFile(id: string, vehicleId: string, userId: string, fileUrl: string) {
    await this.getById(id, vehicleId, userId);
    return repo.updateFile(id, vehicleId, fileUrl);
  }

  private daysUntil(dateStr: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  private getExpiryStatus(dateStr: string): 'expired' | 'critical' | 'warning' | 'ok' {
    const days = this.daysUntil(dateStr);
    if (days < 0) return 'expired';
    if (days <= 7) return 'critical';
    if (days <= 30) return 'warning';
    return 'ok';
  }

  private async assertOwnership(vehicleId: string, userId: string) {
    const vehicle = await vehiclesRepo.findById(vehicleId, userId);
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }
}
