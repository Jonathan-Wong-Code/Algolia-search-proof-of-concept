import algoliasearch from 'algoliasearch/lite';
import qs from 'qs';
import { useState } from 'react';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  Stats,
  SortBy,
  Pagination,
} from 'react-instantsearch-dom';
import React from 'react';
import 'instantsearch.css/themes/algolia.css';
import { useHistory } from 'react-router-dom';

const DEBOUNCE_TIME = 400;

const searchClient = algoliasearch(
  'QHMAVO91S2', // App ID
  'e32e5c7769c688d52d37bd88e72fb449' // Public Search Key
);

// Sorting requires a separate index for each sorting option.
const sortByItems = [
  {
    value: 'demo_ecommerce',
    label: 'Most Relevant',
  },
  {
    value: 'sortby_replica_price_desc',
    label: 'Highest Price',
  },
];

const Hit = ({ hit }: any) => {
  return (
    <div>
      <h3>
        <Highlight attribute='name' hit={hit} tagName='mark' />
      </h3>
      <p>
        <Highlight attribute='description' hit={hit} tagName='mark' />
      </p>
      <p>Price: {hit.price}</p>
      <img src={hit.image} alt={hit.description} />
    </div>
  );
};

const MainContent = () => (
  <div>
    <h2>Results</h2>
    <div className='info'>
      <Stats />
      <SortBy defaultRefinement='sortby_replica' items={sortByItems} />
    </div>
  </div>
);

//@ts-ignore
const createURL = (state) => `?${qs.stringify(state)}`;
//@ts-ignore
const searchStateToUrl = (searchState) => {
  return searchState ? `${createURL(searchState)}` : '';
};

//@ts-ignore

const urlToSearchState = ({ search }) => qs.parse(search.slice(1));
//@ts-ignore

const App = ({ location }) => {
  const history = useHistory();
  const [searchState, setSearchState] = useState(urlToSearchState(location));
  const [debouncedSetState, setDebouncedSetState] = useState(null);
  //@ts-ignore

  const onSearchStateChange = (updatedSearchState) => {
    //@ts-ignore
    clearTimeout(debouncedSetState);
    //@ts-ignore
    setDebouncedSetState(
      //@ts-ignore
      setTimeout(() => {
        //@ts-ignore
        history.push({
          pathname: location.pathname,
          search: searchStateToUrl(updatedSearchState),
        });
      }, DEBOUNCE_TIME)
    );

    setSearchState(updatedSearchState);
  };

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName='demo_ecommerce'
      searchState={searchState}
      onSearchStateChange={onSearchStateChange}
      createURL={createURL}
    >
      <SearchBox />
      <MainContent />
      <Hits hitComponent={Hit} />
      <Pagination showLast />
    </InstantSearch>
  );
};

export default App;
