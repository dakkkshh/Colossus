import React, {useState} from "react";
import { Card, Col, Row, Form, Input, Button, message } from "antd";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { bgColor, darkColor, cardColor, itemColor } from "../constants/colors";
import { Typography } from 'antd';
import Lottie from 'react-lottie';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { login } from '../store/action/user'
import * as animationData from '../assets/lottie/login.json';
import { _fetch } from "../_fetch";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [, setCookie] = useCookies(['colossus-userinfo']);

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            let res = await _fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
                method: 'POST',
                body: {
                    ...values,
                },
            });
            res = await res.json();
            if (res.status === 200) {
                dispatch(login(res.response));
                setCookie('colossus-userinfo', res.response, {
                    maxAge: process.env.REACT_APP_USER_COOKIE_EXPIRY,
                });
                navigate('/', {
                    replace: true
                });
                message.success('Login successful');
            } else {
                message.error(res.response);
            }
        } catch (err) {
            console.log(err);
            message.error('Something went wrong, please try again later');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                height: '100vh',
                width: '100vw',
                backgroundColor: bgColor,
            }}
        >
            <Card
                style={{
                    backgroundColor: cardColor,
                    borderRadius: '10px',
                }}
                bodyStyle={{
                    padding: '0px',
                    height: '100%',
                    width: '100%',
                }}
                bordered = {false}
                hoverable
            >
                <div
                    className="d-flex justify-content-center align-items-center w-100 h-100"
                >
                    <Row
                        className="w-100 h-100"
                    >
                        <Col
                            xs={0} sm={0} md={12} lg={12} xl={12} xxl={12}
                            style={{
                                padding: '10px'
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    padding: '10px',
                                    borderRadius: '5px',
                                }}
                                className="d-flex justify-content-center align-items-center"
                            >
                                <Lottie
                                    options={{
                                        loop: true,
                                        autoplay: true,
                                        animationData: animationData,
                                        rendererSettings: {
                                            preserveAspectRatio: 'xMidYMid slice'
                                        }
                                    }}
                                    isClickToPauseDisabled={true}
                                    style={{
                                        cursor: 'default',
                                    }}
                                    isStopped={false}
                                    isPaused={false}
                                />
                            </div>
                        </Col>
                        <Col
                            xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}
                            style={{
                                padding: '10px'
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    backgroundColor: itemColor,
                                    borderRadius: '5px',
                                    padding: '10px'
                                }}
                                className="d-flex flex-column justify-content-around align-items-center"
                            >
                                <Title>
                                    Welcome Back
                                </Title>
                                <Form
                                    name="login"
                                    onFinish={onSubmit}
                                    labelCol={{
                                        span: 24,
                                    }}
                                    wrapperCol={{
                                        span: 24,
                                    }}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter your email!',
                                            },
                                        ]}
                                    >
                                        <Input style= {{
                                            border: 'none'
                                        }}prefix={<UserOutlined className="site-form-item-icon" />} placeholder='Email'/>
                                    </Form.Item>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter your password!',
                                            },
                                        ]}
                                    >
                                        <Input.Password style= {{
                                            border: 'none'
                                        }}prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Password'
                                        />
                                    </Form.Item>
                                    
                                    <Form.Item
                                    >
                                        <Button
                                            loading={loading}
                                            type="primary"
                                            htmlType="submit"
                                            style={{
                                                backgroundColor: darkColor,
                                                width: '100%',
                                                marginTop: '10px',
                                                boxShadow: 'none',
                                            }}
                                            size="large"
                                            shape="round"
                                        >
                                            Login
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
}