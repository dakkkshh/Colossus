import { Card, List, Typography, Row, Col } from "antd";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { itemColor, highlightBg } from "../constants/colors";

export default function Bookings(){
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    const data = [
        {
            id: 1,
            email: 'nishant@mail.com',
            roll: '2022987',
            time: '10:00 AM',
            seat: 'A9999',
        },
        {
            id: 2,
            email: 'mark@mail.com',
            roll: '2022952',
            time: '10:00 AM',
            seat: 'A2',
        },
        {
            id: 3,
            email: 'jimmy@mail.com',
            roll: '2022953',
            time: '10:00 AM',
            seat: 'A3',
        },
        {
            id: 4,
            email: 'harry@mail.com',
            roll: '2022954',
            time: '10:00 AM',
            seat: 'A4',
        },
        {
            id: 5,
            email: 'amit@mail.com',
            roll: '2022955',
            time: '10:00 AM',
            seat: 'A5',
        },
        {
            id: 6,
            email: 'guri@mail.com',
            roll: '2022956',
            time: '10:00 AM',
            seat: 'A6',
        },
        {
            id: 7,
            email: 'temp@mail.com',
            roll: '2022957',
            time: '10:00 AM',
            seat: 'A7',
        },
        {
            id: 8,
            email: 'dakkkshh@mail.com',
            roll: '2022957',
            time: '99:99 AM',
            seat: 'A8',
        },
        {
            id: 9,
            email: 'helloworld@mail.com',
            roll: '2022957',
            time: '10:00 AM',
            seat: 'A9',
        },
        {
            id: 10,
            email: 'daksh122001122001@mail.com',
            roll: '2022957',
            time: '10:00 AM',
            seat: 'A10',
        },
        {
            id: 11,
            email: 'testgmail@mail.com',
            roll: '2022957',
            time: '10:00 AM',
            seat: 'B1',
        }
    ];

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
                        dataSource={data}
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
                                            {item.seat}
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
                                                {item.roll}
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
                                            {item.time}
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