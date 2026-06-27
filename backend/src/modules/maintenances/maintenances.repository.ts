import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../../shared/database/connection';
import { maintenances, maintenanceAttachments, NewMaintenance, Maintenance } from '../../shared/database/schema';

export class MaintenancesRepository {
  async findAllByVehicle(vehicleId: string): Promise<Maintenance[]> {
    return db.select().from(maintenances)
      .where(eq(maintenances.vehicleId, vehicleId))
      .orderBy(desc(maintenances.date), desc(maintenances.odometer));
  }

  async findById(id: string, vehicleId: string): Promise<Maintenance | undefined> {
    const result = await db.select().from(maintenances)
      .where(and(eq(maintenances.id, id), eq(maintenances.vehicleId, vehicleId)))
      .limit(1);
    return result[0];
  }

  async findByCategory(vehicleId: string, category: string): Promise<Maintenance[]> {
    return db.select().from(maintenances)
      .where(and(
        eq(maintenances.vehicleId, vehicleId),
        eq(maintenances.category, category as any)
      ))
      .orderBy(desc(maintenances.date));
  }

  async create(data: NewMaintenance): Promise<Maintenance> {
    const result = await db.insert(maintenances).values(data).returning();
    return result[0];
  }

  async update(id: string, vehicleId: string, data: Partial<NewMaintenance>): Promise<Maintenance> {
    const result = await db.update(maintenances)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(maintenances.id, id), eq(maintenances.vehicleId, vehicleId)))
      .returning();
    return result[0];
  }

  async delete(id: string, vehicleId: string): Promise<void> {
    await db.delete(maintenances)
      .where(and(eq(maintenances.id, id), eq(maintenances.vehicleId, vehicleId)));
  }

  async getStats(vehicleId: string) {
    const result = await db.select({
      totalCost: sql<string>`COALESCE(SUM(${maintenances.totalCost}), 0)`,
      totalLaborCost: sql<string>`COALESCE(SUM(${maintenances.laborCost}), 0)`,
      totalPartsCost: sql<string>`COALESCE(SUM(${maintenances.partsCost}), 0)`,
      count: sql<number>`COUNT(*)`,
    }).from(maintenances)
      .where(eq(maintenances.vehicleId, vehicleId));
    return result[0];
  }

  async getByCategory(vehicleId: string) {
    return db.select({
      category: maintenances.category,
      totalCost: sql<string>`COALESCE(SUM(${maintenances.totalCost}), 0)`,
      count: sql<number>`COUNT(*)`,
    }).from(maintenances)
      .where(eq(maintenances.vehicleId, vehicleId))
      .groupBy(maintenances.category)
      .orderBy(sql`SUM(${maintenances.totalCost}) DESC`);
  }

  async addAttachment(data: { maintenanceId: string; type: 'photo' | 'invoice' | 'other'; url: string; filename?: string }) {
    const result = await db.insert(maintenanceAttachments).values(data).returning();
    return result[0];
  }

  async getAttachments(maintenanceId: string) {
    return db.select().from(maintenanceAttachments)
      .where(eq(maintenanceAttachments.maintenanceId, maintenanceId));
  }
}
