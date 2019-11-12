import React, { useState, useEffect } from 'react';
import './App.css';
import styled from 'styled-components';
import SearchBar from './components/SearchBar';
import Listings from './components/Listings';
import SortBar from './components/SortBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//import Immutable from 'immutable';   // need to do "npm install immutable

/* eslint-disable react/prefer-stateless-function */
const Title = styled.h1`
  text-align: center;
`;

function App() {
  const [sortType, setSortType] = useState('');
  const [listings, setListings] = useState([]);
  const [ascending, setDirection] = useState(true);
  const [currentBook, setBook] = useState(null);

  useEffect(() => {
    fetch('/api/listings/')
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setListings(data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <Router>
      <div>
        <Title>Midd Book Market</Title>
        <Switch>
          <Route
            path="/:id"
            component={() => (
              <div>
                <Listings
                  currentListings={listings}
                  searchTerm={currentBook}
                  mode={'detailed'}
                />
              </div>
            )}
          />
          <Route
            component={() => (
              <div>
                <SearchBar
                  setBook={book => setBook(book)}
                  currentBook={currentBook}
                />

                <SortBar
                  listings={listings}
                  setListings={setListings}
                  sortType={sortType}
                  setSortType={setSortType}
                  ascending={ascending}
                  flipDirection={() => setDirection(!ascending)}
                />

                <Listings
                  currentListings={listings}
                  searchTerm={currentBook}
                  mode={'general'}
                />
              </div>
            )}
          />
        </Switch>
      </div>
    </Router>
    // <Router>
    //   <div>
    //     <Title>Midd Book Market</Title>
    //     <SearchBar setBook={book => setBook(book)} currentBook={currentBook} />

    // <SortBar
    //   listings={listings}
    //   setListings={setListings}
    //   sortType={sortType}
    //   setSortType={setSortType}
    //   ascending={ascending}
    //   flipDirection={() => setDirection(!ascending)}
    // />
    //     <Listings currentListings={listings} searchTerm={currentBook} />
    //   </div>
    // </Router>
  );
}

export default App;
