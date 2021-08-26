import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { firestore, storage } from "../database/firebase";
import { Offcanvas, Image, Row, Form, Button, Card, Navbar, Container } from 'react-bootstrap';
import { MdDateRange } from 'react-icons/fa';

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

function getPriceRoom(dayNum, priceRoom) {

    return 500 * dayNum;
}

function getPriceRoomAndPro(priceRoom) {

    return priceRoom * 20 / 100;
}




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
  
    const handleChange = e => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    };
  
    const handleUpload = () => {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        error => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              setUrl(url);
              addDataforRoom(url)
            });
        }
      );
      
    };
  
    console.log("image: ", image);





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
                                   
                                </Card.Body>
                            </Card>

                        );
                    })}
                </center>
            </div>



        </body>
    );
}
