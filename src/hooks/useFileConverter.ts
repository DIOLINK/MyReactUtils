import { useCallback, useState } from 'react';

type UseFileConverterReturn = {
  fileToBase64: (file: File) => Promise<string>;
  base64ToBlob: (base64: string, mimeType: string) => Blob;
  base64ToFile: (base64: string, filename: string, mimeType: string) => File;
  loading: boolean;
  error: string | null;
};

export const useFileConverter = (): UseFileConverterReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = useCallback(async (file: File): Promise<string> => {
    setLoading(true);
    setError(null);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => {
        setError('Error: With FileReader');
        reject(new Error('FileReader error'));
      };
      reader.readAsDataURL(file);
      setLoading(false);
    });
  }, []);

  const base64ToBlob = useCallback((base64: string, mimeType: string): Blob => {
    try {
      const byteString = atob(base64.split(',')[1] || base64);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.codePointAt(i) ?? 0;
      }
      return new Blob([ab], { type: mimeType });
    } catch (e) {
      setError('Error: To converter Base64 to Blob');
      throw e;
    }
  }, []);

  const base64ToFile = useCallback(
    (base64: string, filename: string, mimeType: string): File => {
      const blob = base64ToBlob(base64, mimeType);
      return new File([blob], filename, { type: mimeType });
    },
    [base64ToBlob]
  );

  return { fileToBase64, base64ToBlob, base64ToFile, loading, error };
};
