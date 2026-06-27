export type DocumentType = 'insurance' | 'ipva' | 'licensing' | 'fine' | 'inspection' | 'crlv' | 'other';
export type DocumentStatus = 'active' | 'expired' | 'cancelled';
export type ExpiryStatus = 'expired' | 'critical' | 'warning' | 'ok';

export interface Document {
  id: string;
  vehicleId: string;
  type: DocumentType;
  title: string;
  issuer?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  value?: string | null;
  status: DocumentStatus;
  fileUrl?: string | null;
  notes?: string | null;
  daysUntilExpiry?: number | null;
  expiryStatus?: ExpiryStatus | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentPayload {
  type: DocumentType;
  title: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  value?: number;
  status?: DocumentStatus;
  notes?: string;
}
