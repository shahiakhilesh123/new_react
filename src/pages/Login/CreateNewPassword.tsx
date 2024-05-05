import React, {useEffect} from "react";
import {Container} from "react-bootstrap";
import InputIcon from "../../components/Form/InputIcon/InputWithIcon";
import {Link} from "react-router-dom";
import {FaAngleDoubleRight} from 'react-icons/fa';

function CreateNewPassword() {
    useEffect(() => {
        document.body.classList.add('login_body')
        return () => {
            document.body.classList.remove('login_body');
            document.body.classList.add('site_body');
        };
    }, [])
    return <Container style={{width: "100%"}}>
        <form className="form-signin">
            <div className="login_logo">
                <h1>LOGO</h1>
            </div>
            <h2 className="form-signin-heading">Create new password</h2>
            <div className="login-wrap">
                <InputIcon type="password" placeholder={"Create new password"} icon="fa-lock"/>
                <InputIcon type="password" placeholder={"Confirm password"} icon="fa-lock"/>

                <FaAngleDoubleRight/>

                <button className="btn btn-lg btn-login btn-block" type="submit">Reset Password</button>


                <div className="login-bottom">
                    <h4>Don't have an Account? <Link to="/register"> Register Now!</Link></h4>
                </div>
            </div>
        </form>
    </Container>;
}

export default CreateNewPassword;
