import { eq, and, desc, sql, gte, lte } from 'drizzle-orm';
import { db } from '../../shared/database/connection';
import { vehicles, fuelings, maintenances, documents, tireEvents, alerts } from '../../shared/database/schema';
import { VehiclesRepository } from '../vehicles/vehicles.repository';

const vehiclesRepo = new VehiclesRepository();

export class DashboardService {
  async getDashboard(vehicleId: string, userId: string) {
    const vehicle = await vehiclesRepo.findById(vehicleId, userId);
    if (!vehicle) throw new Error('Vehicle not found');

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];

    const [
      monthFueling,
      yearFueling,
      monthMaintenance,
      yearMaintenance,
      totalFueling,
      totalMaintenance,
      lastFueling,
      lastOilChange,
      lastRotation,
      lastRevision,
      upcomingDocs,
      recentAlerts,
    ] = await Promise.all([
      // Month fueling cost
      db.select({ total: sql<string>`COALESCE(SUM(${fuelings.totalCost}), 0)` })
        .from(fuelings)
        .where(and(eq(fuelings.vehicleId, vehicleId), gte(fuelings.date, startOfMonth))),

      // Year fueling cost
      db.select({ total: sql<string>`COALESCE(SUM(${fuelings.totalCost}), 0)` })
        .from(fuelings)
        .where(and(eq(fuelings.vehicleId, vehicleId), gte(fuelings.date, startOfYear))),

      // Month maintenance cost
      db.select({ total: sql<string>`COALESCE(SUM(${maintenances.totalCost}), 0)` })
        .from(maintenances)
        .where(and(eq(maintenances.vehicleId, vehicleId), gte(maintenances.date, startOfMonth))),

      // Year maintenance cost
      db.select({ total: sql<string>`COALESCE(SUM(${maintenances.totalCost}), 0)` })
        .from(maintenances)
        .where(and(eq(maintenances.vehicleId, vehicleId), gte(maintenances.date, startOfYear))),

      // All-time fueling cost
      db.select({ total: sql<string>`COALESCE(SUM(${fuelings.totalCost}), 0)` })
        .from(fuelings)
        .where(eq(fuelings.vehicleId, vehicleId)),

      // All-time maintenance cost
      db.select({ total: sql<string>`COALESCE(SUM(${maintenances.totalCost}), 0)` })
        .from(maintenances)
        .where(eq(maintenances.vehicleId, vehicleId)),

      // Last fueling with consumption
      db.select().from(fuelings)
        .where(and(eq(fuelings.vehicleId, vehicleId)))
        .orderBy(desc(fuelings.odometer))
        .limit(1),

      // Last oil change
      db.select().from(maintenances)
        .where(and(eq(maintenances.vehicleId, vehicleId), eq(maintenances.category, 'oil_change')))
        .orderBy(desc(maintenances.date))
        .limit(1),

      // Last rotation
      db.select().from(maintenances)
        .where(and(eq(maintenances.vehicleId, vehicleId), eq(maintenances.category, 'rotation')))
        .orderBy(desc(maintenances.date))
        .limit(1),

      // Last revision
      db.select().from(maintenances)
        .where(and(eq(maintenances.vehicleId, vehicleId), eq(maintenances.category, 'general_revision')))
        .orderBy(desc(maintenances.date))
        .limit(1),

      // Upcoming documents (next 60 days)
      db.select().from(documents)
        .where(and(
          eq(documents.vehicleId, vehicleId),
          eq(documents.status, 'active'),
          sql`${documents.expiryDate} IS NOT NULL`,
          lte(documents.expiryDate, new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        ))
        .orderBy(documents.expiryDate),

      // Recent unread alerts
      db.select().from(alerts)
        .where(and(eq(alerts.vehicleId, vehicleId), eq(alerts.isRead, false), eq(alerts.isDismissed, false)))
        .orderBy(desc(alerts.createdAt))
        .limit(5),
    ]);

    const monthTotal = parseFloat(monthFueling[0].total) + parseFloat(monthMaintenance[0].total);
    const yearTotal = parseFloat(yearFueling[0].total) + parseFloat(yearMaintenance[0].total);
    const allTimeTotal = parseFloat(totalFueling[0].total) + parseFloat(totalMaintenance[0].total);

    const avgConsumption = await db.select({
      avg: sql<string>`COALESCE(AVG(CASE WHEN ${fuelings.consumption} IS NOT NULL THEN ${fuelings.consumption} END), 0)`
    }).from(fuelings).where(eq(fuelings.vehicleId, vehicleId));

    const kmRodados = vehicle.currentKm;
    const costPerKm = kmRodados > 0 ? (allTimeTotal / kmRodados).toFixed(4) : '0';

    return {
      vehicle,
      stats: {
        monthTotal: monthTotal.toFixed(2),
        yearTotal: yearTotal.toFixed(2),
        allTimeTotal: allTimeTotal.toFixed(2),
        monthFueling: monthFueling[0].total,
        monthMaintenance: monthMaintenance[0].total,
        avgConsumption: avgConsumption[0].avg,
        costPerKm,
        currentKm: vehicle.currentKm,
      },
      nextServices: {
        oilChange: lastOilChange[0] ?? null,
        rotation: lastRotation[0] ?? null,
        revision: lastRevision[0] ?? null,
      },
      upcomingDocuments: upcomingDocs,
      recentAlerts,
      lastFueling: lastFueling[0] ?? null,
    };
  }

  async getMonthlyExpenses(vehicleId: string, userId: string, year: number) {
    await vehiclesRepo.findById(vehicleId, userId);

    const fuelByMonth = await db.select({
      month: sql<number>`EXTRACT(MONTH FROM ${fuelings.date}::date)`,
      total: sql<string>`COALESCE(SUM(${fuelings.totalCost}), 0)`,
    }).from(fuelings)
      .where(and(eq(fuelings.vehicleId, vehicleId), sql`EXTRACT(YEAR FROM ${fuelings.date}::date) = ${year}`))
      .groupBy(sql`EXTRACT(MONTH FROM ${fuelings.date}::date)`);

    const maintenanceByMonth = await db.select({
      month: sql<number>`EXTRACT(MONTH FROM ${maintenances.date}::date)`,
      total: sql<string>`COALESCE(SUM(${maintenances.totalCost}), 0)`,
    }).from(maintenances)
      .where(and(eq(maintenances.vehicleId, vehicleId), sql`EXTRACT(YEAR FROM ${maintenances.date}::date) = ${year}`))
      .groupBy(sql`EXTRACT(MONTH FROM ${maintenances.date}::date)`);

    const months = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const fuel = fuelByMonth.find((f) => Number(f.month) === m);
      const maint = maintenanceByMonth.find((mt) => Number(mt.month) === m);
      return {
        month: m,
        fuel: parseFloat(fuel?.total ?? '0'),
        maintenance: parseFloat(maint?.total ?? '0'),
        total: parseFloat(fuel?.total ?? '0') + parseFloat(maint?.total ?? '0'),
      };
    });

    return months;
  }
}
