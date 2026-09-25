export const customStyles = {
    valueContainer: (provided) => ({
      ...provided,
      maxHeight: '30px',
      overflowY: 'auto',
      padding: '0',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 49,
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#003F70 !important',
      borderRadius: 16,
      overflow: 'hidden',
      gap: 6,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white !important',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white !important',
      borderRadius: 0,
      ':hover': {
        backgroundColor: '#FFBDAD',
        color: '#DE350B !important',
      },
    }),
  };