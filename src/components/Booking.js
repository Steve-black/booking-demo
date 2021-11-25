import React, { useState, useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { AuthContext } from './Auth'
import { firestore } from "./database/firebase";
import firebaseApp from "./database/firebase";
import { Navbar, Card, Nav, Container, Form, Col, Row, Button, InputGroup, FormControl } from 'react-bootstrap';



function Booking() {

  const { currentUser } = useContext(AuthContext);
  const [dataRoom, setDataRoom] = useState([]);


  useEffect(() => {

    const getRoom = firestore.collection("Rooms");
    getRoom.onSnapshot(
      (snapshot) => {
        let tempDataArray = [];

        snapshot.forEach((doc) => {
          if (doc.data().staTus == "ว่าง") {
            tempDataArray = [
              ...tempDataArray,
              {
                id: doc.id,
                roomID: doc.data().roomNumber,
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

  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const {roomID, nameUser, emailUser, phoneUser, countUser, dateIn, dateOut} = e.target.elements;
    
    var updateRoom = firestore.collection("Rooms").doc(roomID.value);
    return updateRoom.update({
      name: nameUser.value,
      email: emailUser.value,
      tel: phoneUser.value,
      number: countUser.value,
      dateIn: dateIn.value,
      dateOut: dateOut.value,
      orderid: "B" + roomID.value + phoneUser.value + "K",
      staTus: "ยืนยันการจองแล้ว"
    })
    .then(() => {
      window.alert("เพิ่มการจองห้องเรียบร้อยแล้ว");
      window.location.assign('/manager');
    })
    .catch((error) => {
      window.alert("ไม่สามารถจองห้องได้ โปรดลองใหม่อีกครั้ง");
    });
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
              <Nav.Link href="/dashboard"><i class="fas fa-home"></i> หน้าหลัก</Nav.Link>
              <Nav.Link href="/manager"><i class="fas fa-door-closed"></i> จัดการห้องพัก</Nav.Link>
              <Nav.Link href="/booking"><b><i class="fas fa-clipboard-list"></i> จองห้อง</b></Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link><button onClick={() => firebaseApp.auth().signOut()} class="btn btn-danger"><i class="fas fa-sign-out-alt"></i> ออกจากระบบ</button></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container" style={{ marginTop: '2%' }}>
        <center><h1 className="font-weight-bold" style={{ marginLeft: '2%' }}>จองห้อง</h1></center>
        <Card border="primary" style={{ marginTop: '3%', marginBottom: '10%' }}>
          <Card.Header style={{backgroundColor: '#0d6efd', color: '#FFFFFF', fontWeight: 'bold'}}>รายละเอียดการจองห้องพัก</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Card.Title style={{ fontSize: '16px', fontWeight: 'bold' }}>เลขห้อง</Card.Title>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1"><i class="fas fa-key"></i></InputGroup.Text>
                <Form.Select size="md" name="roomID">
                  {dataRoom.map((item, index) => {
                    return (
                      <option>{item.roomID}</option>
                    );
                  })
                  }
                </Form.Select>
              </InputGroup>
              <Card.Title style={{ fontSize: '16px', fontWeight: 'bold' }}>ชื่อผู้จอง</Card.Title>
              <Card.Text>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1"><i class="fas fa-user-edit"></i></InputGroup.Text>
                  <FormControl
                    name="nameUser"
                    type="text"
                    placeholder="กรอกชื่อผู้จอง"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    required="required"
                  />
                </InputGroup>

                <Card.Title style={{ fontSize: '16px', fontWeight: 'bold' }}>อีเมลผู้จอง</Card.Title>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1"><i class="fas fa-envelope"></i></InputGroup.Text>
                  <FormControl
                    name="emailUser"
                    type="email"
                    placeholder="กรอกอีเมลผู้จอง"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    required="required"
                  />
                </InputGroup>

                <Card.Title style={{ fontSize: '16px', fontWeight: 'bold' }}>เบอร์โทรศัพท์ผู้จอง</Card.Title>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1"><i class="fas fa-phone-square-alt"></i></InputGroup.Text>
                  <FormControl
                    name="phoneUser"
                    type="tel"
                    placeholder="กรอกเบอร์โทรศัพท์ผู้จอง"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    required="required"
                  />
                </InputGroup>

                <Card.Title style={{ fontSize: '16px', fontWeight: 'bold' }}>จำนวนผู้เข้าพัก</Card.Title>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1"><i class="fas fa-user-friends"></i></InputGroup.Text>
                  <FormControl
                    name="countUser"
                    type="number"
                    placeholder="กรอกจำนวนผู้เข้าพัก"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    required="required"
                  />
                </InputGroup>

                <Row>
                  <Col>
                    <Card.Title style={{ fontSize: '16px', fontWeight: 'bold' }}>วันที่เข้าพัก</Card.Title>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1"><i class="fas fa-calendar-alt"></i></InputGroup.Text>
                      <FormControl
                        name="dateIn"
                        type="date"
                        placeholder="เลือกวันที่เข้าพัก"
                        data-date-format="YYYY-MM-DD"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        required="required"
                      />
                    </InputGroup>
                  </Col>
                  <Col>
                    <Card.Title style={{ fontSize: '16px', fontWeight: 'bold' }}>วันที่ออกจากห้องพัก</Card.Title>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1"><i class="fas fa-calendar-alt"></i></InputGroup.Text>
                      <FormControl
                        name="dateOut"
                        type="date"
                        placeholder="เลือกวันที่ออกจากห้องพัก"
                        ata-date-format="YYYY-MM-DD"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        required="required"
                      />
                    </InputGroup>
                  </Col>
                </Row>
                <div align="center" style={{marginTop: '2%'}}>
                  <Button variant="primary" type="submit">
                  <i class="fas fa-save"></i> จองห้องพัก
                  </Button>
                  &nbsp;&nbsp;
                  <Button variant="danger" type="reset">
                  <i class="fas fa-times-circle"></i>  ล้างข้อมูล
                  </Button>
                </div>
              </Card.Text>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </body >
  );
}


export default Booking;