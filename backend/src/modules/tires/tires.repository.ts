import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../shared/database/connection';
import { tires, tireEvents, NewTire, Tire } from '../../shared/database/schema';

export class TiresRepository {
  async findAllByVehicle(vehicleId: string): Promise<Tire[]> {
    return db.select().from(tires)
      .where(eq(tires.vehicleId, vehicleId))
      .orderBy(tires.position);
  }

  async findById(id: string, vehicleId: string): Promise<Tire | undefined> {
    const result = await db.select().from(tires)
      .where(and(eq(tires.id, id), eq(tires.vehicleId, vehicleId)))
      .limit(1);
    return result[0];
  }

  async create(data: NewTire): Promise<Tire> {
    const result = await db.insert(tires).values(data).returning();
    return result[0];
  }

  async update(id: string, vehicleId: string, data: Partial<NewTire>): Promise<Tire> {
    const result = await db.update(tires)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(tires.id, id), eq(tires.vehicleId, vehicleId)))
      .returning();
    return result[0];
  }

  async delete(id: string, vehicleId: string): Promise<void> {
    await db.delete(tires).where(and(eq(tires.id, id), eq(tires.vehicleId, vehicleId)));
  }

  async findEventsByVehicle(vehicleId: string) {
    return db.select().from(tireEvents)
      .where(eq(tireEvents.vehicleId, vehicleId))
      .orderBy(desc(tireEvents.date));
  }

  async createEvent(data: typeof tireEvents.$inferInsert) {
    const result = await db.insert(tireEvents).values(data).returning();
    return result[0];
  }
}
