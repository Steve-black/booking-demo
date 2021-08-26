import React, { useState, useContext, useEffect } from 'react'
import { Redirect ,useHistory} from 'react-router-dom'
import { AuthContext } from './Auth'
import { firestore } from "./database/firebase";
import firebaseApp from "./database/firebase";
import { Navbar, NavDropdown, Nav, Container, Tab, Button, Dropdown } from 'react-bootstrap';
import MaterialTable from 'material-table';


function Managers() {
  
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);

  const history = useHistory();

  const routeChange = (room) =>{ 
    let path = "/result/"+room;
    history.push(path);
  }

  function checkStatus(status,room){
    if (status == "อัพสลิปแล้ว"){
      return <center><Button variant="info" onClick={() => routeChange(room)}>เช็คการชำระเงิน</Button></center>;
    }else if (status == "ยืนยันการจองแล้ว"){
      return <center><Button variant="success" enable={false}>{status}</Button></center>;
    }
    else if (status == "รอชำระ"){
      return <center><Button variant="warning" enable={false}>{status}</Button></center>;
    }
    else {
      return <center><Button variant="danger" enable={false}>{status}</Button></center>;
    }
    
  }

  function choiceButton(room){
    return <Dropdown>
    <Dropdown.Toggle variant="dark" id="dropdown-basic">
      เพิ่มเติม
    </Dropdown.Toggle>
  
    <Dropdown.Menu>
      <Dropdown.Item onClick={() => resetRoom(room)}>รีเซ็ต</Dropdown.Item>
      <Dropdown.Item href="#/action-2">แก้ไข</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>;
  }

  const resetRoom = (room) => {
    firestore.collection("Rooms")
.doc(room)
.update({
  name: "-",
  email: "-",
  tel: "-",
  dateIn: "-",
  dateOut: "-",
  number: "-",
  orderid: "-",
  staTus: "ว่าง",
  imgPath: "-"
})
.then(function () {
console.log("Value successfully written!");
alert("ล้างเรียบร้อย")
})
.catch(function (error) {
console.error("Error writing Value: ", error);
});
}

  useEffect(() => {

    const ref = firestore.collection("Rooms");
    ref.onSnapshot(
      (snapshot) => {
        let tempDataArray = [];
        snapshot.forEach((doc) => {
          if (doc.exists) {
            tempDataArray = [
              ...tempDataArray,
              {
                roomNumber: doc.data().roomNumber,
                name: doc.data().name,
                email: doc.data().email,
                tel: doc.data().tel,
                typeRoom: doc.data().typeRoom,
                dateIn: doc.data().dateIn,
                dateOut: doc.data().dateOut,
                number: doc.data().number,
                orderid: doc.data().orderid,
                paymentStatus: doc.data().paymentStatus,
                roomDetails: doc.data().roomDetails,
                staTus: checkStatus(doc.data().staTus,doc.data().roomNumber),
                priceRoom: doc.data().priceRoom,
                choice: choiceButton(doc.data().roomNumber),
              },
            ];
          }
        });
        setData((data) => tempDataArray);
      },
      (err) => {
        console.log(err);
      }
    );

  }, []);

  const columns = [
    { title: <b>เลขห้อง</b>, field: 'roomNumber' },
    { title: <b>ชื่อผู้เข้าพัก</b>, field: 'name' },
    { title: <b>email</b>, field: 'email' },
    { title: <b>เบอร์</b>, field: 'tel' },
    { title: <b>รหัสการจอง</b>, field: 'orderid' },
    { title: <b>สถานะ</b>, field: 'staTus' },
    { title: <b>ตัวเลือก</b>, field: 'choice' }
  ];

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
      <center><div style={{ width: '98%',marginTop:'1%' }}>
        <MaterialTable columns={columns} data={data} title='จัดการห้องพัก' options={{
        paging:false,
        pageSize:9}}/>
      </div></center>
    </body>
  );
}




export default Managers;