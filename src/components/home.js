import React from "react";
import { jwtDecode } from 'jwt-decode';

const Home = () => {
    const userToken = localStorage.getItem('token')
    const data = jwtDecode(userToken)
    const fullName = data.user.fullName
    const email = data.user.email

    return <div>
        <h1>Merhaba {fullName}</h1>
    </div>;
}

export default Home; 
