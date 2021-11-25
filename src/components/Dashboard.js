import React, { useState, useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { AuthContext } from './Auth'
import { firestore } from "./database/firebase";
import firebaseApp from "./database/firebase";
import { Navbar, Button, Nav, Container, Card, Modal, Form, Image, InputGroup, FormControl } from 'react-bootstrap';



function DashBoard() {

  const { currentUser } = useContext(AuthContext);
  const [dataRoom, setDataRoom] = useState([]);

  const [showDataRoom, setShowDataRoom] = useState(false);
  const handleClose = () => setShowDataRoom(false);

  useEffect(() => {

  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { roomID } = e.target.elements;

    const getRoom = firestore.collection("Rooms");
    getRoom.onSnapshot(
      (snapshot) => {
        let tempDataArray = [];

        snapshot.forEach((doc) => {
          if (doc.data().roomNumber == roomID.value) {
            tempDataArray = [
              ...tempDataArray,
              {
                id: doc.id,
                roomID: doc.data().roomNumber,
                nameUser: doc.data().name,
                emailUser: doc.data().email,
                telUser: doc.data().tel,
                orderid: doc.data().orderid,
                dateIn: doc.data().dateIn,
                dateOut: doc.data().dateOut,
                number: doc.data().number,
                status: doc.data().staTus,
              },
            ];
          }
        });
        setDataRoom((dataRoom) => tempDataArray);
      },
      (error) => {
        console.log(error);
      }
    );

    return setShowDataRoom(true);
  }

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <body>
      <Navbar bg="info" expand="lg">
        <Container>
          <Navbar.Brand href="/dashboard">
            Booking
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/dashboard"><b><i class="fas fa-home"></i> หน้าหลัก</b></Nav.Link>
              <Nav.Link href="/manager"><i class="fas fa-door-closed"></i> จัดการห้องพัก</Nav.Link>
              <Nav.Link href="/booking"><i class="fas fa-clipboard-list"></i> จองห้อง</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link><button onClick={() => firebaseApp.auth().signOut()} class="btn btn-danger"><i class="fas fa-sign-out-alt"></i> ออกจากระบบ</button></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container" style={{ marginTop: '2%' }}>
        <center><h1 className="font-weight-bold" style={{ marginLeft: '2%' }}>Booking</h1></center>
        <div style={{ marginTop: '3%' }} align="center">
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">เลขห้อง</InputGroup.Text>
              <FormControl
                name="roomID"
                placeholder="กรอกเลขห้องที่จะเช็ค"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <Button variant="primary" type="submit">
            <i class="fas fa-search"></i> ค้นหา
            </Button>
          </Form>
        </div>

        <Modal show={showDataRoom} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>รายละเอียดการจองห้องพัก</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {dataRoom.map((item, index) => {
              return (
                <>
                  <span><b>เลขห้อง: </b>{item.roomID}</span><br/>
                  <span><b>ชื่อผู้เข้าพัก: </b>{item.nameUser}</span><br/>
                  <span><b>อีเมลผู้จอง: </b>{item.emailUser}</span><br/>
                  <span><b>เบอร์โทรศัพท์ผู้จอง: </b>{item.telUser}</span><br/>
                  <span><b>รหัสการจอง: </b>{item.orderid}</span><br/>
                  <span><b>จำนวนคนที่เข้าพัก: </b>{item.number}</span><br/>
                  <span><b>วันที่เข้าพัก: </b>{item.dateIn}</span><br/>
                  <span><b>วันที่ออกจากห้องพัก: </b>{item.dateOut}</span><br/>
                  <span><b>สถานะการจอง: </b>{item.status}</span><br/>
                </>
              );
            })
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            <i class="fas fa-times-circle"></i> ปิด
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </body>
  );
}


export default DashBoard;