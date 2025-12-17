import { useQuery } from '@tanstack/react-query';

import { getLanguages } from '@/lib/api/language';
import { Language } from '@/types/language';

const useLanguagesQuery = () => {
  const query = useQuery<Language[]>({
    queryKey: ['languages'],
    queryFn: getLanguages,
    staleTime: Infinity, // Languages don't change often
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useLanguagesQuery;

