import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { firestore, storage } from "../database/firebase";
import { Offcanvas, Image, Row, Form, Button, Card, Navbar, Container } from 'react-bootstrap';
import { MdDateRange } from 'react-icons/fa';
import { useHistory  } from 'react-router-dom'






export default function Selectdate() {
    let { room, id } = useParams();
    const [data, setData] = useState([]);
    const [dateIn, setDateIn] = useState(new Date(),'DD-MM-YYYY');
    const [numDay, setDatanumday] = useState();
    const [dateOut, setDateOut] = useState(new Date(),'DD-MM-YYYY');
    const [cashBack,setCashBack] = useState();
    const [if_stay,setIf_stay] = useState();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const history = useHistory();

    var now = new Date();
    var dateFormat = require("dateformat");

    function getNumberOfDays(start, end) {
        const date1 = new Date(start);
        const date2 = new Date(end);
    
        // One day in milliseconds
        const oneDay = 1000 * 60 * 60 * 24;
    
        // Calculating the time difference between two dates
        const diffInTime = date2.getTime() - date1.getTime();
    
        // Calculating the no. of days between two dates
        const diffInDays = Math.round(diffInTime / oneDay);
    
        return diffInDays;
    }
    
    function getPriceRoom(dayNum,priceRoom){
        return parseInt(priceRoom)*dayNum;
    }

    function getCashBack(dayNum){
        if (dayNum >= 2 && dayNum < 3){
            return  5;
        }
        else if (dayNum >=3 && dayNum <5){
            return  10;
        }
        else if (dayNum >=5){
            return  20;
        }
        else {
            return 0;
        }
    }
    
    function getPriceRoomAndPro(priceRoom,dayNum){
        return parseInt(parseInt(priceRoom)*getCashBack(dayNum)/100);
        
    }

    const routeChange = (idP) =>{ 
        let path = "/slrip/"+room+"&"+idP;
        history.push(path);
      }


    const addDataforRoom = (room,dIn,dOut,roomRate,stayDay,id) => {
        firestore.collection("Rooms")
    .doc(room)
    .update({
        dateIn: dIn,
        dateOut: dOut,
        roomRate: roomRate,
        stayDay: stayDay,
        staTus: "รอชำระ-"+dateFormat(now, 'mmmm dd, yyyy HH:MM:ss Z'),
    })
    .then(function () {
    console.log("Value successfully written!");
    routeChange(id)
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
                if (doc.exists && id == doc.data().orderid) {
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
                            paymentStatus: doc.data().paymentStatus,
                            roomDetails: doc.data().roomDetails,
                            staTus: doc.data().staTus,
                            priceRoom: doc.data().priceRoom,
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

    return (
        <body>
            <div style={{ marginTop: '2%' }}>
                <center>
                    {data.map((item, index) => {
                        return (
                            <Card style={{ width: '97%', textAlign: 'left' }} className="text-dark bg-light">
                                <Card.Img variant="top" src="https://media-cdn.tripadvisor.com/media/photo-s/13/d8/ea/1b/a-room-at-the-beach.jpg" />
                                <Card.Body>
                                    <center><Card.Title>เลือกวันเข้าพัก</Card.Title></center>
                                    <Card.Title>ห้อง : {item.roomNumber}</Card.Title>
                                    <Card.Title>ชื่อผู้จอง : {item.name}</Card.Title>
                                    <Card.Title>รหัสการจอง : {item.orderid}</Card.Title>
                                    <Card.Text>
                                        *เลือกวันที่จะพักและวันสิ้นสุด ระบบจะทำการคำนวนราคาค่าใช้จ่าย*
                                    </Card.Text>
                                    <Form.Group>
                                        <Form.Label>วันที่จะเข้าพัก</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="duedate"
                                            placeholder="Due date"
                                            timeFormat="DD-MM-YYYY"
                                            value={dateIn}
                                            onChange={(e) => setDateIn(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>ถึงวันที่</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="duedate"
                                            placeholder="Due date"
                                            timeFormat="DD-MM-YYYY"
                                            value={dateOut}
                                            onChange={(e) => setDateOut(e.target.value)}
                                        />
                                    </Form.Group><br/>
                                    <Card.Text> จำนวนวันที่เข้าพัก {getNumberOfDays(dateIn, dateOut)} วัน<br/>
                                    ราคาห้องพัก {item.priceRoom} บาท/คืน <br/>
                                    พัก {getNumberOfDays(dateIn, dateOut)} วัน ราคา {getPriceRoom(getNumberOfDays(dateIn, dateOut),item.priceRoom)} บาท <br/>
                                    ส่วนลด {getCashBack(getNumberOfDays(dateIn, dateOut))}% ลดไป {getPriceRoom(getNumberOfDays(dateIn, dateOut),item.priceRoom)*getCashBack(getNumberOfDays(dateIn, dateOut))/100}<br/>
                                    ราคาที่คุณต้องจ่ายทั้งสิ้น {getPriceRoom(getNumberOfDays(dateIn, dateOut),item.priceRoom)-(getPriceRoom(getNumberOfDays(dateIn, dateOut),item.priceRoom)*getCashBack(getNumberOfDays(dateIn, dateOut))/100)} บาท
                                    </Card.Text>
                                    <center><Button variant="success" onClick={() => addDataforRoom(room,dateIn,dateOut,getPriceRoom(getNumberOfDays(dateIn, dateOut),item.priceRoom)-(getPriceRoom(getNumberOfDays(dateIn, dateOut),item.priceRoom)*getCashBack(getNumberOfDays(dateIn, dateOut))/100),getNumberOfDays(dateIn, dateOut),id)}>ถัดไป</Button></center> 
                                </Card.Body>
                            </Card>
                            
                        );
                    })}
                </center>
            </div>  
           


        </body>
    );
}

