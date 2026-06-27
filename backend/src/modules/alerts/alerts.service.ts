import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../shared/database/connection';
import { alerts, vehicles, maintenances, documents } from '../../shared/database/schema';
import { VehiclesRepository } from '../vehicles/vehicles.repository';

const vehiclesRepo = new VehiclesRepository();

export class AlertsService {
  async getAlerts(userId: string, unreadOnly = false) {
    let query = db.select().from(alerts)
      .where(and(
        eq(alerts.userId, userId),
        eq(alerts.isDismissed, false),
        ...(unreadOnly ? [eq(alerts.isRead, false)] : [])
      ))
      .orderBy(desc(alerts.createdAt));
    return query;
  }

  async markRead(id: string, userId: string) {
    const result = await db.update(alerts)
      .set({ isRead: true })
      .where(and(eq(alerts.id, id), eq(alerts.userId, userId)))
      .returning();
    return result[0];
  }

  async markAllRead(userId: string) {
    await db.update(alerts)
      .set({ isRead: true })
      .where(and(eq(alerts.userId, userId), eq(alerts.isRead, false)));
  }

  async dismiss(id: string, userId: string) {
    const result = await db.update(alerts)
      .set({ isDismissed: true })
      .where(and(eq(alerts.id, id), eq(alerts.userId, userId)))
      .returning();
    return result[0];
  }

  async generateAlerts(userId: string) {
    const userVehicles = await db.select().from(vehicles)
      .where(and(eq(vehicles.userId, userId), eq(vehicles.isActive, true)));

    for (const vehicle of userVehicles) {
      await this.generateVehicleAlerts(vehicle, userId);
    }
  }

  private async generateVehicleAlerts(vehicle: typeof vehicles.$inferSelect, userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check upcoming documents
    const vehicleDocs = await db.select().from(documents)
      .where(and(eq(documents.vehicleId, vehicle.id), eq(documents.status, 'active')));

    for (const doc of vehicleDocs) {
      if (!doc.expiryDate) continue;
      const expiry = new Date(doc.expiryDate);
      const daysUntil = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntil > 30) continue;

      const severity = daysUntil < 0 ? 'critical' : daysUntil <= 7 ? 'urgent' : 'warning';
      const typeMap: Record<string, typeof alerts.$inferInsert.type> = {
        insurance: 'insurance', ipva: 'ipva', licensing: 'licensing',
      };
      const alertType = typeMap[doc.type] ?? 'custom';

      const existing = await db.select().from(alerts)
        .where(and(
          eq(alerts.vehicleId, vehicle.id),
          eq(alerts.referenceId, doc.id),
          eq(alerts.isDismissed, false)
        ))
        .limit(1);

      if (!existing.length) {
        await db.insert(alerts).values({
          vehicleId: vehicle.id,
          userId,
          type: alertType,
          title: `${doc.title} vence em ${daysUntil < 0 ? 'atraso' : `${daysUntil} dias`}`,
          description: daysUntil < 0
            ? `O documento ${doc.title} venceu há ${Math.abs(daysUntil)} dias.`
            : `O documento ${doc.title} vence em ${daysUntil} dias.`,
          severity,
          triggerDate: doc.expiryDate,
          referenceId: doc.id,
          referenceType: 'document',
        });
      }
    }

    // Check maintenances by km
    const vehicleMaint = await db.select().from(maintenances)
      .where(and(
        eq(maintenances.vehicleId, vehicle.id),
        eq(maintenances.status, 'completed')
      ));

    for (const maint of vehicleMaint) {
      if (!maint.nextServiceKm) continue;
      const kmUntil = maint.nextServiceKm - vehicle.currentKm;
      if (kmUntil > 2000) continue;

      const severity = kmUntil <= 0 ? 'critical' : kmUntil <= 500 ? 'urgent' : 'warning';
      const typeMap: Record<string, typeof alerts.$inferInsert.type> = {
        oil_change: 'oil_change', rotation: 'rotation', general_revision: 'revision',
        timing_belt: 'timing_belt',
      };
      const alertType = typeMap[maint.category] ?? 'custom';
      const catLabels: Record<string, string> = {
        oil_change: 'Troca de óleo', rotation: 'Rodízio', general_revision: 'Revisão',
        timing_belt: 'Correia dentada',
      };
      const label = catLabels[maint.category] ?? 'Manutenção';

      const existing = await db.select().from(alerts)
        .where(and(
          eq(alerts.vehicleId, vehicle.id),
          eq(alerts.referenceId, maint.id),
          eq(alerts.isDismissed, false)
        ))
        .limit(1);

      if (!existing.length) {
        await db.insert(alerts).values({
          vehicleId: vehicle.id,
          userId,
          type: alertType,
          title: kmUntil <= 0 ? `${label} atrasada` : `${label} em ${kmUntil} km`,
          description: kmUntil <= 0
            ? `${label} estava prevista para ${maint.nextServiceKm.toLocaleString('pt-BR')} km.`
            : `${label} prevista para ${maint.nextServiceKm.toLocaleString('pt-BR')} km (faltam ${kmUntil} km).`,
          severity,
          triggerKm: maint.nextServiceKm,
          referenceId: maint.id,
          referenceType: 'maintenance',
        });
      }
    }
  }
}
