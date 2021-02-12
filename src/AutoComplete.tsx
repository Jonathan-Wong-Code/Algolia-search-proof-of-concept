import React, { useState } from 'react';
import { Highlight, connectAutoComplete } from 'react-instantsearch-dom';

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';

const AutoComplete = ({ currentRefinement, refine, hits }) => {
  const [value, setValue] = useState(currentRefinement);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = () => {
    refine(value);
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput id='search' value={value} onChange={onChange} />
      <ComboboxPopover>
        <ComboboxList>
          {hits.map(({ name }) => (
            <ComboboxOption key={name} value={name} />
          ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default connectAutoComplete(AutoComplete);
