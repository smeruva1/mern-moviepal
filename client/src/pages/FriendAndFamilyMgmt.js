import React, { useState, useContext, useEffect } from 'react';
import { Container, Button, Card, Row, Col, Form, Jumbotron, Table, InputGroup } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// import context for global state
import UserInfoContext from '../utils/UserInfoContext';

import * as API from '../utils/API';
import AuthService from '../utils/auth';
import MoviePosterPlaceHolder from '../images/MoviePosterPlaceHolder.png';

function SavedMovies() {
  // get whole userData state object from App.js
  const userData = useContext(UserInfoContext);

  //To store user names and id's
  const [allUsers, setallUsers] = useState([]);

  // const [allFriends, setallFriends] = useState([]);
  // const [allFamily, setallFamily] = useState([]);


  useEffect(() => {

    API.getAllUsers()
      .then(({ data }) => {
        console.log(data);
        const userInfo = data.map((user) => ({
          id: user.id,
          username: user.username
        }));
        return setallUsers(userInfo);
      })
      .catch((err) => console.log(err));

  }, [])


  // const handleFormSubmit = (event) => {
  //   event.preventDefault();

    // if (!searchInput) {
    //   return false;
    // }
  // }



  // create function to handle saving a family or friend to logged in user
  const handleSaveUserNetwork = (event, id, radioBtnValue) => {

    event.preventDefault();

    console.log(id);
    console.log(radioBtnValue);

    // const movieToSave = searchedMovies.find((movie) => movie.id === id);
    // console.log(movieToSave);
    // get token
    const token = AuthService.loggedIn() ? AuthService.getToken() : null;

    if (!token) {
      return false;
    }

    // send the friends and family data to our api

    if (radioBtnValue === "family") {

      API.saveFamily(id, token)
        .then(() => userData.getUserData())
        .catch((err) => console.log(err));

    } else if (radioBtnValue === "friend") {

      API.saveFriend(id, token)
        .then(() => userData.getUserData())
        .catch((err) => console.log(err));

    }

  };





  return (
    <>
      <br></br>
      <Container fluid="md" style={{ backgroundColor: "#2F2F4F", color: "white", opacity: "0.9" }}>
        <br></br>
        <Jumbotron style={{ margin: "10px" }}>
          <Form>
            <Table bordered hover striped responsive='md' >
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Family</th>
                  <th>Friend</th>
                  <th>Unassigned</th>
                </tr>
              </thead>
              <tbody>

                {allUsers.filter((user) => {
                  return user.username != userData.username;
                }).map((user, idx) => {
                  return (
                    <tr key={user.id}>
                      <td>{idx + 1}</td>
                      <td>{user.username}</td>
                      <td>
                        <label className="radio-inline"><input type="radio" name="networkRadio" value="family"
                          checked={userData.family?.some((savedFamily) => savedFamily == user.id)}
                        /></label>
                      </td>


                      {/* <td>
                        <label className="radio-inline"><input type="radio" name="networkRadio" /></label>
                        </td> */}

                      <td>
                        <label className="radio-inline"><input type="radio" name="networkRadio" value="friend"
                          checked={userData.friends?.some((savedFriend) => savedFriend == user.id)}
                        /></label>
                      </td>


                      {/* <td>
                          <label className="radio-inline"><input type="radio" name="networkRadio" /></label>
                        </td> */}

                      <td>
                        <label className="radio-inline"><input type="radio" name="networkRadio" value="none"
                        //  checked = {userData.friend?.some((savedFriend) => savedFriend ==user.id)}

                        /></label>
                      </td>


                      <td>
                        <Button type="submit" size="lg" block
                          //onClick={() => handleSaveUserNetwork(user.id, networkRadio.value)}>Save</Button>
                          onClick={() => handleSaveUserNetwork(user.id, "family")}>Save</Button>
                      </td>
                    </tr>
                  );

                })}

              </tbody>
            </Table>
          </Form>
        </Jumbotron>
        <br></br>
      </Container>
      {/* 
  <br></br>
      <Container fluid="md">

        <Row>
          <Col sm>

            <ListGroup>
              <ListGroup.Item style={{ backgroundColor: "#2F2F4F", color: "white", opacity: "0.9" }}>My Friends</ListGroup.Item>
              {userData.friends.map((friend) => {
                return (
                  <ListGroup.Item style={{ backgroundColor: "white", color: "grey", opacity: "0.9" }}>
                    {allUsers?.some((allUser) => allUser.id == friend)
                      ? allUsers?.find((allUser) => allUser.id == friend).username
                      : null}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>

          <Col sm>
            <ListGroup>
              <ListGroup.Item style={{ backgroundColor: "#2F2F4F", color: "white", opacity: "0.9" }}>My Family</ListGroup.Item>
              {userData.family.map((family) => {
                return (
                  <ListGroup.Item style={{ backgroundColor: "white", color: "grey", opacity: "0.9" }}>
                    {allUsers?.some((allUser) => allUser.id == family)
                      ? allUsers?.find((allUser) => allUser.id == family).username
                      : null}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      </Container>

      <br></br>
      <Container>
        <h3>
          {userData.savedMovies.length
            ? `Viewing ${userData.savedMovies.length} saved ${userData.savedMovies.length === 1 ? 'movie' : 'movies'}:`
            : 'You have no saved movies!'}
        </h3>
      </Container>
 */}
    </>
  );
}

export default SavedMovies;