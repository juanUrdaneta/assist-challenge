import type { ChangeEvent } from 'react';

interface SearchBoxProps {
  value: string;
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const SearchBox = ({
  value,
  onChange,
  label,
  placeholder = 'Search...',
  disabled = false,
}: SearchBoxProps) => {
  return (
    <div className="relative flex flex-col items-start border-black w-full">
        <label htmlFor={label}>{label}</label>
        <div className='flex p-2 border-2 border-black rounded w-full'>

        <input
            type="search"
            value={value}
            name={label}
            onChange={onChange}
            className={`outline-0 w-full`}
            placeholder={placeholder}
            disabled={disabled}
            aria-label="Search"
            />
        </div>
    </div>
  );
};

export default SearchBox;
