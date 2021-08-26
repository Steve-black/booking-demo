import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from './Auth'

const Home = () => {
    const { currentUser } = useContext(AuthContext);

    return (
        <>
            <div className="container mt-5">
                <h1>Back-End Nuds</h1>
                {currentUser ? (
                    <p>คุณล็อคอินอยู่นะ<Link to="/dashboard">ไปหน้าจัดการ</Link></p>
                ) : (
                    <p>
                        <Link to="/login" className="btn btn-primary">เข้าสู่ระบบ</Link>
                    </p>
                )}
            </div>
        </>
    )
}

export default Home;