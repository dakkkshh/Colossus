import { Card, List, Typography, Modal, Row, Col, Form, Input, InputNumber, Button, message } from "antd";
import { useEffect, useState } from "react";
import { itemColor, highlightBg, darkColor, lightColor, bgColor } from "../constants/colors";
import Loader from "../components/Loader";
import { AppstoreAddOutlined } from '@ant-design/icons';
import { HiOutlineDesktopComputer, HiOutlineWifi } from "react-icons/hi";
import { TbAirConditioning } from "react-icons/tb";
import { seat_status } from "../constants/seat_status";
import { _fetch } from "../_fetch";
import { accentColor } from "../constants/colors";
import { BulbOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { updateToggle } from "../store/action/toggle";

export default function ManageSpaces() {
    const dispatch = useDispatch();
    const toggle = useSelector(state => state.toggle);
    const space = useSelector(state => state.space);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isWifi, setIsWifi] = useState(false);
    const [isComputers, setIsComputers] = useState(false);
    const [isAc, setIsAc] = useState(false);
    const [spaces, setSpaces] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null);

    const init = async () => {
        try {
            setLoading(true);
            let res = await _fetch(`${process.env.REACT_APP_API_URL}/space?populateSeats=1`, {
                method: 'GET'
            });
            res = await res.json();
            if (res.status === 200) {
                setSpaces(res.response);
            } else {
                message.error(res.response);
            }
        } catch (err) {
            console.log(err);
            message.error('Something went wrong while fetching the spaces')
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        init();
    }, []);

    const addSpace = async (values) => {
        try {
            setLoading(true);
            let res = await _fetch(`${process.env.REACT_APP_API_URL}/space`, {
                method: 'POST',
                body: {
                    name: values.name,
                    isWifi,
                    isComputers,
                    isAc,
                    seats: {
                        total_seats: values.total_seats ? values.total_seats : 0,
                        electricity_only: values.electricity_only ? values.electricity_only : 0,
                        computers_only: values.computers_only ? values.computers_only : 0,
                        electricity_computers: values.electricity_computers ? values.electricity_computers : 0,
                    }
                }
            });
            res = await res.json();
            if (res.status === 200) {
                await init();
                setVisible(false);
                dispatch(updateToggle({
                    toggle: !toggle.toggle,
                    toDispatchSpace: false
                }));
                message.success('Space added successfully');
            } else {
                message.error(res.response);
            }

        } catch (err) {
            console.log(err);
            message.error('Something went wrong while adding the space')
        } finally {
            setLoading(false);
        }
    }

    const deleteSpace = async () => {
        if (selectedSpace === null) return;
        try {
            setLoading(true);
            let res = await _fetch(`${process.env.REACT_APP_API_URL}/space/${selectedSpace?._id}`, {
                method: 'DELETE', 
            });
            res = await res.json();
            if (res.status === 200){
                message.success(res.response);
                dispatch(updateToggle({
                    toggle: !toggle.toggle,
                    toDispatchSpace: selectedSpace?._id === space?._id,
                }));
                setSelectedSpace(null);
                await init();
            } else {
                message.error(res.response);
            }
        } catch (err) {
            console.log(err);
            message.error('Something went wrong while deleting the space')
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
                        width: "100%",
                    }}
                >
                    <Row
                        style={{
                            width: '100%',
                            marginBottom: '16px',
                        }}
                    >
                        <Col
                            span={24}
                        >
                            <Card
                                hoverable
                                style={{
                                    backgroundColor: highlightBg,
                                    border: 'none',
                                    borderRadius: '8px',
                                }}
                                bodyStyle={{
                                    padding: '8px',
                                }}
                                onClick={() => {
                                    setVisible(true);
                                }}
                            >
                                <div
                                    className="w-100 h-100 d-flex flex-row align-items-center justify-content-center"
                                >
                                    <AppstoreAddOutlined
                                        style={{
                                            margin: '0px 8px',
                                            color: itemColor,
                                            fontSize: '18px'
                                        }}
                                    />
                                    <Typography.Title
                                        level={3}
                                        style={{
                                            margin: '0px',
                                            color: itemColor
                                        }}
                                    >
                                        Add Space
                                    </Typography.Title>
                                </div>

                            </Card>
                        </Col>
                    </Row>
                    <List
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 1,
                            md: 2,
                            lg: 2,
                            xl: 4,
                            xxl: 4,
                        }}
                        dataSource={spaces}
                        renderItem={item => (
                            <List.Item>
                                <Card
                                    hoverable
                                    style={{
                                        backgroundColor: itemColor,
                                        border: `2px solid ${itemColor}`,
                                        borderRadius: '8px',
                                    }}
                                    bodyStyle={{
                                        padding: '8px',
                                    }}
                                    onClick={() => {
                                        setSelectedSpace(item);
                                    }}
                                    className="hoverable-antd-card"
                                >
                                    <Typography.Title
                                        style={{
                                            color: highlightBg,
                                            margin: '0px',
                                        }}
                                        level={3}
                                    >
                                        {item.name}
                                    </Typography.Title><div
                                        className="d-flex justify-content-start align-items-center"
                                    >
                                        <Typography.Title
                                            level={4}
                                            style={{
                                                margin: '0px',
                                            }}
                                        >
                                            Seats:
                                        </Typography.Title>
                                        <Typography.Title
                                            level={4}
                                            style={{
                                                margin: '0px 6px',
                                            }}
                                        >
                                            {item.seats?.length}
                                        </Typography.Title>

                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                    <Modal
                        title='Add Space'
                        open={visible}
                        footer={null}
                        onCancel={() => {
                            setVisible(false);
                        }}
                        destroyOnClose
                    >
                        <Form
                            labelCol={{
                                span: 10,
                            }}
                            wrapperCol={{
                                span: 14,
                            }}
                            layout="horizontal"
                            onFinish={addSpace}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the name!',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Space Name"
                                    style={{
                                        border: 'none',
                                        backgroundColor: itemColor,
                                    }}
                                />
                            </Form.Item>
                            <div
                                className="d-flex flex-row"
                                style={{
                                    marginBottom: '16px',
                                }}
                            >
                                <Button
                                    type="primary"
                                    style={{
                                        backgroundColor: isAc ? highlightBg : bgColor,
                                        color: isAc ? darkColor : lightColor,
                                        width: '100%',
                                        boxShadow: 'none',
                                        margin: '0px 8px',
                                        border: `2px solid ${highlightBg}`
                                    }}
                                    icon={
                                        <TbAirConditioning />
                                    }
                                    onClick={() => {
                                        setIsAc(!isAc);
                                    }}
                                />
                                <Button
                                    type="primary"
                                    style={{
                                        backgroundColor: isWifi ? highlightBg : bgColor,
                                        color: isWifi ? darkColor : lightColor,
                                        width: '100%',
                                        boxShadow: 'none',
                                        margin: '0px 8px',
                                        border: `2px solid ${highlightBg}`
                                    }}
                                    icon={
                                        <HiOutlineWifi />
                                    }
                                    onClick={() => {
                                        setIsWifi(!isWifi);
                                    }}
                                />
                                <Button
                                    type="primary"
                                    style={{
                                        backgroundColor: isComputers ? highlightBg : bgColor,
                                        color: isComputers ? darkColor : lightColor,
                                        width: '100%',
                                        boxShadow: 'none',
                                        margin: '0px 8px',
                                        border: `2px solid ${highlightBg}`
                                    }}
                                    icon={
                                        <HiOutlineDesktopComputer />
                                    }
                                    onClick={() => {
                                        setIsComputers(!isComputers);
                                    }}
                                />
                            </div>
                            <div
                                className="d-flex flex-row justify-content-center"
                            >
                                <Typography.Text
                                    style={{
                                        color: highlightBg,
                                        marginBottom: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    Seat Information
                                </Typography.Text>
                            </div>
                            <Form.Item
                                label="Total Seats"
                                name="total_seats"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the value!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    placeholder="Total Seats"
                                    min={0}
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        backgroundColor: itemColor,
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="With Electricity Only"
                                name="electricity_only"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the value!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    placeholder="Only Electricity"
                                    min={0}
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        backgroundColor: itemColor,
                                    }}
                                />
                            </Form.Item>
                            {
                                isComputers && (
                                    <Form.Item
                                        label="With Computers Only"
                                        name="computers_only"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter the value!',
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="Only Computers"
                                            min={0}
                                            style={{
                                                width: '100%',
                                                border: 'none',
                                                backgroundColor: itemColor,
                                            }}
                                        />
                                    </Form.Item>
                                )
                            }
                            {
                                isComputers && (
                                    <Form.Item
                                        label="With Both"
                                        name="electricity_computers"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter the value!',
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="With Both"
                                            min={0}
                                            style={{
                                                width: '100%',
                                                border: 'none',
                                                backgroundColor: itemColor,
                                            }}
                                        />
                                    </Form.Item>
                                )
                            }
                            <Form.Item
                                wrapperCol={{
                                    offset: 10,
                                    span: 14,
                                }}
                            >
                                <Button
                                    type="primary"
                                    style={{
                                        border: 'none',
                                        boxShadow: 'none',
                                        color: darkColor
                                    }}
                                    htmlType="submit"
                                >
                                    Add Space
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        title='Space Details'
                        open={selectedSpace !== null}
                        okText='Delete Space'
                        okButtonProps={{
                            style: {
                                border: 'none',
                                boxShadow: 'none'
                            },
                            danger: true,
                            disabled: selectedSpace?.name?.toLowerCase().includes('colossus')
                        }}
                        cancelButtonProps={{
                            style: {
                                border: 'none',
                                boxShadow: 'none'
                            },
                        }}
                        onCancel={() => {
                            setSelectedSpace(null);
                        }}
                        destroyOnClose
                        onOk={deleteSpace}
                    >
                        {
                            selectedSpace !== null && (
                                <div>
                                    <div
                                        className="d-flex flex column align-items-center justify-content-start"
                                        style={{
                                            marginBottom: '16px'
                                        }}
                                    >
                                        <Typography.Title
                                            level={4}
                                            style={{
                                                margin: '0 8px 0 0',
                                            }}
                                        >
                                            {selectedSpace?.name}
                                        </Typography.Title>
                                        {
                                            selectedSpace?.isAc && (
                                                <TbAirConditioning
                                                    style={{
                                                        color: highlightBg,
                                                        margin: '0 4px 0 0',
                                                    }}
                                                />
                                            )
                                        }
                                        {
                                            selectedSpace?.isWifi && (
                                                <HiOutlineWifi
                                                    style={{
                                                        color: highlightBg,
                                                        margin: '0 4px 0 0',
                                                    }}
                                                />
                                            )
                                        }
                                        {
                                            selectedSpace?.isComputers && (
                                                <HiOutlineDesktopComputer
                                                    style={{
                                                        color: highlightBg,
                                                        margin: '0 4px 0 0',
                                                    }}
                                                />
                                            )
                                        }
                                    </div>
                                    <List
                                        grid={{
                                            gutter: 16,
                                            xs: 2,
                                            sm: 2,
                                            md: 2,
                                            lg: 2,
                                            xl: 4,
                                            xxl: 4,
                                        }}
                                        dataSource={selectedSpace?.seats}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <Card
                                                    style={{
                                                        backgroundColor: item?.seatStatus === seat_status.AVAILABLE ? highlightBg : item?.seatStatus === seat_status.RESERVED ? 'orange' : accentColor,
                                                    }}
                                                    bodyStyle={{
                                                        padding: '8px',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            marginBottom: '2px',
                                                        }}
                                                    >
                                                        <Typography.Title
                                                            level={5}
                                                            style={{
                                                                margin: 0,
                                                                color: darkColor,
                                                            }}
                                                        >
                                                            {item.seatNumber}
                                                        </Typography.Title>
                                                    </div>
                                                    <div
                                                        style={{
                                                            marginBottom: '2px',
                                                        }}
                                                    >
                                                        <Typography.Text
                                                            style={{
                                                                margin: 0,
                                                                color: darkColor,
                                                            }}
                                                        >
                                                            {item.seatStatus}
                                                        </Typography.Text>
                                                    </div>
                                                    <div
                                                        className="d-flex flex-row justify-content-start"
                                                    >
                                                        {
                                                            item?.isElectricity && (
                                                                <BulbOutlined
                                                                    style={{
                                                                        color: darkColor,
                                                                        margin: '0 4px 0 0'
                                                                    }}
                                                                />    
                                                            )
                                                        }
                                                        {
                                                            item?.isComputer && (
                                                                <HiOutlineDesktopComputer
                                                                    style={{
                                                                        color: darkColor,
                                                                        margin: '0 4px 0 0'
                                                                    }}
                                                                />    
                                                            )
                                                        }
                                                    </div>
                                                </Card>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            )
                        }
                    </Modal>
                </div>
            )}
        </div>
    );
}