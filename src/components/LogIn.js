import React, { useContext, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { AuthContext } from './Auth'
import firebase from "firebase/app";
import { Button, Form, Image, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

var uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: async (authResult) => {
      const userInfo = authResult.additionalUserInfo;
      if (userInfo.isNewUser && userInfo.providerId === "password") {
        try {
          await authResult.user.sendEmailVerification();
          console.log("Check your email.");
        } catch (e) {
          console.log(e);
        }
      }
      return false;
    },
  },
};


const LogIn = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    const authObserver = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return authObserver;
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = e.target.elements;

    try {
      firebase.auth().signInWithEmailAndPassword(email.value, password.value);

    } catch (error) {
      alert(error);
    }
  }

  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    return <Redirect to="/dashboard" />;
  }


  return (
    <body>
      <div className="container mt-5">
        <center><p style={{ fontWeight: 'bold', fontSize: '60px' }}>Booking</p></center>
        <div align="center">
          <Card border="secondary mt-5" style={{ width: '30rem' }}>
            <Card.Header><b>เข้าสู่ระบบ</b></Card.Header>
            <Card.Body class="p-3" align="left">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>อีเมล</Form.Label>
                  <Form.Control type="email" name="email" placeholder="กรอกอีเมล" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>รหัสผ่าน</Form.Label>
                  <Form.Control type="password" name="password" placeholder="กรอกรหัสผ่าน" />
                </Form.Group>
                <div align="center" style={{marginTop: '10%'}}>
                  <Button variant="primary" type="submit">
                  <i class="fas fa-sign-in-alt"></i> เข้าสู่ระบบ
                  </Button>
                  &nbsp;&nbsp;
                  <Button variant="danger" type="reset">
                  <i class="fas fa-times-circle"></i> ล้างข้อมูล
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </body>
  )
}

export default LogIn;