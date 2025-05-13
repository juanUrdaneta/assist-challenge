import type { PaginatedResponse } from '../hooks/usePaginatedFetch';

const ResultList = (
    props: {
        results: PaginatedResponse['resultados'];
        error?:string;
        isLoading: boolean;
        totalPages: number;
        currentPage: number;
        goToPreviousPage: () => void;
        goToNextPage: () => void;
    }
) => {
    if (props.isLoading) {
        return <div>Loading...</div>;
    }
    if (props.error) {
        return <div>Error: {props.error}</div>;
    }
    
  return (
    <div className='flex flex-col w-full gap-2'>
        {props.results.map((result) => (
            <div key={result.reserva} className='flex flex-row justify-between border-2 border-black rounded-md p-2'>
                <div className=' w-1/4'>{result.pasajero}</div>
                <div className=' font-bold w-1/4'>{result.reserva}</div>
                <div className='w-1/4'>{result.destino}</div>
                <div className={`font-bold w-1/4 ${result.estado !== 'activa' ? 'text-red-500' : 'text-green-500'}`}>{result.estado}</div>
            </div>
        ))}
        <div className='flex flex-row justify-start gap-2 items-center'>
            <button className='bg-blue-500 text-white p-2 rounded' onClick={() => props.goToPreviousPage()}>Previous</button>
            <button className='bg-blue-500 text-white p-2 rounded' onClick={() => props.goToNextPage()}>Next</button>
            <p>Page {props.currentPage} of {props.totalPages}</p>
        </div>
    </div>
  )
}

export default ResultList