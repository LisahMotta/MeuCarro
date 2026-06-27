import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../../shared/database/connection';
import { fuelings, maintenances, tireEvents, documents } from '../../shared/database/schema';
import { VehiclesRepository } from '../vehicles/vehicles.repository';

const vehiclesRepo = new VehiclesRepository();

export class ReportsService {
  async getExpenseReport(vehicleId: string, userId: string, year: number) {
    await vehiclesRepo.findById(vehicleId, userId);

    const [fuelByMonth, maintByMonth, fuelByYear, maintByYear, maintByCategory] = await Promise.all([
      db.select({
        month: sql<number>`EXTRACT(MONTH FROM ${fuelings.date}::date)`,
        total: sql<string>`COALESCE(SUM(${fuelings.totalCost}), 0)`,
        liters: sql<string>`COALESCE(SUM(${fuelings.liters}), 0)`,
        count: sql<number>`COUNT(*)`,
      }).from(fuelings)
        .where(and(eq(fuelings.vehicleId, vehicleId), sql`EXTRACT(YEAR FROM ${fuelings.date}::date) = ${year}`))
        .groupBy(sql`EXTRACT(MONTH FROM ${fuelings.date}::date)`)
        .orderBy(sql`EXTRACT(MONTH FROM ${fuelings.date}::date)`),

      db.select({
        month: sql<number>`EXTRACT(MONTH FROM ${maintenances.date}::date)`,
        total: sql<string>`COALESCE(SUM(${maintenances.totalCost}), 0)`,
        count: sql<number>`COUNT(*)`,
      }).from(maintenances)
        .where(and(eq(maintenances.vehicleId, vehicleId), sql`EXTRACT(YEAR FROM ${maintenances.date}::date) = ${year}`))
        .groupBy(sql`EXTRACT(MONTH FROM ${maintenances.date}::date)`)
        .orderBy(sql`EXTRACT(MONTH FROM ${maintenances.date}::date)`),

      db.select({
        total: sql<string>`COALESCE(SUM(${fuelings.totalCost}), 0)`,
        liters: sql<string>`COALESCE(SUM(${fuelings.liters}), 0)`,
        count: sql<number>`COUNT(*)`,
        avgConsumption: sql<string>`COALESCE(AVG(CASE WHEN ${fuelings.consumption} IS NOT NULL THEN ${fuelings.consumption} END), 0)`,
        avgPrice: sql<string>`COALESCE(AVG(${fuelings.pricePerLiter}), 0)`,
      }).from(fuelings)
        .where(and(eq(fuelings.vehicleId, vehicleId), sql`EXTRACT(YEAR FROM ${fuelings.date}::date) = ${year}`)),

      db.select({
        total: sql<string>`COALESCE(SUM(${maintenances.totalCost}), 0)`,
        laborCost: sql<string>`COALESCE(SUM(${maintenances.laborCost}), 0)`,
        partsCost: sql<string>`COALESCE(SUM(${maintenances.partsCost}), 0)`,
        count: sql<number>`COUNT(*)`,
      }).from(maintenances)
        .where(and(eq(maintenances.vehicleId, vehicleId), sql`EXTRACT(YEAR FROM ${maintenances.date}::date) = ${year}`)),

      db.select({
        category: maintenances.category,
        total: sql<string>`COALESCE(SUM(${maintenances.totalCost}), 0)`,
        count: sql<number>`COUNT(*)`,
      }).from(maintenances)
        .where(and(eq(maintenances.vehicleId, vehicleId), sql`EXTRACT(YEAR FROM ${maintenances.date}::date) = ${year}`))
        .groupBy(maintenances.category)
        .orderBy(sql`SUM(${maintenances.totalCost}) DESC`),
    ]);

    const months = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const fuel = fuelByMonth.find((f) => Number(f.month) === m);
      const maint = maintByMonth.find((mt) => Number(mt.month) === m);
      return {
        month: m,
        fuelTotal: parseFloat(fuel?.total ?? '0'),
        fuelLiters: parseFloat(fuel?.liters ?? '0'),
        fuelCount: Number(fuel?.count ?? 0),
        maintTotal: parseFloat(maint?.total ?? '0'),
        maintCount: Number(maint?.count ?? 0),
        total: parseFloat(fuel?.total ?? '0') + parseFloat(maint?.total ?? '0'),
      };
    });

    return {
      year,
      months,
      fuel: {
        total: parseFloat(fuelByYear[0]?.total ?? '0'),
        liters: parseFloat(fuelByYear[0]?.liters ?? '0'),
        count: Number(fuelByYear[0]?.count ?? 0),
        avgConsumption: parseFloat(fuelByYear[0]?.avgConsumption ?? '0'),
        avgPrice: parseFloat(fuelByYear[0]?.avgPrice ?? '0'),
      },
      maintenance: {
        total: parseFloat(maintByYear[0]?.total ?? '0'),
        laborCost: parseFloat(maintByYear[0]?.laborCost ?? '0'),
        partsCost: parseFloat(maintByYear[0]?.partsCost ?? '0'),
        count: Number(maintByYear[0]?.count ?? 0),
        byCategory: maintByCategory.map((c) => ({
          category: c.category,
          total: parseFloat(c.total),
          count: Number(c.count),
        })),
      },
      grandTotal: parseFloat(fuelByYear[0]?.total ?? '0') + parseFloat(maintByYear[0]?.total ?? '0'),
    };
  }

  async getHistory(vehicleId: string, userId: string, limit = 50, offset = 0) {
    await vehiclesRepo.findById(vehicleId, userId);

    const [fuelRows, maintRows, tireRows, docRows] = await Promise.all([
      db.select().from(fuelings)
        .where(eq(fuelings.vehicleId, vehicleId))
        .orderBy(desc(fuelings.date))
        .limit(limit),

      db.select().from(maintenances)
        .where(eq(maintenances.vehicleId, vehicleId))
        .orderBy(desc(maintenances.date))
        .limit(limit),

      db.select().from(tireEvents)
        .where(eq(tireEvents.vehicleId, vehicleId))
        .orderBy(desc(tireEvents.date))
        .limit(limit),

      db.select().from(documents)
        .where(eq(documents.vehicleId, vehicleId))
        .orderBy(desc(documents.issueDate))
        .limit(limit),
    ]);

    const events = [
      ...fuelRows.map((f) => ({
        id: f.id,
        type: 'fueling' as const,
        date: f.date,
        title: `Abastecimento — ${parseFloat(f.liters.toString()).toFixed(1)}L`,
        subtitle: f.fuelType ?? undefined,
        amount: parseFloat(f.totalCost?.toString() ?? '0'),
        odometer: f.odometer,
        meta: { consumption: f.consumption ? parseFloat(f.consumption.toString()) : null, fullTank: f.fullTank },
      })),
      ...maintRows.map((m) => ({
        id: m.id,
        type: 'maintenance' as const,
        date: m.date,
        title: m.title,
        subtitle: m.category,
        amount: parseFloat(m.totalCost?.toString() ?? '0'),
        odometer: m.odometer ?? undefined,
        meta: { category: m.category, status: m.status },
      })),
      ...tireRows.map((t) => ({
        id: t.id,
        type: 'tire_event' as const,
        date: t.date,
        title: `Pneus — ${t.eventType}`,
        subtitle: t.description ?? undefined,
        amount: parseFloat(t.cost?.toString() ?? '0'),
        odometer: t.odometer ?? undefined,
        meta: { eventType: t.eventType },
      })),
      ...docRows.map((d) => ({
        id: d.id,
        type: 'document' as const,
        date: d.issueDate ?? d.expiryDate ?? '',
        title: d.title,
        subtitle: d.type,
        amount: parseFloat(d.value?.toString() ?? '0'),
        odometer: undefined,
        meta: { docType: d.type, expiryDate: d.expiryDate },
      })),
    ]
      .filter((e) => !!e.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(offset, offset + limit);

    return events;
  }
}
