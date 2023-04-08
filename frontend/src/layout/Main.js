import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Drawer, theme, Card } from 'antd';
import Sidenav from './Sidenav';
import Header from './Header';
import Footer from './Footer';
import { bgColor, cardColor } from '../constants/colors';

const { Header: AntHeader, Content, Sider, Footer: AntFooter } = Layout;

function Main ({children}){
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout
            style={{
                backgroundColor: bgColor,
                minHeight: '100vh',
            }}
        >
            <Sider breakpoint='md' collapsible width={'210px'} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} theme='light' style={{
                backgroundColor: bgColor,
            }}>
                <Sidenav collapsed={collapsed}/>
            </Sider>
            <Layout className="site-layout">
                <AntHeader
                    theme='light'
                    style={{
                        backgroundColor: 'transparent',
                    }}
                >
                    <Header />
                </AntHeader>
                <Content className="content-ant pb-4" style={{
                    backgroundColor: 'transparent',
                    margin: '8px 24px',
                }}>
                    <Card
                        style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: cardColor,
                        }}
                        bodyStyle={{
                            padding: '16px',
                        }}
                        bordered={false}
                    >
                        {children}
                    </Card>
                </Content>
                <AntFooter
                    style={{
                        backgroundColor: 'transparent',
                    }}
                >
                    <Footer />
                </AntFooter>
            </Layout>
        </Layout>

    );
}

export default Main;