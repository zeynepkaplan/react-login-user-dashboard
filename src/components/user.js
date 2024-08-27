import React from "react";
import AuthLayout from "../components/auth/authLayout";
import UserPage from "../components/auth/userPage.js";

const User = () => {
    return (
        <AuthLayout>
            <UserPage />
        </AuthLayout>
    );
};

export default User;