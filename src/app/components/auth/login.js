import React, { Component } from 'react'
import { Link,Navigate } from 'react-router-dom';
import './index.css'
import { setCookie } from '../services/cookie';
import { routes } from '../../config';
import { Axios } from '../services/axios';
import { NotificationManager } from 'react-notifications';
import  Loader  from '../../loading';
import {error} from '../services/error'
export class Login extends Component {
 
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loading: false,
            redirect:false
        }
    }

    takeInput(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    toggleLogin(e) {
        e.preventDefault();
        this.setState({ loading: true })
        const {
            email, password
        } = this.state;

        const data = { email, password }

        Axios.post(routes.login, data)
            .then(success => {
                if (success.data) {
                        setCookie('token', success.data.token,1);

                        NotificationManager.success(success?.data?.mess);
                this.setState({redirect:true });

                    return;
                }
            }).catch(err => {
                error(err);
                return
            }).finally(() => {
                this.setState({ loading: false });
                return;
            })
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        return (
            <div className='loginPopup'>
                {
            this.state.redirect && <Navigate to={'/'} replace={false} />
          }
                <div className="login-page">
                    <div className="form" onSubmit={(e) => this.toggleLogin(e)}>
                        <form className="login-form">
                            <input type="text" placeholder="email" required name='email' onChange={(e) => { this.takeInput(e) }} />
                            <input type="password" placeholder="password" required name='password' onChange={(e) => { this.takeInput(e) }} />
                            <button type='submit' >login</button>
                            <p className='home'><Link to={'/'} >Go to Home Page</Link> </p>
                            <p className='home'><Link to={'/reset'} >Reset Password</Link> </p>
                            
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login
