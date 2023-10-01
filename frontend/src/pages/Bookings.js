import { Card, List, Typography, Row, Col, message } from "antd";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { io } from 'socket.io-client';
import { itemColor, highlightBg } from "../constants/colors";
import moment from 'moment';

export default function Bookings(){
    const [loading, setLoading] = useState(true);
    const selectedSpace = useSelector((state) => state.space);
    const [data, setData] = useState({
        approvedBookings: [],
        pastBookings: [],
        space_id: '',
    });

    const socketing = async () => {
        if (!selectedSpace?._id) return;
        try {
            const socket = io(process.env.REACT_APP_SERVER_URL, {
                transports: ['websocket'],
            });
            socket.emit('getInitialBookinData', selectedSpace?._id);
            socket.on('initialBookingData', (payload) => {
                setData(payload);
            });
            socket.on('updatedBookData', (payload) => {
                if (payload?.space_id !== selectedSpace?._id) return;
                setData(payload);
            });
            socket.on('getUpdatedBookData', (id) => {
                if (id === selectedSpace?._id){
                    socket.emit('fetchUpdatedBookData', id);
                }
            });
            return () => {
                socket.disconnect();
            }
        } catch (error) {
            console.log(error);
            message.error('Something went wrong while fetching booking details');
        } finally {
            setLoading(false);
        }
    }
    console.log(data);

    useEffect(() => {
        socketing();
    }, [selectedSpace]);

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
                    <Typography.Title
                        level={4}
                    >
                        Approved Bookings
                    </Typography.Title>
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
                        dataSource={data?.approvedBookings}
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
                                    className="hoverable-antd-card"
                                >
                                    <Row
                                        justify="space-between"
                                        align="middle"
                                        gutter={[16,16]}
                                    >
                                        <Col
                                            // span={8}
                                        >
                                        <Typography.Title
                                            level={2}
                                            style={{
                                                margin: '0px',
                                                color: highlightBg,
                                            }}
                                        >
                                            {item.seat?.seatNumber}
                                        </Typography.Title>
                                        </Col>
                                        <Col
                                            // span={16}
                                        >
                                            <Typography.Title
                                                level={4}
                                                style={{
                                                    margin: '0px',
                                                }}
                                            >
                                                {item.roll_number}
                                            </Typography.Title>
                                        </Col>
                                    </Row>
                                    <Row
                                        justify="space-between"
                                        align="middle"
                                        gutter={[16,16]}
                                    >
                                        <Col
                                            // span={8}
                                        >
                                        <Typography.Title
                                            level={5}
                                            style={{
                                                margin: '0px',
                                                color: highlightBg,
                                            }}
                                        >
                                            {moment(item.timeOpted).format('hh:mm A')}
                                        </Typography.Title>
                                        </Col>
                                        <Col
                                            // span={16}
                                        >
                                            <Typography.Text
                                                style={{
                                                    margin: '0px',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                {
                                                    //if email is too long, truncate it
                                                    item.email.length > 15?
                                                    item.email.slice(0, 15) + '...' :
                                                    item.email
                                                }
                                            </Typography.Text>
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        )}
                    />
                    <Typography.Title
                        level={4}
                    >
                        Past Bookings
                    </Typography.Title>
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
                        dataSource={data?.pastBookings}
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
                                    className="hoverable-antd-card"
                                >
                                    <Row
                                        justify="space-between"
                                        align="middle"
                                        gutter={[16,16]}
                                    >
                                        <Col
                                            // span={8}
                                        >
                                        <Typography.Title
                                            level={2}
                                            style={{
                                                margin: '0px',
                                                color: highlightBg,
                                            }}
                                        >
                                            {item.seat?.seatNumber}
                                        </Typography.Title>
                                        </Col>
                                        <Col
                                            // span={16}
                                        >
                                            <Typography.Title
                                                level={4}
                                                style={{
                                                    margin: '0px',
                                                }}
                                            >
                                                {item.roll_number}
                                            </Typography.Title>
                                        </Col>
                                    </Row>
                                    <Row
                                        justify="space-between"
                                        align="middle"
                                        gutter={[16,16]}
                                    >
                                        <Col
                                            // span={8}
                                        >
                                        <Typography.Title
                                            level={5}
                                            style={{
                                                margin: '0px',
                                                color: highlightBg,
                                            }}
                                        >
                                            {moment(item.timeOpted).format('hh:mm A')}
                                        </Typography.Title>
                                        </Col>
                                        <Col
                                            // span={16}
                                        >
                                            <Typography.Text
                                                style={{
                                                    margin: '0px',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                {
                                                    //if email is too long, truncate it
                                                    item.email.length > 15?
                                                    item.email.slice(0, 15) + '...' :
                                                    item.email
                                                }
                                            </Typography.Text>
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </div>
    );
}