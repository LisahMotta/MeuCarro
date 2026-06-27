import { useRef, useState } from 'react';
import { Camera, Loader2, Car } from 'lucide-react';
import { useUploadVehiclePhoto } from '../hooks/useVehicles';

interface Props {
  vehicleId: string;
  currentPhotoUrl?: string | null;
}

export function VehiclePhotoUpload({ vehicleId, currentPhotoUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl ?? null);
  const mutation = useUploadVehiclePhoto();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    mutation.mutate({ id: vehicleId, file });
  }

  return (
    <div className="relative group w-full h-52 bg-muted rounded-2xl overflow-hidden border border-border cursor-pointer"
      onClick={() => inputRef.current?.click()}
    >
      {preview ? (
        <img src={preview} alt="Foto do veículo" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <Car className="w-12 h-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Clique para adicionar foto</p>
        </div>
      )}

      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {mutation.isPending ? (
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Camera className="w-8 h-8 text-white" />
            <span className="text-white text-sm font-medium">Alterar foto</span>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
