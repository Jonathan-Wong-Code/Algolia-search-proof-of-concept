import algoliasearch from 'algoliasearch/lite';
import qs, { ParsedQs } from 'qs';
import { useState } from 'react';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  Stats,
  SortBy,
  Pagination,
  Configure,
  connectHitInsights,
} from 'react-instantsearch-dom';
import React from 'react';
import 'instantsearch.css/themes/algolia.css';
import { useHistory, RouteChildrenProps } from 'react-router-dom';

let userToken = '';

//@ts-ignore
window.aa('getUserToken', null, (err, algoliaUserToken) => {
  if (err) {
    console.error(err);
    return;
  }

  userToken = algoliaUserToken;
});

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

const Hit = ({ hit, insights }: any) => {
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
      <button
        onClick={() =>
          insights('clickedObjectIDsAfterSearch', {
            eventName: 'Product Clicked',
          })
        }
      >
        See details
      </button>
    </div>
  );
};

//@ts-ignore
const HitWithInsights = connectHitInsights(window.aa)(Hit);

const MainContent = () => (
  <div>
    <h2>Results</h2>
    <div className='info'>
      <Stats />
      <SortBy defaultRefinement='sortby_replica' items={sortByItems} />
    </div>
  </div>
);

interface ISearchStateObject {
  query: string;
  page: number;
}

const createURL = (state: ISearchStateObject) => `?${qs.stringify(state)}`;
const searchStateToUrl = (searchState: ISearchStateObject): string => {
  return searchState ? `${createURL(searchState)}` : '';
};

const urlToSearchState = ({ search }: { search: string }) =>
  qs.parse(search.slice(1));

const App = ({ location }: RouteChildrenProps) => {
  const history = useHistory();
  const [searchState, setSearchState] = useState<ParsedQs | ISearchStateObject>(
    urlToSearchState(location)
  );

  const onSearchStateChange = (updatedSearchState: ISearchStateObject) => {
    setTimeout(() => {
      history.push({
        pathname: location.pathname,
        search: searchStateToUrl(updatedSearchState),
      });
    }, DEBOUNCE_TIME);

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
      <Hits hitComponent={HitWithInsights} />
      <Pagination showLast />
      <Configure clickAnalytics />
    </InstantSearch>
  );
};

export default App;
