import React, { useContext, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { AuthContext } from './Auth'
import firebase from "firebase/app";
import { Button,Form,Image} from 'react-bootstrap';
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
        <center><Image src="https://www.reviewpro.com/wp-content/uploads/2019/06/Booking-Logo-PNG.png" style={{width:'25%'}}/></center>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>อีเมล</Form.Label>
            <Form.Control type="email" name="email" placeholder="กรอกอีเมล" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>รหัสผ่าน</Form.Label>
            <Form.Control type="password" name="password" placeholder="กรอกรหัสผ่าน" />
          </Form.Group>
          <Button variant="primary" type="submit">
            เข้าสู่ระบบ
          </Button>
        </Form>
      </div>
    </body>
  )
}

export default LogIn;