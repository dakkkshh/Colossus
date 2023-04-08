import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { Card, Col, Divider, List, Row, Typography, message } from "antd";
import { _fetch } from "../_fetch";
import { seat_status } from "../constants/seat_status";
import {io} from 'socket.io-client';
import { BulbOutlined } from '@ant-design/icons';
import { HiOutlineDesktopComputer, HiOutlineWifi } from "react-icons/hi";
import { TbAirConditioning } from "react-icons/tb";
import { accentColor, darkColor, highlightBg, itemColor } from "../constants/colors";

export default function Home() {
    const selectedSpace = useSelector((state) => state.space);
    const [loading, setLoading] = useState(true);
    const [space, setSpace] = useState({});
    const [seatInfo, setSeatInfo] = useState({
        totalSeats: 0,
        availableSeats: 0,
        occupiedSeats: 0,
        reservedSeats: 0,
    });

    // const init = async () => {
    //     return;
    //     if (!selectedSpace._id) return;
    //     try {
    //         setLoading(true);
    //         let res = await _fetch(`${process.env.REACT_APP_API_URL}/space/${selectedSpace._id}?populateSeats=1`, {
    //             method: 'GET'
    //         });
    //         res = await res.json();
    //         if (res.status === 200) {
    //             setSpace(res.response);
    //             setSeatInfo({
    //                 totalSeats: res.response?.seats?.length,
    //                 availableSeats: res.response?.seats?.filter((seat) => seat.seatStatus === seat_status.AVAILABLE).length,
    //                 occupiedSeats: res.response?.seats?.filter((seat) => seat.status === seat_status.OCCUPIED).length,
    //                 reservedSeats: res.response?.seats?.filter((seat) => seat.status === seat_status.RESERVED).length,
    //             });
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         message.error('Something went wrong while fetching space details');
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const socketing = async () => {
        if (!selectedSpace?._id) return;
        try {
            const socket = io(process.env.REACT_APP_SERVER_URL);
                socket.emit('getInitialHomeData', selectedSpace?._id);
                socket.on('initialHomeData', (data) => {
                    setSpace(data);
                    setSeatInfo({
                        totalSeats: data?.seats?.length,
                        availableSeats: data?.seats?.filter((seat) => seat.seatStatus === seat_status.AVAILABLE).length,
                        occupiedSeats: data?.seats?.filter((seat) => seat.status === seat_status.OCCUPIED).length,
                        reservedSeats: data?.seats?.filter((seat) => seat.status === seat_status.RESERVED).length,
                    });
                });
                socket.on('homeDataUpdated', (data) => {
                    setSpace(data);
                    setSeatInfo({
                        totalSeats: data?.seats?.length,
                        availableSeats: data?.seats?.filter((seat) => seat.seatStatus === seat_status.AVAILABLE).length,
                        occupiedSeats: data?.seats?.filter((seat) => seat.status === seat_status.OCCUPIED).length,
                        reservedSeats: data?.seats?.filter((seat) => seat.status === seat_status.RESERVED).length,
                    });
                });
                return () => {
                    socket.disconnect();
                }
        } catch (error) {
            console.log(error);
            message.error('Something went wrong while fetching space details');
        } finally {
            setLoading(false);
        }
    }

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
                    <Row
                        gutter={[16, 16]}
                        align={"middle"}
                        justify={"center"}
                    >
                        <Col
                            xs={24}
                            sm={12}
                            md={12}
                            lg={6}
                            xl={6}
                            xxl={6}
                        >
                            <Card
                                bodyStyle={{
                                    padding: '16px',
                                }}
                                style={{
                                    backgroundColor: itemColor,
                                    border: `2px solid ${itemColor}`,
                                    borderRadius: '8px',
                                }}
                                className="hoverable-antd-card"
                            >
                                <Typography.Title
                                    level={4}
                                    style={{
                                        margin: 0,
                                    }}
                                >
                                    {`Total: ${seatInfo.totalSeats}`}
                                </Typography.Title>
                            </Card>
                        </Col>
                        <Col
                            xs={24}
                            sm={12}
                            md={12}
                            lg={6}
                            xl={6}
                            xxl={6}
                        >
                            <Card
                                bodyStyle={{
                                    padding: '16px',
                                }}
                                style={{
                                    backgroundColor: itemColor,
                                    border: `2px solid ${itemColor}`,
                                    borderRadius: '8px',
                                }}
                                className="hoverable-antd-card"
                            >
                                <Typography.Title
                                    level={4}
                                    style={{
                                        margin: 0,
                                    }}
                                >
                                    {`Available: ${seatInfo.availableSeats}`}
                                </Typography.Title>
                            </Card>
                        </Col>
                        <Col
                            xs={24}
                            sm={12}
                            md={12}
                            lg={6}
                            xl={6}
                            xxl={6}
                        >
                            <Card
                                bodyStyle={{
                                    padding: '16px',
                                }}
                                style={{
                                    backgroundColor: itemColor,
                                    border: `2px solid ${itemColor}`,
                                    borderRadius: '8px',
                                }}
                                className="hoverable-antd-card"
                            >
                                <Typography.Title
                                    level={4}
                                    style={{
                                        margin: 0,
                                    }}
                                >
                                    {`Reserved: ${seatInfo.reservedSeats}`}
                                </Typography.Title>
                            </Card>
                        </Col>
                        <Col
                            xs={24}
                            sm={12}
                            md={12}
                            lg={6}
                            xl={6}
                            xxl={6}
                        >
                            <Card
                                bodyStyle={{
                                    padding: '16px',
                                }}
                                style={{
                                    backgroundColor: itemColor,
                                    border: `2px solid ${itemColor}`,
                                    borderRadius: '8px',
                                }}
                                className="hoverable-antd-card"
                            >
                                <Typography.Title
                                    level={4}
                                    style={{
                                        margin: 0,
                                    }}
                                >
                                    {`Occupied: ${seatInfo.occupiedSeats}`}
                                </Typography.Title>
                            </Card>
                        </Col>
                    </Row>
                    <Divider
                        style={{
                            backgroundColor: itemColor,
                        }}
                    />
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
                                {space?.name}
                            </Typography.Title>
                            {
                                space?.isAc && (
                                    <TbAirConditioning
                                        style={{
                                            color: highlightBg,
                                            margin: '0 4px 0 0',
                                        }}
                                    />
                                )
                            }
                            {
                                space?.isWifi && (
                                    <HiOutlineWifi
                                        style={{
                                            color: highlightBg,
                                            margin: '0 4px 0 0',
                                        }}
                                    />
                                )
                            }
                            {
                                space?.isComputers && (
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
                            dataSource={space?.seats}
                            renderItem={(item) => (
                                <List.Item>
                                    <Card
                                        style={{
                                            backgroundColor: item?.seatStatus === seat_status.AVAILABLE ? highlightBg : item?.seatStatus === seat_status.RESERVED ? 'orange' : accentColor,
                                        }}
                                        bodyStyle={{
                                            padding: '8px',
                                        }}
                                        bordered={false}
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
                </div>
            )}
        </div>
    );
}