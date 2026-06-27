import { DocumentType } from '../types/document.types';

export const documentTypeLabels: Record<DocumentType, string> = {
  insurance: 'Seguro',
  ipva: 'IPVA',
  licensing: 'Licenciamento',
  fine: 'Multa',
  inspection: 'Vistoria',
  crlv: 'CRLV',
  other: 'Outro',
};

export const documentTypeColors: Record<DocumentType, string> = {
  insurance: 'text-blue-500 bg-blue-500/10',
  ipva: 'text-green-500 bg-green-500/10',
  licensing: 'text-violet-500 bg-violet-500/10',
  fine: 'text-red-500 bg-red-500/10',
  inspection: 'text-orange-500 bg-orange-500/10',
  crlv: 'text-cyan-500 bg-cyan-500/10',
  other: 'text-gray-500 bg-gray-500/10',
};
