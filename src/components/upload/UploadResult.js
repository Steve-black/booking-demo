import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { firestore, storage } from "../database/firebase";
import { Offcanvas, Image, Row, Form, Button, Card, Navbar, Container } from 'react-bootstrap';
import { MdDateRange } from 'react-icons/fa';





export default function UploadResult() {
    let { room } = useParams();
    const [data, setData] = useState([]);
    const [dateIn, setDateIn] = useState(new Date(), 'DD-MM-YYYY');
    const [numDay, setDatanumday] = useState();
    const [dateOut, setDateOut] = useState(new Date(), 'DD-MM-YYYY');

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
  
    const addDataforRoom = (url1) => {
      firestore.collection("Rooms").doc(room).update({
      imgPath: url1,
      staTus: "อัพสลิปแล้ว",
  })
  .then(function () {
  console.log("Value successfully written!");
  alert("เรียบร้อย")
  window.location.reload();
  })
  .catch(function (error) {
  console.error("Error writing Value: ", error);
  });
  }
  
  
  
    
  
    console.log("image: ", image);





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
            <div style={{ marginTop: '5%' }}>
                <center>
                    {data.map((item, index) => {
                        return (
                          <div>
                              <b><h3>อัพสลิปเสร็จสิ้น</h3></b>
                              <b>คุณ : </b> {item.name}<br/>
                              <b>จองห้อง : </b> {item.roomNumber}<br/>
                              <b>จำนวนผู้เข้าพัก : </b> {item.number} <b>คน</b><br/>
                              <b>จำนวนวันที่เข้าพัก : </b> {item.stayDay} <b>คืน</b><br/>
                              <b>ราคาที่คุณต้องจ่ายทั้งสิ้น : </b> {item.roomRate} <b>บาท</b><br/>
                              <b>รหัสการจอง : </b> {item.orderid}<br/>
                              ***คุณสามารถปิดแถบลงได้เลย***<br/>
                              ***โปรดรอเจ้าหน้าที่ทำการเช็คข้อมูล***
                          </div>
                        );
                    })}
                </center>
            </div>



        </body>
    );
}
