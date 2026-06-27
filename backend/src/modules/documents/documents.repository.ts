import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from '../../shared/database/connection';
import { documents, NewDocument, Document } from '../../shared/database/schema';

export class DocumentsRepository {
  async findAllByVehicle(vehicleId: string): Promise<Document[]> {
    return db.select().from(documents)
      .where(eq(documents.vehicleId, vehicleId))
      .orderBy(asc(documents.expiryDate));
  }

  async findById(id: string, vehicleId: string): Promise<Document | undefined> {
    const result = await db.select().from(documents)
      .where(and(eq(documents.id, id), eq(documents.vehicleId, vehicleId)))
      .limit(1);
    return result[0];
  }

  async create(data: NewDocument): Promise<Document> {
    const result = await db.insert(documents).values(data).returning();
    return result[0];
  }

  async update(id: string, vehicleId: string, data: Partial<NewDocument>): Promise<Document> {
    const result = await db.update(documents)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(documents.id, id), eq(documents.vehicleId, vehicleId)))
      .returning();
    return result[0];
  }

  async delete(id: string, vehicleId: string): Promise<void> {
    await db.delete(documents)
      .where(and(eq(documents.id, id), eq(documents.vehicleId, vehicleId)));
  }

  async updateFile(id: string, vehicleId: string, fileUrl: string): Promise<Document> {
    const result = await db.update(documents)
      .set({ fileUrl, updatedAt: new Date() })
      .where(and(eq(documents.id, id), eq(documents.vehicleId, vehicleId)))
      .returning();
    return result[0];
  }
}
