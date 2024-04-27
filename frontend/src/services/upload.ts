import { API_HOST } from '../config';
import { type IApiUploadFileResponse } from '../types';

export const uploadFile = async (
  file: File
): Promise<[Error | null, IApiUploadFileResponse?]> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${API_HOST}/api/files`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) return [new Error(`Error uploading file: ${res.statusText}`)];

    const data = (await res.json()) as IApiUploadFileResponse;
    return [null, data];
  } catch (error) {
    if (error instanceof Error) return [error];
  }

  return [new Error('Unknown error')];
};
