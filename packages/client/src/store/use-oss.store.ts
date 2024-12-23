import { OSS } from '@/common/lib/oss';
import { create } from 'zustand';

interface OssState {
  uploadImage: typeof OSS.prototype.upload;
  getImageUrl: typeof OSS.prototype.getImageUrl;
}

export const useOssStore = create<OssState>()(() => {
  const oss = new OSS();
  return {
    uploadImage: (file: File | Blob, key?: string): Promise<string> =>
      oss.upload(file, key),
    getImageUrl: (key: string): string => oss.getImageUrl(key),
  };
});
