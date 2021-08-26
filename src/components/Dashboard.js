import React, { useState, useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { AuthContext } from './Auth'
import { firestore } from "./database/firebase";
import firebaseApp from "./database/firebase";
import { Navbar, NavDropdown, Nav, Container, Tab, Tabs, Table, Image, InputGroup, FormControl } from 'react-bootstrap';



function DashBoard() {

  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [dataEvent, setDataEvent] = useState([]);
  const [todoList, setTodoList] = useState([]);


  useEffect(() => {
    const todoRef = firebaseApp.database().ref('room');
    todoRef.on('value', (snapshot) => {
      const todos = snapshot.val();
      const todoList = [];
      for (let id in todos) {
        todoList.push({ id, ...todos[id] });
      }
      setTodoList(todoList);
    });
  }, []);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <body>
      <Navbar bg="info" expand="lg">
        <Container>
          <Navbar.Brand href="/dashboard">
            Booking.com
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/dashboard">Home</Nav.Link>
              <Nav.Link href="/manager">จัดการห้องพัก</Nav.Link>
              <Nav.Link href="/manager">โปรโมชั่น</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link><button onClick={() => firebaseApp.auth().signOut()} class="btn btn-danger">ออกจากระบบ</button></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container" style={{ marginTop: '2%' }}>
        <center><h1 className="font-weight-bold" style={{ marginLeft: '2%' }}>Booking</h1></center>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">เลขห้อง</InputGroup.Text>
          <FormControl
            placeholder="กรอกเลขห้องที่จะเช็ค"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        {dataEvent.map((item, index) => {
          return (

            <tr
              key={index}
              style={
                index % 2 === 0 ? { backgroundColor: "lightgray" } : null
              }
            >
              <td scope="row">{item.id}</td>
              <td scope="row">{item.title}</td>
              <td scope="row">{item.detail}</td>
              <td scope="row">{item.nameCompany}</td>
              <td scope="row">{item.dateStart}</td>
              <td scope="row">{item.dateEnd}</td>
              <td scope="row">{item.category}</td>
            </tr>
          );
        })}
      </div>
    </body>
  );
}


export default DashBoard;