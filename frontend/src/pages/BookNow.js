import { Card, Typography, Col, Form, Row, Input, Dropdown, Button, message } from "antd";
import { bgColor, cardColor, darkColor, highlightBg, itemColor, lightColor } from "../constants/colors";
import { useEffect, useState } from "react";
import { BsBuildings, BsClock, BsLightningCharge } from "react-icons/bs";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import { GiDuration } from "react-icons/gi";
import moment from "moment";
import { _fetch } from "../_fetch";
import { seat_status } from "../constants/seat_status";
import Lottie from "react-lottie";
import * as animationData from '../assets/lottie/booknow.json';

const { Title } = Typography;
function BookNow() {
    const [spaceSelectedKey, setspaceSelectedKey] = useState('');
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [avlSeats, setAvlSeats] = useState(0);
    const [timeSelectedKey, setTimeSelectedKey] = useState('T0');
    const [durationSelectedKey, setDurationSelectedKey] = useState('D0');
    const [space, setSpace] = useState('Choose Space');
    const [spaces, setSpaces] = useState([]);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(false);
    const [electricity, setElectricity] = useState(false);
    const [computer, setComputer] = useState(false);
    const [form] = Form.useForm();

    const init = async () => {
        try {
            setLoading(true);
            let res = await _fetch(`${process.env.REACT_APP_API_URL}/space?populateSeats=1`, {
                method: 'GET'
            });
            res = await res.json();
            if (res.status === 200) {
                const updatedSpaces = res.response?.map((item) => {
                    const avlSeats = item.seats?.reduce((acc, seat) => {
                        if (seat.seatStatus === seat_status.AVAILABLE) {
                            return acc + 1;
                        }
                        return acc;
                    }, 0);
                    return {
                        ...item,
                        available_seats: avlSeats
                    }
                }, []);
                setSpaces(updatedSpaces);
                if (spaceSelectedKey !== ''){
                    const selectedSpace = updatedSpaces.find(item => item._id === spaceSelectedKey);
                    if (selectedSpace){
                        setspaceSelectedKey(selectedSpace._id);
                        setSpace(selectedSpace.name);
                        setAvlSeats(selectedSpace.available_seats);
                    }
                }
            } else {
                message.error(res.response);
            }
        } catch (err) {
            console.log(err);
            message.error('Something went wrong while fetching spaces');
        } finally {
            setLoading(false);
        }
    }
    let deferredPrompt;
    const handleBeforeInstallPrompt = (event) => {
        event.preventDefault();
        deferredPrompt = event;
        setShowInstallButton(true);
    }

    const handleInstallButtonClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(choice => {
                if (choice.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
                setShowInstallButton(false);
            });
        }
    }


    function getSpaceItems(item) {
        return {
            label: item.name,
            key: item._id,
            style: {
                backgroundColor: spaceSelectedKey === item._id ? highlightBg : 'transparent',
                color: spaceSelectedKey === item._id ? darkColor : lightColor,
            }
        }
    }

    function getTimeItems(label, key) {
        return {
            label: `After ${label} minutes`,
            value: label,
            key,
            style: {
                backgroundColor: timeSelectedKey === key ? highlightBg : 'transparent',
                color: timeSelectedKey === key ? darkColor : lightColor,
            }
        }
    }
    function getDurationItems(label, key) {
        return {
            label: `${label} Hours`,
            value: label,
            key,
            style: {
                backgroundColor: timeSelectedKey === key ? highlightBg : 'transparent',
                color: timeSelectedKey === key ? darkColor : lightColor,
            }
        }
    }



    const spaceMenuItems = spaces.map((item) => getSpaceItems(item));

    const timeMenuItems = [
        getTimeItems(10, 'T1'),
        getTimeItems(20, 'T2'),
        getTimeItems(30, 'T3'),
        getTimeItems(40, 'T4'),
        getTimeItems(50, 'T5'),
        getTimeItems(60, 'T6'),
    ];

    const durationMenuItems = [
        getDurationItems(0.5, 'D1'),
        getDurationItems(1, 'D2'),
        getDurationItems(1.5, 'D3'),
        getDurationItems(2, 'D4'),
        getDurationItems(2.5, 'D5'),
        getDurationItems(3, 'D6'),
    ];


    const handleSpaceMenuItemClick = (key) => {
        setspaceSelectedKey(key);
        const item = spaces.find((item) => item._id === key);
        setAvlSeats(item?.available_seats);
        setSpace(item.name);
    }

    const handleTimeMenuItemClick = (key) => {
        setTimeSelectedKey(key);
        const item = timeMenuItems.find((item) => item.key === key);
        setTime(item.value);
    }

    const handleDurationMenuItemClick = (key) => {
        setDurationSelectedKey(key);
        const item = durationMenuItems.find((item) => item.key === key);
        setDuration(item.value);
    }


    const onSubmit = async (values) => {
        try {
            setLoading(true);
            const timeOpted = moment().add(time, 'minutes').format('YYYY-MM-DD HH:mm:ss');
            let res = await _fetch(`${process.env.REACT_APP_API_URL}/booking`, {
                method: 'POST',
                body: {
                    roll_number: values.rollno,
                    email: values.email,
                    space: spaceSelectedKey,
                    expiresAt: moment(timeOpted).add(duration, 'hours').format('YYYY-MM-DD HH:mm:ss'),
                    timeOpted: timeOpted,
                    isElectricityOpted: electricity,
                    isComputerOpted: computer
                }
            });
            res = await res.json();
            if (res.status === 200) {
                await init();
                message.success('Booking Successful, mail will be sent 5 minutes before the opted time');
                form.resetFields();
                setspaceSelectedKey('');
                setTimeSelectedKey('');
                setDurationSelectedKey('');
                setSpace('Choose Space');
                setTime(0);
                setDuration(0);
            } else {
                message.error(res.response);
            }
        } catch (err) {
            console.log(err);
            message.error('Something went wrong while booking the seat')
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        init();
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: bgColor,
                width: '100vw',
            }}
            className="d-flex justify-content-center align-items-center"
        >
            <Card
                style={{
                    backgroundColor: cardColor,
                    borderRadius: '10px'
                }}
                bodyStyle={{
                    height: '100%',
                    width: '100%',
                    padding: '0px',
                }}
                bordered={false}
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
                                padding: '10px',
                                maxWidth: '40vw'
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
                                            preserveAspectRatio: 'xMidYMid meet'
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
                                    padding: '10px',
                                }}
                                className="d-flex flex-column justify-content-around align-items-center"
                            >
                                <Card
                                    bodyStyle={{
                                        padding: '16px',
                                    }}
                                    style={{
                                        backgroundColor: cardColor,
                                        border: `2px solid ${cardColor}`,
                                        borderRadius: '8px',
                                        width: '100%',
                                    }}
                                    hoverable
                                    className="hoverable-antd-card"
                                >
                                    <Typography.Title
                                        level={
                                            spaceSelectedKey === '' ? 5 : 4
                                        }
                                        style={{
                                            margin: '0px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {
                                            spaceSelectedKey === '' ? 'Please choose a space to view available seats' : `Available Seats: ${avlSeats}`
                                        }
                                    </Typography.Title>

                                </Card>
                                <Form
                                    name="booknow"
                                    labelCol={{
                                        span: 24,
                                    }}
                                    wrapperCol={{
                                        span: 24,
                                    }}
                                    autoComplete="off"
                                    onFinish={onSubmit}
                                    className="book-now-form"
                                >
                                    <Form.Item
                                        label='Roll Number'
                                        name='rollno'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter your roll number',
                                            },
                                        ]}
                                        style={{
                                            margin: '2px 0'
                                        }}
                                    >
                                        <Input style={{
                                            border: 'none'
                                        }} placeholder='Roll Number' />

                                    </Form.Item>
                                    <Form.Item
                                        label='Email'
                                        name='email'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter your email',
                                            },
                                        ]}
                                        style={{
                                            margin: '2px 0'
                                        }}
                                    >
                                        <Input style={{
                                            border: 'none'
                                        }} placeholder='Email' />
                                    </Form.Item>
                                    <Form.Item
                                        label='Preferences'
                                        style={{
                                            width: '100%',
                                            margin: '2px 0'
                                        }}
                                    >
                                        <Row
                                            justify="space-between"
                                            align="start"
                                            gutter={[16, 16]}
                                        >
                                            <Col
                                                span={12}
                                            >
                                                <div
                                                    className="d-flex flex-column"
                                                >
                                                    <Button
                                                        type="primary"
                                                        style={{
                                                            backgroundColor: electricity ? highlightBg : bgColor,
                                                            color: electricity ? darkColor : lightColor,
                                                            width: '100%',
                                                            boxShadow: 'none',
                                                        }}
                                                        icon={
                                                            <BsLightningCharge />
                                                        }
                                                        onClick={() => {
                                                            setElectricity(!electricity);
                                                        }}
                                                    />
                                                    <p
                                                        style={{
                                                            fontSize: '9px',
                                                            textAlign: "center",
                                                            margin: '4px 0px'
                                                        }}
                                                    >With electricity board</p>
                                                </div>
                                            </Col>
                                            <Col
                                                span={12}
                                            >
                                                <div
                                                    className="d-flex flex-column"
                                                >
                                                    <Button
                                                        type="primary"
                                                        style={{
                                                            backgroundColor: computer ? highlightBg : bgColor,
                                                            color: computer ? darkColor : lightColor,
                                                            width: '100%',
                                                            boxShadow: 'none',
                                                        }}
                                                        icon={
                                                            <HiOutlineDesktopComputer />
                                                        }
                                                        onClick={() => {
                                                            setComputer(!computer);
                                                        }}
                                                    />
                                                    <p
                                                        style={{
                                                            fontSize: '9px',
                                                            textAlign: "center",
                                                            margin: '4px 0px'
                                                        }}
                                                    >With Computer</p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    <Form.Item
                                        name='start_time'
                                        label='Start Time'
                                        rules={[
                                            {
                                                validator: () => {
                                                    if (timeSelectedKey === 'T0') {
                                                        return Promise.reject(new Error('Please select a time'));
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                        style={{
                                            margin: '2px 0'
                                        }}
                                        required
                                    >
                                        <Dropdown
                                            trigger={['click']}
                                            menu={{
                                                onClick: ({ key }) => handleTimeMenuItemClick(key),
                                                items: timeMenuItems,
                                                defaultSelectedKeys: [timeSelectedKey],
                                                selectedKeys: [timeSelectedKey],
                                                style: {
                                                    boxShadow: 'none',
                                                }
                                            }}
                                        >
                                            <Button
                                                size="large"
                                                type="primary"
                                                icon={<BsClock
                                                    style={{
                                                        marginRight: '5px',
                                                    }}
                                                />}
                                                style={{
                                                    width: '100%',
                                                    boxShadow: 'none',
                                                    color: darkColor,
                                                }}
                                            >
                                                {
                                                    time === 0 ? 'Choose Start Time' : `${time} minutes`
                                                }
                                            </Button>
                                        </Dropdown>
                                    </Form.Item>
                                    <Form.Item
                                        name='duration'
                                        label='Duration'
                                        rules={[
                                            {
                                                validator: () => {
                                                    if (durationSelectedKey === 'D0') {
                                                        return Promise.reject(new Error('Please select the duration'));
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                        required
                                        style={{
                                            margin: '2px 0 8px 0'
                                        }}
                                    >
                                        <Dropdown
                                            trigger={['click']}
                                            menu={{
                                                onClick: ({ key }) => handleDurationMenuItemClick(key),
                                                items: durationMenuItems,
                                                defaultSelectedKeys: [durationSelectedKey],
                                                selectedKeys: [durationSelectedKey],
                                                style: {
                                                    boxShadow: 'none',
                                                }
                                            }}
                                        >
                                            <Button
                                                size="large"
                                                type="primary"
                                                icon={<GiDuration
                                                    style={{
                                                        marginRight: '5px',
                                                    }}
                                                />}
                                                style={{
                                                    width: '100%',
                                                    boxShadow: 'none',
                                                    color: darkColor,
                                                }}
                                            >
                                                {
                                                    duration === 0 ? 'Choose Duration' : `${duration} hours`
                                                }
                                            </Button>
                                        </Dropdown>
                                    </Form.Item>
                                    <Form.Item
                                        name='space'
                                        rules={[
                                            {
                                                validator: () => {
                                                    if (spaceSelectedKey === '') {
                                                        return Promise.reject(new Error('Please select a space'));
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                        style={{
                                            margin: '2px 0 8px 0'
                                        }}
                                    >
                                        <Dropdown
                                            trigger={['click']}
                                            menu={{
                                                onClick: ({ key }) => handleSpaceMenuItemClick(key),
                                                items: spaceMenuItems,
                                                defaultSelectedKeys: [spaceSelectedKey],
                                                selectedKeys: [spaceSelectedKey],
                                                style: {
                                                    boxShadow: 'none',
                                                }
                                            }}
                                        >
                                            <Button
                                                size="large"
                                                type="primary"
                                                icon={<BsBuildings
                                                    style={{
                                                        marginRight: '5px',
                                                    }}
                                                />}
                                                style={{
                                                    width: '100%',
                                                    boxShadow: 'none',
                                                    color: darkColor,
                                                }}
                                            >
                                                {space}
                                            </Button>
                                        </Dropdown>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            style={{
                                                backgroundColor: darkColor,
                                                width: '100%',
                                                marginTop: '10px',
                                                boxShadow: 'none',
                                            }}
                                            size="large"
                                            loading={loading}
                                        >
                                            Book Now
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

export default BookNow;