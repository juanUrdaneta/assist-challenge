import { useCallback, useState } from 'react';
import './App.css'
import SearchBox from './components/SearchBox'
import usePaginatedFetch from './hooks/usePaginatedFetch';
import ResultList from './components/resultList';

function App() {

  const [bookingCode, setBookingCode] = useState('');
  const [passenger, setPassenger] = useState('');

  const {search, data, isLoading, error, currentPage, totalPages, goToPreviousPage, goToNextPage} = usePaginatedFetch();

  const handleSearch = useCallback(() => {
    search({bookingCode, passenger});
  }, [search, bookingCode, passenger]);

  return (
    <div className='flex justify-center w-screen max-w-full'>
      <main className='flex flex-row w-full gap-4'>
        <div className='flex flex-col gap-4 w-[500px]'>
          <h1 className='text-4xl font-bold'>Search bookings</h1>
          <SearchBox value={bookingCode} onChange={(e) => setBookingCode(e.target.value)} label='Booking code'/>
          <SearchBox value={passenger} onChange={(e) => setPassenger(e.target.value)} label='Name'/>
          <button className='bg-blue-500 text-white p-2 rounded' onClick={()=>handleSearch()}>Search</button>
        </div>
        <div className='flex flex-col w-full'>
          <ResultList isLoading={isLoading} error={error?.message} results={data} totalPages={totalPages} currentPage={currentPage} goToPreviousPage={goToPreviousPage} goToNextPage={goToNextPage}/>
        </div>
      </main>
    </div>
  )
}

export default App
