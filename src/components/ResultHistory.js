import React, { useState, useContext, useEffect } from 'react'
import { Redirect ,useHistory,useParams} from 'react-router-dom'
import { AuthContext } from './Auth'
import { firestore } from "./database/firebase";
import firebaseApp from "./database/firebase";
import { Navbar, NavDropdown, Nav, Container, Modal, Button, Card,Row,Col } from 'react-bootstrap';
import MaterialTable from 'material-table';


function ResultHistory() {
let { room } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const history = useHistory();

  const routeChange = () =>{ 
    let path = "/manager";
    history.push(path);
  }

    const confirm = (room) => {
      firestore.collection("Rooms")
  .doc(room)
  .update({
      staTus: "ยืนยันการจองแล้ว",
  })
  .then(function () {
  console.log("Value successfully written!");
  alert("ยืนยันสำเร็จ")
  routeChange()
  })
  .catch(function (error) {
  console.error("Error writing Value: ", error);
  });
  }


  useEffect(() => {
    const ref = firestore.collection("Rooms").doc(room);
    ref.get()
        .then((doc) => {
            let tempDataArray = [];
            if (doc.exists) {
                console.log("=====", doc.data().orderid)
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
                        staTus: doc.data().staTus,
                        priceRoom: doc.data().priceRoom,
                        room_img: doc.data().room_img,
                        imgPath: doc.data().imgPath,
                        roomRate: doc.data().roomRate,
                    },
                ];
            } else {
                console.log("No such document!");
            }
            setData((data) => tempDataArray);
        })
        .catch((error) => {
            console.log("Error");
        });
  }, []);

  const columns = [
    { title: <b>เลขห้อง</b>, field: 'roomNumber' },
    { title: <b>ชื่อผู้เข้าพัก</b>, field: 'name' },
    { title: <b>email</b>, field: 'email' },
    { title: <b>เบอร์</b>, field: 'tel' },
    { title: <b>รหัสการจอง</b>, field: 'orderid' },
    { title: <b>สถานะ</b>, field: 'staTus' }
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
      
      <center><div style={{ width: '90%',marginTop:'5%'}}>
      <Card style={{textAlign:'center'}}>
  <Card.Header><b>ข้อมูลการจองห้อง {room}</b></Card.Header>
  <Card.Body>
  {data.map((item, index) => {
                        return (
<div>
<Row>
    <Col><img src={item.room_img} style={{width:'250px'}}/><br/><br/></Col>
    <Col><center><div style={{textAlign:'left'}}>
    <b>รหัสการจอง</b> : {item.orderid}<br/>
   <b> ชื่อผู้จอง </b> : {item.name}<br/>
   <b>จำนวนผู้เข้าพัก</b> : {item.number} คน <br/>
   <b> เบอร์โทร</b> : {item.tel} <br/>
   <b> email</b> : {item.email} <br/>
   <b>ประเภทห้องพัก</b> : {item.typeRoom} <br/>
   <b>วันที่เข้าพัก </b>: {item.dateIn} <br/>
   <b>วันที่ออก </b> : {item.dateOut} <br/>
   <b>ราคาห้องพัก</b>  : {item.roomRate} บาท<br/>
   <b>สถานะ </b> : {item.staTus} <br/>
   <b>ตรวจสอบการจ่ายเงิน</b> : <Button variant="primary" onClick={handleShow}>
        ดูสลิป
      </Button>
    </div></center></Col>
  </Row>
    
    
    

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>หลักฐานการจ่ายเงิน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <img src={item.imgPath} style={{width:'100%',height:'100%'}}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>




</div>
                        );
                        })
                        }
  </Card.Body>
  <Card.Footer className="text-muted"><b>Booking.com</b></Card.Footer>
</Card>
<div style={{marginTop:'4%',marginLeft:'1%'}}>
      <Button variant="warning" href="/manager">กลับไปหน้าจัดการห้องพัก</Button>
      </div>
      </div></center>
    </body>
  );
}



export default ResultHistory;