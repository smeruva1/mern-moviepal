import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navbar, Nav, Form, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

import UserInfoContext from '../utils/UserInfoContext';
import AuthService from '../utils/auth';
import LogoImages from '../images/MoviePal.PNG';


function AppNavbar() {

  const [showModal, setShowModal] = useState(false);
  const { username } = useContext(UserInfoContext);
  const [searchInput, setSearchInput] = useState('');
  const history = useHistory()
  //const [key, setKey] = useState('');

   //create method to search for movies and set state on form submit
  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }
  }


  return (
    <>
      <Navbar className="color-nav" variant="dark" collapseOnSelect expand='lg'>
        {/* <Container fluid> */}

        <Navbar.Brand as={Link} to='/'>
          <img
            src={LogoImages}
            // width="90"
            height="50"
            className="d-inline-block align-top logo"
            alt="moviepal logo"
          />
          {' '}
          <span>Enrich your movie list wisely</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">

          <Nav className='ml-auto'>
            <Nav.Link as={Link} to='/' eventKey='/' className="navbar__link" >
              Home
              </Nav.Link>
            <Nav.Link as={Link} to='/new' eventKey='/new' className="navbar__link" >
              New Movies
              </Nav.Link>
            <Nav.Link as={Link} to='/popular' eventKey='/popular' className="navbar__link">
              Popular Movies
              </Nav.Link>
            <Nav.Link as={Link} to='/toprated' eventKey='/toprated' className="navbar__link" >
              Top Rated Movies
              </Nav.Link>
            <Nav.Link as={Link} to='/tvshows' eventKey='/tvshows' className="navbar__link" >
              TV Shows
              </Nav.Link>

            {/* <Nav.Link as={Link} to='/search' eventKey='/search' className="navbar__link" > */}
            <Form inline onSubmit={handleFormSubmit}>            
              <Form.Control
                id="searchTextField"
                value={searchInput}
                onKeyPress={(event) => {
                  //   event.preventDefault();

                  if (event.charCode === 13) {
                    history.push(`/search?searchText=${searchInput}`)
                    setSearchInput('')
                  }
                }}
                onChange={(event) => setSearchInput(event.target.value)}
                type='text'
                placeholder='Search for a Movie'
              />
            </Form> 

            {/* if user is logged in show saved movies and logout */}
            {username ? (
              <>
                <Nav.Link as={Link} to='/saved' eventKey='/saved' className="navbar__link" >
                    {username}'s Watchlist
                </Nav.Link>
                 <Nav.Link as={Link} to='/mynetwork' eventKey='/mynetwork' className="navbar__link" >
                 {username}'s Network
                </Nav.Link>
                <Nav.Link onClick={AuthService.logout} className="navbar__link" >
                    Logout
                </Nav.Link>
              </>
            ) : (
                <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
              )}
          </Nav>

        </Navbar.Collapse>
        {/* </Container> */}
      </Navbar>

      {/* set modal data up */}
      <Modal size='md' show={showModal} onHide={() => setShowModal(false)} aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link className="login-signup-btn" eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="login-signup-btn" eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
}

export default AppNavbar;
