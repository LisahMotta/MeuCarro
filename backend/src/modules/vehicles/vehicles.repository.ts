import { eq, and } from 'drizzle-orm';
import { db } from '../../shared/database/connection';
import { vehicles, NewVehicle, Vehicle } from '../../shared/database/schema';

export class VehiclesRepository {
  async findAllByUser(userId: string): Promise<Vehicle[]> {
    return db.select().from(vehicles)
      .where(and(eq(vehicles.userId, userId), eq(vehicles.isActive, true)))
      .orderBy(vehicles.createdAt);
  }

  async findById(id: string, userId: string): Promise<Vehicle | undefined> {
    const result = await db.select().from(vehicles)
      .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)))
      .limit(1);
    return result[0];
  }

  async create(data: NewVehicle): Promise<Vehicle> {
    const result = await db.insert(vehicles).values(data).returning();
    return result[0];
  }

  async update(id: string, userId: string, data: Partial<NewVehicle>): Promise<Vehicle> {
    const result = await db.update(vehicles)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)))
      .returning();
    return result[0];
  }

  async delete(id: string, userId: string): Promise<void> {
    await db.update(vehicles)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)));
  }

  async updatePhoto(id: string, userId: string, photoUrl: string): Promise<Vehicle> {
    const result = await db.update(vehicles)
      .set({ photoUrl, updatedAt: new Date() })
      .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)))
      .returning();
    return result[0];
  }

  async updateKm(id: string, km: number): Promise<void> {
    await db.update(vehicles)
      .set({ currentKm: km, updatedAt: new Date() })
      .where(eq(vehicles.id, id));
  }

  async countByUser(userId: string): Promise<number> {
    const result = await db.select().from(vehicles)
      .where(and(eq(vehicles.userId, userId), eq(vehicles.isActive, true)));
    return result.length;
  }
}
