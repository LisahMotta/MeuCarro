import { FuelingsRepository } from './fuelings.repository';
import { VehiclesRepository } from '../vehicles/vehicles.repository';
import { CreateFuelingDto, UpdateFuelingDto } from './fuelings.dto';

const repo = new FuelingsRepository();
const vehiclesRepo = new VehiclesRepository();

export class FuelingsService {
  async getAll(vehicleId: string, userId: string, limit?: number, offset?: number) {
    await this.assertVehicleOwnership(vehicleId, userId);
    return repo.findAllByVehicle(vehicleId, limit, offset);
  }

  async getById(id: string, vehicleId: string, userId: string) {
    await this.assertVehicleOwnership(vehicleId, userId);
    const fueling = await repo.findById(id, vehicleId);
    if (!fueling) throw new Error('Fueling not found');
    return fueling;
  }

  async create(vehicleId: string, userId: string, dto: CreateFuelingDto) {
    const vehicle = await this.assertVehicleOwnership(vehicleId, userId);

    let consumption: string | undefined;
    let autonomy: string | undefined;
    let costPerKm: string | undefined;

    if (dto.fullTank) {
      const prevFullTank = await repo.findLastFullTank(vehicleId, dto.odometer);
      if (prevFullTank) {
        const kmDiff = dto.odometer - Number(prevFullTank.odometer);
        if (kmDiff > 0) {
          // Sum partial fills between the two full-tank events
          const between = await repo.aggregateBetween(vehicleId, Number(prevFullTank.odometer), dto.odometer);
          const totalLiters = between.liters + dto.liters;
          const totalCost = between.cost + dto.totalCost;
          if (totalLiters > 0) {
            const cons = kmDiff / totalLiters;
            consumption = cons.toFixed(3);
            const tankCap = vehicle.tankCapacity ? Number(vehicle.tankCapacity) : totalLiters;
            autonomy = (cons * tankCap).toFixed(2);
            costPerKm = (totalCost / kmDiff).toFixed(4);
          }
        }
      }
    }

    const fueling = await repo.create({
      vehicleId,
      date: dto.date,
      odometer: dto.odometer,
      stationName: dto.stationName,
      city: dto.city,
      fuelType: dto.fuelType,
      liters: dto.liters.toString(),
      pricePerLiter: dto.pricePerLiter.toString(),
      totalCost: dto.totalCost.toString(),
      fullTank: dto.fullTank,
      partialTank: dto.partialTank,
      consumption,
      autonomy,
      costPerKm,
      notes: dto.notes,
    });

    // Update vehicle current km if higher
    if (dto.odometer > vehicle.currentKm) {
      await vehiclesRepo.updateKm(vehicleId, dto.odometer);
    }

    return fueling;
  }

  async update(id: string, vehicleId: string, userId: string, dto: UpdateFuelingDto) {
    await this.getById(id, vehicleId, userId);
    return repo.update(id, vehicleId, {
      ...dto,
      liters: dto.liters?.toString(),
      pricePerLiter: dto.pricePerLiter?.toString(),
      totalCost: dto.totalCost?.toString(),
    });
  }

  async delete(id: string, vehicleId: string, userId: string) {
    await this.getById(id, vehicleId, userId);
    await repo.delete(id, vehicleId);
  }

  async getStats(vehicleId: string, userId: string) {
    await this.assertVehicleOwnership(vehicleId, userId);
    const stats = await repo.getStats(vehicleId);
    const total = await repo.countByVehicle(vehicleId);
    return { ...stats, total };
  }

  async getMonthlyStats(vehicleId: string, userId: string, year: number) {
    await this.assertVehicleOwnership(vehicleId, userId);
    return repo.getMonthlyStats(vehicleId, year);
  }

  private async assertVehicleOwnership(vehicleId: string, userId: string) {
    const vehicle = await vehiclesRepo.findById(vehicleId, userId);
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }
}
