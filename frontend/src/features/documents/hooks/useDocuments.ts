import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsService } from '../services/documents.service';
import { CreateDocumentPayload } from '../types/document.types';

export const documentsKey = (vehicleId: string) => ['documents', vehicleId] as const;

export function useDocuments(vehicleId: string) {
  return useQuery({ queryKey: documentsKey(vehicleId), queryFn: () => documentsService.getAll(vehicleId), enabled: !!vehicleId });
}

export function useCreateDocument(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateDocumentPayload) => documentsService.create(vehicleId, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentsKey(vehicleId) }),
  });
}

export function useUpdateDocument(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateDocumentPayload> }) =>
      documentsService.update(vehicleId, id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentsKey(vehicleId) }),
  });
}

export function useDeleteDocument(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsService.delete(vehicleId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentsKey(vehicleId) }),
  });
}
