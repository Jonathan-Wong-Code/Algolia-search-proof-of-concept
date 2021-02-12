import React, { useState, useEffect } from 'react';
import { connectAutoComplete } from 'react-instantsearch-dom';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';

//@ts-ignore
const AutoComplete = ({
  //@ts-ignore
  currentRefinement,
  //@ts-ignore
  refine,
  //@ts-ignore
  hits,
  //@ts-ignore
  onValueSelected,
  //@ts-ignore
  onValueClear,
}) => {
  const [value, setValue] = useState(currentRefinement);
  const [showSelections, setShowSelections] = useState(false);

  useEffect(() => {
    refine(value);
  }, [value, refine]);

  const onChange = (e: React.ChangeEvent) => {
    // Ties the value to all of searchboxes stuff with refine like state URL

    //@ts-ignore
    setValue(e.target.value);
    //@ts-ignore
    onValueSelected(e.target.value);
    setShowSelections(true);
  };

  const handleSelect = (value: string) => {
    setValue(value);
    onValueSelected(value);
    setShowSelections(false);

    // send up value
  };

  //@ts-ignore
  const onSubmit = (e) => {
    e.preventDefault();
    console.log('hello?');
    onValueSelected(value);
    setShowSelections(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          id='search'
          value={value}
          onChange={onChange}
          autoComplete='off'
        />
        <ComboboxPopover>
          <ComboboxList>
            {showSelections &&
              hits.map(
                ({ name, objectID }: { name: string; objectID: string }) => (
                  <ComboboxOption key={objectID} value={name} />
                )
              )}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </form>
  );
};

export default connectAutoComplete(AutoComplete);
