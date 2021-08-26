import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { firestore, storage } from "../database/firebase";
import { Col, Image, Row, Form, Button, Card, Navbar, Container } from 'react-bootstrap';
import { MdDateRange } from 'react-icons/fa';
import { useHistory  } from 'react-router-dom'



export default function HomeUpload() {
    let { room } = useParams();
    const [data, setData] = useState([]);
    const [dataID, setDataID] = useState("");
    const [putID, setPutID] = useState("");
    const [tel, setTel] = useState("");

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const history = useHistory();

    const routeChange = (idP) =>{ 
            let path = "/date/"+room+"&"+dataID;
            history.push(path);
        
      }

      const checkRoomtrue = () => {
        if(putID == dataID || putID == tel){
            window.alert("รหัสตรงกัน");
            routeChange(dataID)
        }
        else{
            window.alert("รหัสไม่ตรงกัน");
        }
    }





    useEffect(() => {
        const ref = firestore.collection("Rooms").doc(room);
        ref.get()
            .then((doc) => {
                let tempDataArray = [];
                if (doc.exists) {
                    console.log("=====", doc.data().orderid)
                    setDataID((dataID) => doc.data().orderid);
                    setTel((tel) => doc.data().tel);
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
                            roomRate: doc.data().roomRate,
                            stayDay: doc.data().stayDay,
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
                                <Card.Body>
                                    <center><Card.Title>ห้องพักที่ {room}</Card.Title></center>

                                    <center><Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                        <Form.Label column sm="2">
                                            รหัสการจองหรือหมายเลขโทรศัพท์
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control type="text" placeholder="กรอกรหัสการจองหรือหมายเลขโทรศัพท์" value={putID} onChange={(e) => setPutID(e.target.value)}/>
                                        </Col>
                                    </Form.Group></center>
                                    <center><Button variant="success" onClick={()=> checkRoomtrue()}>ถัดไป</Button></center>
                                </Card.Body>
                            </Card>

                        );
                    })}
                </center>
            </div>



        </body>
    );
}


