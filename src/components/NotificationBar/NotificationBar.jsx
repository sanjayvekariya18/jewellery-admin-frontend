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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Fragment, useEffect, useState } from 'react';
import useSettings from '../../hooks/useSettings';
import { sideNavWidth, topBarHeight } from '../../utils/constant';
import { themeShadows } from '../MatxTheme/themeColors';
import { Paragraph, Small } from '../Typography';
import io from 'socket.io-client';
import { API, HELPER } from '../../services/index.js';
import apiConfig from '../../config/apiConfig.js';
import { isEmpty } from '../../services/helper.js';
import InfiniteScroll from "react-infinite-scroll-component";
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import moment from 'moment';
import AuthStorage from '../../utils/authStorage.js';

const Notification = styled('div')(() => ({
  padding: '16px',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  marginRight: "0 !important",
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
  const [notificationsArray, setNotificationsArray] = useState([]);
  const [unReads, setUnRead] = useState({});
  const [isNextListEmpty, setIsNextListEmpty] = useState(false);
  const [page, setPage] = useState(0);
  const [totalNotification, setTotalNotification] = useState(0);
  const userData = AuthStorage.getStorageJsonData(AuthStorage.STORAGEKEY.userData)

  let prevPage = 0;
  const [formState, setFormState] = useState({
    limit: 10,
  });
  // const { deleteNotification, clearNotifications, notifications } = useNotification();

  const handleDrawerToggle = () => {
    setPanelOpen(!panelOpen);
  };

  const { palette } = useTheme();
  const textColor = palette.text.primary;

  const getNotification = (prevPageNo = prevPage, is_next_list_empty = isNextListEmpty) => {
    if (prevPageNo != page && false == is_next_list_empty) {
      prevPage = page;
      API.get(`${apiConfig.notifications}?page=${page}&rowsPerPage=${formState.limit}`)
        .then((res) => {
          let nextListEmpty = (isEmpty(res.rows) || formState.limit > res.rows.length) ? true : false;
          setIsNextListEmpty(nextListEmpty);
          setTotalNotification(res.count);
          if (page == 0) {
            setNotificationsArray(res.rows);
          } else {
            setNotificationsArray(prev => ([...prev, ...res.rows]))
          }
        })
    };

  }
  const deleteNotification = (id) => {
    API.destroy(`${apiConfig.notifications}/${id}`)
      .then((res) => {
        HELPER.toaster.success("Deleted Successfully");
        getNotification(-1, false);
      })
      .catch((e) => HELPER.toaster.error(e.errors.message))
  }

  useEffect(() => {
    if (userData?.id) {
      const socket = io(apiConfig.publicURL);
      socket.emit("room", `admin-notifications-${userData?.id}`);
      socket.on("notification", (data) => {
        setNotificationsArray(prevNotifications => {
          return [data.data, ...prevNotifications];
        });

        setUnRead(prev => ({
          ...prev,
          totalUnreadNoty: data.totalUnreadNoty
        }))
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [userData?.id]); // Empty dependency array to run the effect only once


  const clearNotifications = () => {
    API.post(apiConfig.clearAllNotification)
      .then((res) => {
        // HELPER.toaster.success("Deleted Successfully");
        getNotification(-1, false);
      })
      .catch((e) => HELPER.toaster.error(e.errors.message))
  }

  const unRead = () => {
    API.get(apiConfig.unRead)
      .then((res) => {
        setUnRead(res)
      })
  }

  const readNotification = () => {
    API.post(apiConfig.readNotification)
      .then((res) => {
        getNotification();
        unRead();
      })
      .catch((e) => HELPER.toaster.error(e.errors.message))
  }

  useEffect(() => {
    unRead();
  }, [])


  const lazyLoadedMajorAuditList = () => {
    if (false === isNextListEmpty) {
      setPage(page + 1);
    }
  };

  function loaderValidator() {
    if (false === isNextListEmpty) {
      return (<img src='../../../../assets/loading.gif' className='mx-auto' height={30} width={30} />)
    } else if (notificationsArray == "") {
      return ('No Data Found')
    }
    else {
      return ('All Data have been Fetched')
    }
  }

  useEffect(() => {
    getNotification(-1);
  }, [page]);

  return (
    <Fragment>

      <IconButton onClick={() => { handleDrawerToggle(); readNotification(); }} style={{ marginRight: "20px" }}>
        <Badge color="secondary" badgeContent={unReads?.totalUnreadNoty === 0 ? "0" : unReads?.totalUnreadNoty}>
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
            {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}> */}
            <Notification style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon color="primary">notifications</Icon>
                <h5>Notifications</h5>
              </div>
              <IconButton onClick={handleDrawerToggle}>
                <HighlightOffIcon color="primary" />
              </IconButton>
              {/* <div style={{ borderRadius: "2px", background: "#F75D59", color: "white", marginRight: "23px", padding: "0px 8px" }}>
                {notificationsArray.count}
              </div> */}
            </Notification>
            {!!notificationsArray.length && (

              <div variant='contained' style={{ margin: "0px 10px 20px 147px", color: "#1976d2", cursor: "pointer" }} onClick={clearNotifications}>Clear All Notifications</div>
            )}
            {/* </div> */}
            <BottomScrollListener onBottom={() => lazyLoadedMajorAuditList()}>
              {(scrollRef) => (
                <div ref={scrollRef} style={{ height: 1000, overflow: "auto" }}>
                  <InfiniteScroll
                    dataLength={totalNotification}
                    next={lazyLoadedMajorAuditList}
                    hasMore={!isNextListEmpty}
                    loader={<h4 className="loading-title">{loaderValidator()}</h4>}
                  >
                    {notificationsArray.map((notification, i) => {
                      const timeAgo = moment(notification.createdAt).fromNow();
                      return (
                        <NotificationCard key={i}>
                          <DeleteButton
                            size="small"
                            className="deleteButton"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Icon className="icon">clear</Icon>
                          </DeleteButton>

                          <Card sx={{ mx: 2, mb: 3 }} elevation={3}>
                            <CardLeftContent>
                              <Box display="flex">
                                <Icon className="icon" style={{ color: "#1976d2" }}>
                                  chat
                                </Icon>
                                <span style={{ marginLeft: "20px" }}>Message</span>
                                {/* <Heading>{notification.notification_type}</Heading> */}
                              </Box>
                              <Small className="messageTime" style={{ color: "#65a765" }}>
                                {timeAgo}                                </Small>
                            </CardLeftContent>
                            <Box sx={{ px: 2, pt: 1, pb: 2 }}>
                              <Paragraph sx={{ m: 0 }}>{notification.subject}</Paragraph>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <Small sx={{ color: secondary }}>{notification.content}</Small>
                              </div>
                            </Box>
                          </Card>
                        </NotificationCard>
                      );
                    })}
                  </InfiniteScroll>
                </div>
              )}
            </BottomScrollListener>

          </Box>
        </Drawer>
      </ThemeProvider>
    </Fragment >
  );

};

export default NotificationBar;
