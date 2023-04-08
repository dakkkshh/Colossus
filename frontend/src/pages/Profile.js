import { useState } from "react";
import Loader from "../components/Loader";
import { Avatar, Typography, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import {darkColor, highlightBg} from '../constants/colors'
import { _fetch } from "../_fetch";
import { useNavigate } from "react-router-dom";
import { logout, login } from "../store/action/user";
import { useCookies } from 'react-cookie';


export default function Profile () {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let user = useSelector(st => st.user);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(user.name);
    const [, , removeCookie] = useCookies();
    
    async function updateUser(){
        if(user.name === name) return;
        try {
            setLoading(true);
            let res = await _fetch(`${process.env.REACT_APP_API_URL}/user/${user._id}`, {
                method: 'PATCH',
                body: {
                    name:name
                }
            });
            res = await res.json();
            if (res.status === 200){
                dispatch(login(res.response));    
                message.success('Profile updated successfully');
            } else {
                message.error(res.response);
            }
        } catch (err) {
            console.log(err);
            message.error('Something went wrong, please try again later');
        } finally {
            setLoading(false);
        }
    }

    async function logoutUser(){
        try {
            setLoading(true);
            let res = await _fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
                method: 'DELETE',
            });
            res = await res.json();
            if (res.status === 200){
                dispatch(logout());
                removeCookie("colossus-userinfo");
                message.success(res.response);
                navigate('/login', { replace: true });
            } else {
                message.error(res.response);
            }
        } catch (err){
            console.log(err);
            message.error('Something went wrong, please try again later');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        width: "100%",
                    }}
                >
                    <Avatar size={128} icon={<UserOutlined />} />
                    <Typography.Title
                        editable={{
                            onChange: (value) => setName(value),
                            tooltip: 'Click to edit',
                        }}
                        level={2}
                        style={{
                            margin: '0.5rem 0',
                        }}
                    >
                        {name}
                    </Typography.Title>
                    <Typography.Title
                        level={5}
                        style={{
                            margin: 0,
                            color: highlightBg,
                        }}
                    >
                        {`${user.role} @${user.organization?.name}`}
                    </Typography.Title>
                    <Typography.Text
                        style={{
                            margin: '0.5rem 0',
                        }}
                    >
                        {
                            user.email
                        }
                    </Typography.Text>
                    <div
                        className="d-flex flex-column"
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '2rem 0',
                        }}
                    >
                        <Button
                            style={{
                                border: 'none',
                                margin: '0.25rem 0',
                                width: '200px',
                                boxShadow: 'none',
                                backgroundColor: darkColor,
                            }}
                            onClick={updateUser}
                        >
                            Save Changes
                        </Button>
                        <Button
                            style={{
                                border: 'none',
                                margin: '0.25rem 0',
                                width: '200px',
                                boxShadow: 'none',
                                backgroundColor: darkColor,
                            }}
                            onClick={logoutUser}
                        >
                            Log Out
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}