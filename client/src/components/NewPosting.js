import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

const InputLine = styled.input`
  text-align: left;
  width: 30%;
  height: 15px
  border-radius: 25px;
  border: 2px solid;
  margin: 8px 0;
`;

const InputSelect = styled.select`
  text-align: center;
  position: relative;
  display: inline;
`;

const InputLineContainer = styled.div`
  text-align: left;
  padding: 5px;
`;

const InputType = styled.span`
  text-align: left;
`;

const WholeContainer = styled.form`
  text-align: center;
`;

const InputComments = styled.textarea`
  margin: 10px 0px;
  display: block;
`;

const Required = styled.span`
  color: red;
`;

const SubmitButton = styled.button``;

const BackButton = styled.button``;

const newPosting = ({ ifPosting }) => {
  const postingInfo = {
    author: '',
    userID: 0,
    courseID: '',
    courseTitle: '',
    ISBN: '',
    title: '',
    price: '',
    condition: 'New',
    comments: 'None'
  };
  const [allInfo, setAllInfo] = useState(postingInfo);
  const [filledOut, setFilledOut] = useState(false);
  const [countInput, setCountInput] = useState(0);

  // Should require price, ISBN, something else? to be a number
  // Dont need name if have accounts?

  const makeInput = (inputType, clientQuery, placeholder) => {
    return (
      <InputLineContainer>
        <InputType> {`${clientQuery}`}:</InputType>
        <Required>* </Required>
        <InputLine
          type="text"
          placeholder={`${placeholder}`}
          onChange={event => {
            postingInfo[inputType] = event.target.value;
            setAllInfo(postingInfo);
            // If there is some text in the input
            if (allInfo[inputType].length > 0) {
              setCountInput(countInput + 1);
            }
            // if there is no text in the input
            else {
              setCountInput(countInput - 1);
            }
          }}
          required
        />
      </InputLineContainer>
    );
  };

  const DisplayPopup = () => {
    return (
      <div>
        {'Please confirm that this information is correct \n'}

        <p>
          <b>{'Book Title: '}</b> {`${allInfo.title}`}
          <br />
          <b>{'Book Author: '}</b> {`${allInfo.author}`}
          <br />
          <b>{'Course Title: '}</b> {`${allInfo.courseTitle}`}
          <br />
          <b>{'ISBN Number: '}</b> {`${allInfo.ISBN}`}
          <br />
          <b>{'Course Code: '}</b> {`${allInfo.courseID}`}
          <br />
          <b>{'Condition: '}</b> {`${allInfo.condition}`}
          <br />
          <b>{'Price: '}</b> {`${allInfo.price}`}
          <br />
          <b>{'Comments: '}</b> {`${allInfo.comments}`}
          <br />
        </p>

        {'Click out of the box to cancel'}
      </div>
    );
  };

  const submitFunction = () => {
    return alert('this is an alert');
  };

  if (ifPosting === 'general') {
    return <div />;
  } else if (ifPosting === 'postingView') {
    // maybe if we have a problem with price being a string vs int
    //<InputLineContainer>
    // <InputType> Price: </InputType>
    // <InputLine
    //   type="text"
    //   placeholder={'5'}
    //   onChange={event => {
    //     postingInfo.price = parseInt(event.target.value);
    //     setAllInfo(postingInfo);
    //   }}
    // />
    //</InputLineContainer>

    return (
      <WholeContainer
        action=""
        onsubmit={() => {
          submitFunction();
        }}
      >
        <h2>Create a new posting</h2>
        <BackButton>
          <Link to={''} id="">
            Back to Main Page
          </Link>
        </BackButton>
        <br />
        <Required text-align="left">*</Required>
        <span text-align="left">Required Field</span>
        <br />
        {makeInput(
          'title',
          'Book Title',
          'The Guide to the Dr. and Everything React'
        )}
        {makeInput('author', 'Book Author', 'Christopher Andrews')}
        {makeInput('courseTitle', 'Course title', 'Software Development')}
        {makeInput('ISBN', 'ISBN number', '123-4-567-89012-3')}
        <div>
          {' '}
          <i>
            This can be found either on the back cover of the book or on the
            inside information page along with the publisher info
          </i>{' '}
        </div>
        {makeInput('courseID', 'Course Code', 'CSCI 0312')}
        <InputLineContainer>
          <InputType> Condition:</InputType>
          <Required text-align="left">* </Required>
          <InputSelect
            onChange={event => {
              postingInfo.condition = event.target.value;
              setAllInfo(postingInfo);
              if (allInfo.Condition.length > 0) {
                setCountInput(countInput + 1);
              }
              // if there is no text in the input
              else {
                setCountInput(countInput - 1);
              }
            }}
            required
          >
            <option value="New">New</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Acceptable">Acceptable</option>
            <option value="Very Worn">Very Worn</option>
            <option value="Bad">Bad</option>
          </InputSelect>
        </InputLineContainer>

        {makeInput('price', 'Price', '5')}

        <InputLineContainer>
          <InputType> Any Additional Comments: </InputType>
          <InputComments
            cols="50"
            rows="10"
            placeholder="Any additional comments you have. Could include: highlighted, water-stained, never opened, missing pages..."
            onChange={event => {
              postingInfo.comments = event.target.value;
              setAllInfo(postingInfo);
            }}
          />
        </InputLineContainer>

        <InputLineContainer>
          <Popup
            trigger={
              <div>
                <SubmitButton
                  value="Submit"
                  onClick={() => {
                    if (countInput >= 7) {
                      setFilledOut(true);
                    } else {
                      setFilledOut(false);
                    }
                    return false;
                  }}
                >
                  Submit
                </SubmitButton>
              </div>
            }
            position="top left"
          >
            <div>
              <DisplayPopup />
              <input
                type="submit"
                value="confirm"
                onClick={() => {
                  fetch(`/api/newPosting/Listing`, {
                    method: 'POST',
                    body: JSON.stringify(postingInfo),
                    headers: new Headers({ 'Content-type': 'application/json' })
                  })
                    .then(response => {
                      if (!response.ok) {
                        throw new Error(response.status_text);
                      }
                      return response.json();
                    })
                    .then(updatedPosting => {
                      setAllInfo(updatedPosting);
                    })
                    .catch(err => console.log(err)); // eslint-disable-line no-console

                  fetch(`/api/newPosting/Book`, {
                    method: 'POST',
                    body: JSON.stringify(postingInfo),
                    headers: new Headers({ 'Content-type': 'application/json' })
                  })
                    .then(response => {
                      if (!response.ok) {
                        throw new Error(response.status_text);
                      }
                      return response.json();
                    })
                    .then(updatedPosting => {
                      setAllInfo(updatedPosting);
                    })
                    .catch(err => console.log(err)); // eslint-disable-line no-console

                  ifPosting = 'general';
                }}
              />
            </div>
          </Popup>
        </InputLineContainer>
      </WholeContainer>
    );
  }
};

export default newPosting;
