import React from "react";

export interface AutoCompletePlacesProps extends React.ComponentProps<"input"> {
  searchInputPlaceholder?: string;
  searchInputName?: string;
  onMyLocationClick?: () => void;
}

export const AutoCompletePlaces: React.FC<AutoCompletePlacesProps> = ({
  searchInputPlaceholder = "Search",
  searchInputName = "SearchAutoComplete",
  onMyLocationClick,
  ...inputProps
}) => {
  return (
    <div className="flex flex-col w-full mb-2">
      <input
        type="text"
        name={searchInputName}
        id={searchInputName}
        placeholder={searchInputPlaceholder}
        className="bg-inpu h-40 hover:bg-input-hover focus:bg-input-hover placeholder:text-text-tertiary w-full border p-2 focus:outline-none focus:ring-0 appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        {...inputProps}
      />
      {/* <button
        type='button'
        className='inline-flex h-10 w-10 justify-center rounded-full bg-white p-2 align-middle shadow-down ltr:ml-2 rtl:mr-2'
        onClick={onMyLocationClick}
        data-testid='TestId__MyLocationButton'
      >
        <img
          src={'/assets/cursor.png'}
          alt='cursor'
          className='w-full rotate-90'
        />
      </button> */}
    </div>
  );
};
