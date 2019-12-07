import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Immutable from 'immutable';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NewPosting from '../components/NewPosting';
import { Link } from 'react-router-dom';
import DeletePic from '../delete.png';
import EditPic from '../edit.png';

const Title = styled.h2`
  text-align: center;
  color: #374068;
`;

const View = styled.div`
  margin: 30px 160px;
  border-radius: 50px;
  // background-color: #d1e1ed;
  background-color: #edf2f2;
  padding: 30px 30px;
  border: 3px solid #a6e1e3;
`;

const Edit = styled.div`
  margin: 10px 160px;
  border-radius: 50px;
  color: #374068;
  padding: 30px 30px;
  border: 3px solid #a2dadb;
`;

const EditDiv = styled.div`
  margin-left: 30px;
  margin-right: 30px;
`;

const Detail = styled.div`
  padding: 10px 10px;
  border-radius: 8px;
  background-color: #ffffff;
  margin-top: 8px;
  margin-left: 30px;
  margin-right: 30px;
`;

const NewInput = styled.input`
  background-color: #ebebeb;
  width: 100%;
  padding: 7px 7px;
  border: none;
  border-radius: 4px;
  cursor: pointers;
`;

const NewSelect = styled.select`
  background-color: #ebebeb;
  color: #737373;
  width: 100%;
  height: 35px;
  border: none;
  text-align: center;
  display: inline-block;
  border-radius: 4px;
  box-sizing: border-box;
`;

const DeleteButton = styled.button`
  width: 50px;
  height: 40px;
  background-color: #9dc9c9;
  border: none;
  border-radius: 30px;
`;

const Delete = styled.img`
  border: auto;
  width: 20px;
  height: 20px;
`;

const EditButton = styled.button`
  width: 50px;
  height: 40px;
  background-color: #9dc9c9;
  border: none;
  border-radius: 30px;
`;

const Editor = styled.img`
  border: auto;
  width: 20px;
  height: 20px;
`;

const ButtonBar = styled.div`
  text-align: center;
`;

const EditButtonBar = styled.div`
  text-align: right;
`;

const ItemButton = styled.button`
  border: none;
  font-size: 13px;
  height: 30px;
  border: 1px solid #cacecf;
  border-radius: 30px;
`;

const MyPostings = ({ ifLoggedIn }) => {
  const [myListings, setMyListings] = useState(Immutable.List());
  const [mode, setMode] = useState('view');
  const [currentListing, setCurrentListing] = useState();
  const [title, setTitle] = useState(
    currentListing ? currentListing.title : ''
  );
  const [isbn, setISBN] = useState(currentListing ? currentListing.ISBN : '');
  const [id, setID] = useState(currentListing ? currentListing.id : '');
  const [courseID, setCourseID] = useState(
    currentListing ? currentListing.courseID : ''
  );
  const [condition, setCondition] = useState(
    currentListing ? currentListing.condition : ''
  );
  const [price, setPrice] = useState(
    currentListing ? currentListing.price : ''
  );
  const [comments, setComments] = useState(
    currentListing ? currentListing.comments : ''
  );

  const constructListing = () => ({
    id: id,
    userID: currentListing.userID,
    ISBN: isbn,
    condition: condition,
    price: price,
    comments: comments,
    edited: new Date().toLocaleString()
  });

  const constructBook = () => ({
    ISBN: isbn,
    courseID: courseID,
    title: title
  });

  const updateEditedListng = () =>
    fetch(`/api/MyPostings/Listing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(constructListing()),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const updatedListings = myListings.map(item => {
          if (item.ISBN === data.ISBN) {
            return data;
          }
          return item;
        });
        setMyListings(updatedListings);
      })
      .catch(err => console.log(err));

  const updateEditedBook = () =>
    fetch(`/api/MyPostings/Book/${isbn}`, {
      method: 'PUT',
      body: JSON.stringify(constructBook()),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const updatedBooks = myListings.map(item => {
          if (item.ISBN === data.ISBN) {
            return data;
          }
          return item;
        });
        setMyListings(updatedBooks);
      })
      .catch(err => console.log(err));

  useEffect(() => {
    fetch('/api/MyPostings/')
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then(data => {
        setMyListings(Immutable.List(data));
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }, []);

  if (myListings.isEmpty() || ifLoggedIn === false) {
    return (
      <div>
        <Title>My Postings</Title>
        <View>
          <p align="center">You have not posted anything yet.</p>
          {ifLoggedIn && (
            <Route
              render={() => (
                <div>
                  <ButtonBar>
                    <ItemButton>
                      <Link to={'newPosting'} id="newPosting">
                        Create New Posting
                      </Link>
                    </ItemButton>
                  </ButtonBar>
                </div>
              )}
            />
          )}
        </View>
        <Router>
          <Switch>
            <Route
              exact
              path="/newPosting"
              component={() => <NewPosting ifPosting={'postingView'} />}
            />
          </Switch>
        </Router>
      </div>
    );
  } else {
    let listingItems = null;
    listingItems = myListings.map(listing => (
      <div>
        {mode === 'view' && (
          <View>
            <Detail>
              <strong>&emsp;Book Title:</strong>&emsp;{` ${listing.title}`}
            </Detail>
            <Detail>
              <strong>&emsp;ISBN:</strong>&emsp;{` ${listing.ISBN}`}
            </Detail>
            <Detail>
              <strong>&emsp;Course ID:</strong>&emsp;
              {` ${listing.courseID}`}
            </Detail>
            <Detail>
              <strong>&emsp;Condition:</strong>&emsp;
              {` ${listing.condition}`}{' '}
            </Detail>
            <Detail>
              <strong>&emsp;Price:</strong>&emsp;{` $${listing.price}`}{' '}
            </Detail>
            <Detail>
              <strong>&emsp;Comments:</strong>&emsp;{` ${listing.comments}`}{' '}
            </Detail>
            <Detail>
              <strong>&emsp;Last Edited Time:</strong>&emsp;
              {` ${listing.edited}`}{' '}
            </Detail>
            <br />

            <ButtonBar>
              <DeleteButton
                onClick={() => {
                  if (
                    window.confirm('Are you sure you want to delete this post?')
                  ) {
                    fetch(`/api/MyPostings/${listing.id}`, {
                      method: 'DELETE'
                    })
                      .then(response => {
                        if (!response.ok) {
                          throw new Error(response.statusText);
                        }
                        const newListings = myListings.filter(
                          item => item !== listing
                        );
                        setMyListings(newListings);
                      })
                      .catch(err => console.log(err));
                    setCurrentListing();
                    setMode('view');
                  }
                }}
              >
                <Delete src={DeletePic} alt="Delete Posting" />
              </DeleteButton>
              &emsp;&emsp;&emsp;&emsp;
              <EditButton
                onClick={() => {
                  setMode('edit');
                  setCurrentListing(listing);
                  setID(listing.id);
                  setISBN(listing.ISBN);
                  setComments(listing.comments);
                  setPrice(listing.price);
                  setTitle(listing.title);
                  setCourseID(listing.courseID);
                }}
              >
                <Editor src={EditPic} alt="Edit Posting" />
              </EditButton>
            </ButtonBar>
          </View>
        )}

        {mode === 'edit' && currentListing.id === listing.id && (
          <Edit>
            <h4 align="center">Editing</h4>
            <EditDiv>
              <strong>Book Title:</strong>
              <NewInput
                type="text"
                id="title"
                value={title}
                placeholder={'Book title must be set'}
                onChange={event => setTitle(event.target.value)}
              />

              <strong>Course ID:</strong>
              <NewInput
                type="text"
                id="courseID"
                value={courseID}
                placeholder={'Course ID must be set'}
                onChange={event => setCourseID(event.target.value)}
              />

              <strong>Condition:</strong>
              <NewSelect
                defaultValue={condition}
                onChange={event => setCondition(event.target.value)}
              >
                <option>Condition must be selected here</option>
                <option value="New">New</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Acceptable">Acceptable</option>
                <option value="Very Worn">Very Worn</option>
                <option value="Bad">Bad</option>
              </NewSelect>

              <strong>Price:</strong>
              <NewInput
                type="text"
                id="price"
                value={price}
                placeholder={'Price must be set'}
                onChange={event => setPrice(event.target.value)}
              />

              <strong>Comments:</strong>
              <NewInput
                type="text"
                id="comments"
                value={comments}
                placeholder={'Additional comments...'}
                onChange={event => setComments(event.target.value)}
              />

              <br />
              <br />
              <EditButtonBar>
                <button
                  onClick={() => {
                    setMode('view');
                    setCurrentListing();
                  }}
                >
                  Cancel
                </button>
                &emsp;&emsp;
                <button
                  disabled={
                    title === '' ||
                    courseID === '' ||
                    price === '' ||
                    condition === ''
                  }
                  onClick={() => {
                    updateEditedListng();
                    updateEditedBook();
                    window.location.reload(false);
                    setCurrentListing();
                    setMode('view');
                  }}
                >
                  Save
                </button>
              </EditButtonBar>
            </EditDiv>
          </Edit>
        )}
      </div>
    ));

    return (
      <div>
        <Title>My Postings</Title>
        {listingItems}
      </div>
    );
  }
};

export default MyPostings;
