import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

import UserInfoContext from '../utils/UserInfoContext';
import AuthService from '../utils/auth';

function AppNavbar() {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  // get username out of context object to display in nav
  const { username } = useContext(UserInfoContext);

  return (
    <>
      <Navbar  className="color-nav" variant="white" expand='lg'>
        <Container fluid>
          <Navbar.Brand as={Link} to='/'>
            Movie Search
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar'>
            <Nav className='ml-auto'>
              <Nav.Link  as={Link} to='/search'>
                Search For Movies
              </Nav.Link>
              <Nav.Link as={Link} to='/'>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to='/new'>
                New Movies
              </Nav.Link>
              <Nav.Link as={Link} to='/popular'>
                Popular Movies
              </Nav.Link>
              <Nav.Link as={Link} to='/toprated'>
                Top Rated Movies
              </Nav.Link>
              <Nav.Link as={Link} to='/tvshows'>
                TV Shows
              </Nav.Link>
              {/* if user is logged in show saved movies and logout */}
              {username ? (
                <>
                  <Nav.Link as={Link} to='/saved'>
                    See {username}'s Watchlist
                  </Nav.Link>
                  <Nav.Link onClick={AuthService.logout}>Logout</Nav.Link>
                </>
              ) : (
                  <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
                )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)} aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
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
