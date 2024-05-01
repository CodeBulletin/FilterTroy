import react, { useState } from 'react';
import './LoginSignup.scss'

import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'


const LoginSignup = () => {

    const [action, setAction] = useState("Login");

    return (
        <div className='container'>
            <div className='header'>
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">
                {action === "Login" ?
                    <>
                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input type="email" placeholder='Email Id' />
                        </div>
                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="password" placeholder='Password' />
                        </div></> :

                    <>
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input type="text" placeholder='UserName' />
                        </div>
                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input type="email" placeholder='Email Id' />
                        </div>
                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="password" placeholder='Password' />
                        </div>
                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="password" placeholder='Confirm Password' />
                        </div>
                    </>
                }

            </div>
            {action === "Sign Up" ? <div></div> : <div className="forgot-password">Forgot password? <span>Click here!</span></div>}

            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up") }}>Sign Up</div>
                <button className="submit btn">Submit</button>
                <div className={action == "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login") }}>Login</div>
            </div>

        </div>
    )
}

export default LoginSignup