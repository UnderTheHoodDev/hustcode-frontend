import { axiosInstance } from '@/api/guest';
import { Language } from '@/types/language';

const getLanguages = async (): Promise<Language[]> => {
  const response = await axiosInstance.get<Language[]>('/language');
  return response.data;
};

export { getLanguages };

