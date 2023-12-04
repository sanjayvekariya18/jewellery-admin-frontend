import {
  Badge,
  Button,
  Card,
  Drawer,
  Icon,
  IconButton,
  ThemeProvider,
  Box,
  styled,
  useTheme
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useNotification from '../../hooks/useNotification';
import useSettings from '../../hooks/useSettings';
import { sideNavWidth, topBarHeight } from '../../utils/constant';
import { getTimeDifference } from '../../utils/utils.js';
import { themeShadows } from '../MatxTheme/themeColors';
import { Paragraph, Small } from '../Typography';
import { API_BASE_URL } from '../../constants/config.js';
import io from 'socket.io-client';
import { API, HELPER } from '../../services/index.js';
import apiConfig from '../../config/apiConfig.js';


const Notification = styled('div')(() => ({
  padding: '16px',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  height: topBarHeight,
  boxShadow: themeShadows[6],
  '& h5': {
    marginLeft: '8px',
    marginTop: 0,
    marginBottom: 0,
    fontWeight: '500'
  }
}));

const NotificationCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&:hover': {
    '& .messageTime': {
      display: 'none'
    },
    '& .deleteButton': {
      opacity: '1'
    }
  },
  '& .messageTime': {
    color: theme.palette.text.secondary
  },
  '& .icon': { fontSize: '1.25rem' }
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  opacity: '0',
  position: 'absolute',
  right: 5,
  marginTop: 9,
  marginRight: '24px',
  background: 'rgba(0, 0, 0, 0.01)'
}));

const CardLeftContent = styled('div')(({ theme }) => ({
  padding: '12px 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'rgba(0, 0, 0, 0.01)',
  '& small': {
    fontWeight: '500',
    marginLeft: '16px',
    color: theme.palette.text.secondary
  }
}));

const Heading = styled('span')(({ theme }) => ({
  fontWeight: '500',
  marginLeft: '16px',
  color: theme.palette.text.secondary
}));

const NotificationBar = ({ container }) => {
  const { settings } = useSettings();
  const theme = useTheme();
  const secondary = theme.palette.text.secondary;
  const [panelOpen, setPanelOpen] = useState(false);
  const [notificationsArray, setNotificationsArray] = useState([]);  // const { deleteNotification, clearNotifications, notifications } = useNotification();

  const handleDrawerToggle = () => {
    setPanelOpen(!panelOpen);
  };

  const { palette } = useTheme();
  const textColor = palette.text.primary;

  useEffect(() => {
    const socket = io(apiConfig.publicURL);
    console.log(socket, "socket");
    socket.emit("room", 'admin-notifications');
    socket.on("notification", (data) => {
      console.log("Received notification from socket:", data);
      setNotificationsArray(prevNotifications => [...prevNotifications, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = () => {
    API.get(apiConfig.notifications)
      .then((res) => {
        console.log(res, 'res');
        setNotificationsArray(res);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
      });
  }
  console.log(notificationsArray, "notificationsArray");

  const deleteNotification = (id) => {
    API.destroy(`${apiConfig.notifications}/${id}`)
      .then((res) => {
        HELPER.toaster.success("Deleted Successfully");
        getNotification();
      })
      .catch(console.error);
  }

  const clearNotifications = () => {
    API.post(apiConfig.clearAllNotification)
      .then((res) => {
        HELPER.toaster.success("Deleted Successfully");
        getNotification();
      })
      .catch(console.error);
  }
  return (
    <Fragment>
      <IconButton onClick={handleDrawerToggle}>
        <Badge color="secondary" badgeContent={notificationsArray?.rows?.length}>
          <Icon sx={{ color: textColor }}>notifications</Icon>
        </Badge>
      </IconButton>

      <ThemeProvider theme={settings.themes[settings.activeTheme]}>
        <Drawer
          width={'100px'}
          container={container}
          variant="temporary"
          anchor={'right'}
          open={panelOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
        >
          <Box sx={{ width: sideNavWidth }}>
            <Notification>
              <Icon color="primary">notifications</Icon>
              <h5>Notifications</h5>
            </Notification>

            {notificationsArray.rows?.map((notification) => (
              <NotificationCard key={notification.id}>
                <DeleteButton
                  size="small"
                  className="deleteButton"
                  onClick={() => deleteNotification(notification.id)}
                >
                  <Icon className="icon">clear</Icon>
                </DeleteButton>
                <Link
                  to={`/${notification.path}`}
                  onClick={handleDrawerToggle}
                  style={{ textDecoration: 'none' }}
                >
                  <Card sx={{ mx: 2, mb: 3 }} elevation={3}>
                    <CardLeftContent>
                      <Box display="flex">
                        {/* <Icon className="icon" color={notification.icon.color}>
                          {notification.icon.name}
                        </Icon> */}
                        <Heading>{notification.notification_type}</Heading>
                      </Box>
                      {/* <Small className="messageTime">
                        {getTimeDifference(new Date(notification.timestamp))}{" "}
                        ago
                      </Small> */}
                    </CardLeftContent>
                    <Box sx={{ px: 2, pt: 1, pb: 2 }}>
                      <Paragraph sx={{ m: 0 }}>{notification.subject}</Paragraph>
                      <Small sx={{ color: secondary }}>{notification.content}</Small>
                    </Box>
                  </Card>
                </Link>
              </NotificationCard>
            ))}
            {!!notificationsArray?.length && (
              <Box sx={{ color: secondary }}>
                <Button onClick={clearNotifications}>Clear Notifications</Button>
              </Box>
            )}
          </Box>
        </Drawer>
      </ThemeProvider>
    </Fragment>
  );
};

export default NotificationBar;
