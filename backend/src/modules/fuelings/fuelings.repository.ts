import { eq, and, desc, lt, gt, asc, sql } from 'drizzle-orm';
import { db } from '../../shared/database/connection';
import { fuelings, vehicles, NewFueling, Fueling } from '../../shared/database/schema';

export class FuelingsRepository {
  async findAllByVehicle(vehicleId: string, limit = 50, offset = 0): Promise<Fueling[]> {
    return db.select().from(fuelings)
      .where(eq(fuelings.vehicleId, vehicleId))
      .orderBy(desc(fuelings.date), desc(fuelings.odometer))
      .limit(limit).offset(offset);
  }

  async findById(id: string, vehicleId: string): Promise<Fueling | undefined> {
    const result = await db.select().from(fuelings)
      .where(and(eq(fuelings.id, id), eq(fuelings.vehicleId, vehicleId)))
      .limit(1);
    return result[0];
  }

  async findLastFullTank(vehicleId: string, beforeOdometer: number): Promise<Fueling | undefined> {
    const result = await db.select().from(fuelings)
      .where(and(
        eq(fuelings.vehicleId, vehicleId),
        eq(fuelings.fullTank, true),
        lt(fuelings.odometer, beforeOdometer)
      ))
      .orderBy(desc(fuelings.odometer))
      .limit(1);
    return result[0];
  }

  // Sums liters and cost for all fills strictly between two odometer readings (for partial fills between full tanks)
  async aggregateBetween(vehicleId: string, afterOdometer: number, beforeOdometer: number): Promise<{ liters: number; cost: number }> {
    const result = await db.select({
      liters: sql<string>`COALESCE(SUM(${fuelings.liters}), 0)`,
      cost: sql<string>`COALESCE(SUM(${fuelings.totalCost}), 0)`,
    }).from(fuelings)
      .where(and(
        eq(fuelings.vehicleId, vehicleId),
        gt(fuelings.odometer, afterOdometer),
        lt(fuelings.odometer, beforeOdometer),
      ));
    return { liters: parseFloat(result[0].liters), cost: parseFloat(result[0].cost) };
  }

  async create(data: NewFueling): Promise<Fueling> {
    const result = await db.insert(fuelings).values(data).returning();
    return result[0];
  }

  async update(id: string, vehicleId: string, data: Partial<NewFueling>): Promise<Fueling> {
    const result = await db.update(fuelings)
      .set(data)
      .where(and(eq(fuelings.id, id), eq(fuelings.vehicleId, vehicleId)))
      .returning();
    return result[0];
  }

  async delete(id: string, vehicleId: string): Promise<void> {
    await db.delete(fuelings)
      .where(and(eq(fuelings.id, id), eq(fuelings.vehicleId, vehicleId)));
  }

  async getStats(vehicleId: string) {
    const result = await db.select({
      totalCost: sql<string>`COALESCE(SUM(${fuelings.totalCost}), 0)`,
      totalLiters: sql<string>`COALESCE(SUM(${fuelings.liters}), 0)`,
      count: sql<number>`COUNT(*)`,
      avgConsumption: sql<string>`COALESCE(AVG(CASE WHEN ${fuelings.consumption} IS NOT NULL THEN ${fuelings.consumption} END), 0)`,
      minConsumption: sql<string>`COALESCE(MIN(CASE WHEN ${fuelings.consumption} IS NOT NULL THEN ${fuelings.consumption} END), 0)`,
      maxConsumption: sql<string>`COALESCE(MAX(CASE WHEN ${fuelings.consumption} IS NOT NULL THEN ${fuelings.consumption} END), 0)`,
      avgPricePerLiter: sql<string>`COALESCE(AVG(${fuelings.pricePerLiter}), 0)`,
    }).from(fuelings)
      .where(eq(fuelings.vehicleId, vehicleId));
    return result[0];
  }

  async getMonthlyStats(vehicleId: string, year: number) {
    const result = await db.select({
      month: sql<number>`EXTRACT(MONTH FROM ${fuelings.date}::date)`,
      totalCost: sql<string>`COALESCE(SUM(${fuelings.totalCost}), 0)`,
      totalLiters: sql<string>`COALESCE(SUM(${fuelings.liters}), 0)`,
      count: sql<number>`COUNT(*)`,
    }).from(fuelings)
      .where(and(
        eq(fuelings.vehicleId, vehicleId),
        sql`EXTRACT(YEAR FROM ${fuelings.date}::date) = ${year}`
      ))
      .groupBy(sql`EXTRACT(MONTH FROM ${fuelings.date}::date)`)
      .orderBy(sql`EXTRACT(MONTH FROM ${fuelings.date}::date)`);
    return result;
  }

  async countByVehicle(vehicleId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`COUNT(*)` })
      .from(fuelings)
      .where(eq(fuelings.vehicleId, vehicleId));
    return Number(result[0].count);
  }
}
