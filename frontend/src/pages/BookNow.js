import { Card, Col, Form, Row, Input, Dropdown, Button, message } from "antd";
import { bgColor, cardColor, darkColor, highlightBg, lightColor } from "../constants/colors";
import { useState } from "react";
import { BsBuildings, BsClock, BsLightningCharge } from "react-icons/bs";
import { HiOutlineDesktopComputer } from "react-icons/hi";


function BookNow() {
    const [spaceSelectedKey, setspaceSelectedKey] = useState('0');
    const [timeSelectedKey, setTimeSelectedKey] = useState('0');
    const [durationSelectedKey, setDurationSelectedKey] = useState('0');
    const [space, setSpace] = useState('Choose Space');
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(false);
    const [electricity, setElectricity] = useState(false);
    const [computer, setComputer] = useState(false);


    function getSpaceItems(label, key) {
        return {
            label,
            key,
            style: {
                backgroundColor: spaceSelectedKey === key ? highlightBg : 'transparent',
                color: spaceSelectedKey === key ? darkColor : lightColor,
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

    const spaceMenuItems = [
        getSpaceItems('KRC Cubicles', '1'),
        getSpaceItems('Study Room', '2'),
        getSpaceItems('IT Cell - 1', '3'),
        getSpaceItems('IT Cell - 2', '4'),
        getSpaceItems('IT Cell - 3', '5'),
    ];

    const timeMenuItems = [
        getTimeItems(5, '1'),
        getTimeItems(10, '2'),
        getTimeItems(15, '3'),
        getTimeItems(20, '4'),
        getTimeItems(25, '5'),
        getTimeItems(30, '6'),
        getTimeItems(35, '7'),
        getTimeItems(40, '8'),
        getTimeItems(45, '9'),
        getTimeItems(50, '10'),
        getTimeItems(55, '11'),
        getTimeItems(60, '12'),
    ];

    const durationMenuItems = [ 
        getDurationItems(0.5, '1'),
        getDurationItems(1, '1'),
        getDurationItems(1.5, '1'),
        getDurationItems(2, '2'),
        getDurationItems(2.5, '2'),
        getDurationItems(3, '3'),
    ];
        

    const handleSpaceMenuItemClick = (key) => {
        setspaceSelectedKey(key);
        const item = spaceMenuItems.find((item) => item.key === key);
        setSpace(item.label);
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
        

    const onSubmit = (values) => {
        setLoading(true);
        console.log(values);
        message.success('Booking Successful');

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }
    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: bgColor,
                width: '100%',
                padding: '0px 16px',
            }}
            className="d-flex justify-content-center align-items-center"
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
                bordered={false}
                hoverable
            >
                <Row
                    justify="center"
                    align="middle"
                >
                    <Col
                        xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}
                        style={{
                            padding: '10px'
                        }}
                    >
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
                                name='preferences'
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
                                            if (timeSelectedKey === '0') {
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
                                            if (durationSelectedKey === '0') {
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
                                            if (spaceSelectedKey === '0') {
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

                    </Col>
                </Row>
            </Card>



        </div>
    );
}

export default BookNow;