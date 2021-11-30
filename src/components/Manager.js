import React, { useState, useContext, useEffect } from 'react'
import { Redirect ,useHistory} from 'react-router-dom'
import { AuthContext } from './Auth'
import { firestore } from "./database/firebase";
import firebaseApp from "./database/firebase";
import { Navbar, NavDropdown, Nav, Container, Modal, Button, Dropdown } from 'react-bootstrap';
import MaterialTable from 'material-table';
import { FormControl,TextField } from '@material-ui/core';


function Managers() {
  
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [dataOne, setDataOne] = useState([]);
  const [roomEdit,setRoomEdit] = useState("");

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [tel,setTel] = useState("");
  const [dateIn,setDateIn] = useState("");
  const [dateOut,setDateOut] = useState("");
  const [number,setNumber] = useState("");
  
  const history = useHistory();


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const editRoom = (room) => {
    setRoomEdit(room)
    getDataEdit(room)
    handleShow()
  }

  const routeChange = (room) =>{ 
    let path = "/result/"+room;
    history.push(path);
  }
  const routeChangeHistory = (room) =>{ 
    let path = "/resulthistory/"+room;
    history.push(path);
  }

  const getDataEdit = (room) => {
    
      const ref = firestore.collection("Rooms").doc(room);
      ref.get()
          .then((doc) => {
              let tempDataArray = [];
              if (doc.exists) {
                setName(doc.data().name)
                setEmail(doc.data().email)
                setTel(doc.data().tel)
                setNumber(doc.data().number)
                setDateIn(doc.data().dateIn)
                setDateOut(doc.data().dateOut)
                  tempDataArray = [
                      ...tempDataArray,
                      {
                          id: doc.id,
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
                          staTus: doc.data().staTus,
                          priceRoom: doc.data().priceRoom,
                      },
                  ];
              } else {
                  console.log("No such document!");
              }
              setDataOne((dataOne) => tempDataArray);
          })
          .catch((error) => {
              console.log("Error");
          });

  }

  function checkStatus(status,room){
    var sTus = status.split("-");
    if (sTus[0] == "อัพสลิปแล้ว"){
      return <center><Button variant="info" onClick={() => routeChange(room)}>เช็คการชำระเงิน</Button></center>;
    }else if (sTus[0] == "ยืนยันการจองแล้ว"){
      return <center><Button variant="success" enable={false}>{status}</Button></center>;
    }
    else if (sTus[0] == "รอชำระ"){
      return <center><Button variant="warning" enable={false}>{status}</Button></center>;
    }
    else {
      return <center><Button variant="danger" enable={false}>{status}</Button></center>;
    }
    
  }

  function choiceButton(status,room){
    var sTus = status.split("-");
    if (sTus[0] == "ยืนยันการจองแล้ว") {
      return <Dropdown>
      <Dropdown.Toggle variant="dark" id="dropdown-basic">
        เพิ่มเติม
      </Dropdown.Toggle>
    
      <Dropdown.Menu>
      <Dropdown.Item onClick={() => routeChangeHistory(room)}>ดูสลิป</Dropdown.Item>
        <Dropdown.Item onClick={() => resetRoom(room)}>รีเซ็ต</Dropdown.Item>
        <Dropdown.Item onClick={() => editRoom(room)}>แก้ไข</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>;
    }
    else {
      return <Dropdown>
      <Dropdown.Toggle variant="dark" id="dropdown-basic">
        เพิ่มเติม
      </Dropdown.Toggle>
    
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => resetRoom(room)}>รีเซ็ต</Dropdown.Item>
        <Dropdown.Item onClick={() => editRoom(room)}>แก้ไข</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>;
    }
    
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
                choice: choiceButton(doc.data().staTus,doc.data().roomNumber),
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

  const updateDataforRoom = () => {
    firestore.collection("Rooms")
.doc(roomEdit)
.update({
  name: name,
  email: email,
  tel: tel,
  dateIn: dateIn,
  dateOut: dateOut,
  number: number,
  orderid: "B"+roomEdit+tel+"K",
})
.then(function () {
console.log("Value successfully written!");
alert("แก้ไขเรียบร้อย")
handleClose()
})
.catch(function (error) {
console.error("Error writing Value: ", error);
});
}

  const columns = [
    { title: <b>เลขห้อง</b>, field: 'roomNumber' },
    { title: <b>ชื่อผู้เข้าพัก</b>, field: 'name' },
    { title: <b>email</b>, field: 'email' },
    { title: <b>เบอร์</b>, field: 'tel' },
    { title: <b>วันที่เข้าพัก</b>, field: 'dateIn' },
    { title: <b>วันที่ออก</b>, field: 'dateOut' },
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
            Booking
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/dashboard"><i class="fas fa-home"></i> หน้าหลัก</Nav.Link>
              <Nav.Link href="/manager"><b><i class="fas fa-door-closed"></i> จัดการห้องพัก</b></Nav.Link>
              <Nav.Link href="/booking"><i class="fas fa-clipboard-list"></i> จองห้อง</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link><button onClick={() => firebaseApp.auth().signOut()} class="btn btn-danger"><i class="fas fa-sign-out-alt"></i> ออกจากระบบ</button></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <center><div style={{ width: '98%',marginTop:'1%' }}>
        <MaterialTable columns={columns} data={data} title='จัดการห้องพัก' options={{
        paging:false,
        pageSize:9}}/>
      </div></center>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
        <Modal.Title>แก้ไขข้อมูล ห้อง {roomEdit}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {dataOne.map((item, index) => {
                        return (
                          <div class="text-center">
                            <TextField id="standard-basic" label="ชื่อ" value={name} onChange={(e) => setName(e.target.value)} />&nbsp;&nbsp;&nbsp;
                            <TextField id="standard-basic" label="อีเมล" value={email}onChange={(e) => setEmail(e.target.value)} /><br/><br/>
                            <TextField id="standard-basic" label="เบอร์" value={tel}onChange={(e) => setTel(e.target.value)} />&nbsp;&nbsp;&nbsp;
                            <TextField id="standard-basic" label="จำนวนคนที่เข้าพัก" value={number}onChange={(e) => setNumber(e.target.value)} /><br/><br/>
                            <TextField id="standard-basic" type="date" ata-date-format="YYYY-MM-DD" label="วันเข้าพัก" value={dateIn} onChange={(e) => setDateIn(e.target.value)}/>&nbsp;&nbsp;&nbsp;
                            <TextField id="standard-basic" type="date" ata-date-format="YYYY-MM-DD" label="วันที่ออก" value={dateOut}onChange={(e) => setDateOut(e.target.value)} /><br/><br/>
                            <TextField id="standard-basic" label="รหัสการจอง" value={item.orderid} disabled/>
                          </div>
                        );
                  })
        }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={() => updateDataforRoom()}>
            บันทึก
          </Button>
        </Modal.Footer>
      </Modal>
    </body>
  );
}




export default Managers;