import { Divider, Menu } from 'antd';
import { useSelector } from 'react-redux';
import icon from '../assets/images/icon.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, SettingOutlined, UserOutlined, DesktopOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { cardColor, darkColor, lightColor, highlightBg  } from '../constants/colors';
import { user_roles } from '../constants/user_roles';

function Sidenav({
    collapsed,
}) {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const page = pathname.replace('/', '');
    let { role } = useSelector(st => st.user);
    
    function getItem(label, key, routeName, icon, children) {
        return {
            label,
            key,
            icon,
            children,
            title: '',
            onClick: () => {
                if (page !== routeName) navigate(`/${routeName}`);
            },
            style: {
                backgroundColor: page === routeName ? highlightBg : 'transparent',
                color: page === routeName ? darkColor : lightColor,
            }
        };
    }

    const items = [
        getItem('Home', '1', '', <HomeOutlined />),
        getItem('Bookings', '2', 'bookings', <UnorderedListOutlined />),
        role === user_roles.ADMIN && getItem('Manage Spaces', '3', 'manage-spaces', <DesktopOutlined />),
        getItem('Profile', '4', 'profile', <UserOutlined />),
        role === user_roles.ADMIN && getItem('Admin Panel', '5', 'admin-panel', <SettingOutlined />),
    ];

    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent'
            }}
        >
            <div
                style={{
                    width: '100%',
                    marginLeft: '10px',
                    backgroundColor: cardColor,
                    borderRadius: '10px',
                    padding: '10px',
                }}
            >
                <div className="brand text-center" >
                    {
                        collapsed && (
                            <img src={icon} alt="Colossus" style={{
                                marginTop: '10px',
                                height: '35px',
                                width: '35px',
                            }}/>
                        )
                    }
                    {
                        !collapsed && (
                            <div style={{
                                marginTop: '10px',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#0093E9',
                                backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
                                borderRadius: '50px',
                            }}
                            >
                                <p
                                    level={2}
                                    style={{
                                        margin: '0px',
                                        padding: '0px',
                                        color: lightColor,
                                        fontSize: '30px',
                                        userSelect: 'none',
                                    }}
                                >
                                    Colossus
                                </p>
                            </div>
                        )
                    }
                </div>
                <Divider />
                <Menu theme='light' mode='inline' items={items} style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
                />
            </div>
        </div>
    );
}

export default Sidenav;