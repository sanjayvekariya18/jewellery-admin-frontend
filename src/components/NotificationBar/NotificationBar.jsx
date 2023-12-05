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
import useSettings from '../../hooks/useSettings';
import { sideNavWidth, topBarHeight } from '../../utils/constant';
import { getTimeDifference } from '../../utils/utils.js';
import { themeShadows } from '../MatxTheme/themeColors';
import { Paragraph, Small } from '../Typography';
import io from 'socket.io-client';
import { API, HELPER } from '../../services/index.js';
import apiConfig from '../../config/apiConfig.js';
import { isEmpty } from '../../services/helper.js';
import InfiniteScroll from "react-infinite-scroll-component";
import { BottomScrollListener } from 'react-bottom-scroll-listener';

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
  const [notificationsArray, setNotificationsArray] = useState([]);
  const [unReads, setUnRead] = useState({});
  const [isNextListEmpty, setIsNextListEmpty] = useState(false);
  const [page, setPage] = useState(1);
  const [totalNotification, setTotalNotification] = useState(0);

  let prevPage = 0;
  const [formState, setFormState] = useState({
    limit: 2,
  });
  // const { deleteNotification, clearNotifications, notifications } = useNotification();

  const handleDrawerToggle = () => {
    setPanelOpen(!panelOpen);
  };

  const { palette } = useTheme();
  const textColor = palette.text.primary;

  useEffect(() => {
    getNotification(page);

  }, [page]);

  const getNotification = (prevPageNo = prevPage, is_next_list_empty = isNextListEmpty) => {
    console.log('getNotification', prevPageNo != page , false == is_next_list_empty, prevPageNo, is_next_list_empty);
    if (prevPageNo != page && false == is_next_list_empty) {
      prevPage = page;
      API.get(`${apiConfig.notifications}?page=${page}&rowsPerPage=${formState.limit}`)
        .then((res) => {
          console.log("res");
          let nextListEmpty = (isEmpty(res.rows) || formState.limit > res.rows.length) ? true : false;
          console.log('called', nextListEmpty);
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
  console.log(page, "page");

  const deleteNotification = (id) => {
    API.destroy(`${apiConfig.notifications}/${id}`)
      .then((res) => {
        HELPER.toaster.success("Deleted Successfully");
        getNotification();
      })
      .catch(console.error);
  }

  useEffect(() => {
    const socket = io(apiConfig.publicURL);
    socket.emit("room", 'admin-notifications');
    socket.on("notification", (data) => {
      console.log("Received notification from socket:", data);
      setNotificationsArray(prevNotifications => {
        if (!Array.isArray(prevNotifications)) {
          return [data];
        } else {
          return [...prevNotifications, data];
        }
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array to run the effect only once


  const clearNotifications = () => {
    API.post(apiConfig.clearAllNotification)
      .then((res) => {
        HELPER.toaster.success("Deleted Successfully");
        getNotification();
      })
      .catch(console.error);
  }
  const readNotification = () => {
    API.post(apiConfig.readNotification)
      .then((res) => {
        HELPER.toaster.success("Notification Read Successfully");
        getNotification();
      })
      .catch(console.error);
  }
  useEffect(() => {
    API.get(apiConfig.unRead)
      .then((res) => {
        console.log("res", res);
        setUnRead(res)
      })
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
    console.log("hello");
    getNotification();
  }, [page, isNextListEmpty]);
  console.log(notificationsArray.length, "notificationsArray.length");
  return (
    <Fragment>

      <IconButton onClick={handleDrawerToggle}>
        <Badge color="secondary" badgeContent={unReads?.totalUnreadNoty === 0 ? "0" : unReads?.totalUnreadNoty} onClick={readNotification}>
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
              <div style={{ borderRadius: "2px ", background: "#F75D59", color: "white", marginRight: "23px", padding: "0px 8px" }}>
                {notificationsArray.count}
              </div>
            </Notification>
            {!!notificationsArray.rows?.length && (

              <div variant='contained' style={{ margin: "0px 10px 20px 165px", color: "#1976d2" }} onClick={clearNotifications}>Clear All Notifications</div>
            )}
            {/* </div> */}
            <BottomScrollListener onBottom={() => console.log("Reached the bottom")}>
              {(scrollRef) => (
                <div ref={scrollRef}>
                  <InfiniteScroll
                    dataLength={totalNotification}
                    next={lazyLoadedMajorAuditList}
                    hasMore={!isNextListEmpty}
                    loader={<h4 className="loading-title">{loaderValidator()}</h4>}
                  >
                    {notificationsArray.map((notification, i) => (
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
                              {/* <Heading>{notification.notification_type}</Heading> */}
                            </Box>
                            <Small className="messageTime" style={{ color: "#65a765" }}>
                              {getTimeDifference(new Date(notification.createdAt))}{" "}
                              ago
                            </Small>
                          </CardLeftContent>
                          <Box sx={{ px: 2, pt: 1, pb: 2 }}>
                            <Paragraph sx={{ m: 0 }}>{notification.subject}</Paragraph>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <Small sx={{ color: secondary }}>{notification.content}</Small>
                            </div>
                          </Box>
                        </Card>
                      </NotificationCard>
                    ))}
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
