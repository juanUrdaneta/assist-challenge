import { useState, useCallback } from 'react';

const BASE_URL = 'https://3ccfrjulc8.execute-api.us-west-1.amazonaws.com/dev/reservasHandler';

export interface PaginatedResponse {
    resultados: {reserva:string,
      pasajero: string,
      destino: string,
      estado: string
      fecha_regreso:  string
}[]
  total: number;
  page: number;
  pageSize: number;
}

interface SearchParams {
  passenger: string;
  bookingCode: string;
  pageSize?: number;
  page?: number;
}

interface UsePaginatedFetchResult {
  data: PaginatedResponse['resultados'];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (params: SearchParams) => Promise<void>;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
  refresh: (params: SearchParams) => Promise<void>;
  search: (params: SearchParams) => Promise<void>;
}

const usePaginatedFetch = (): UsePaginatedFetchResult => {
  const [data, setData] = useState<PaginatedResponse['resultados']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentParams, setCurrentParams] = useState<SearchParams>({
    passenger: '',
    bookingCode: '',
    pageSize: 5,
    page: 1
  });

  const fetchData = useCallback(async ( { passenger, bookingCode, page, pageSize }: SearchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}?page=${page ?? 1}&pageSize=${pageSize ?? 5}&pasajero=${passenger}&reserva=${bookingCode}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PaginatedResponse = await response.json();
      
      setData(result.resultados);
      setTotalPages(Math.ceil(result.total / result.pageSize));
      setTotalItems(result.total);
      setCurrentPage(result.page);
      setCurrentParams({ passenger, bookingCode, pageSize, page });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching data'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const goToPage = useCallback(async (params: SearchParams) => {
    const page = params.page ?? 1;
    if (page < 1 || (totalPages > 0 && page > totalPages)) {
      return;
    }
    await fetchData({...params, page: params.page ?? 1, pageSize: params.pageSize ?? 5});
  }, [fetchData, totalPages]);

  const goToNextPage = useCallback(async () => {
    if (currentPage < totalPages) {
      await goToPage({...currentParams, page: currentPage + 1});
    }
  }, [currentPage, totalPages, goToPage, currentParams]);

  const goToPreviousPage = useCallback(async () => {
    if (currentPage > 1) {
      await goToPage({...currentParams, page: currentPage - 1});
    }
  }, [currentPage, currentParams, goToPage]);

  const refresh = useCallback(async () => {
    await fetchData(currentParams);
  }, [fetchData, currentParams]);

  const search = useCallback(async ({...params}: SearchParams) => {
    await fetchData(params);
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    refresh,
    search
  };
};

export default usePaginatedFetch; 