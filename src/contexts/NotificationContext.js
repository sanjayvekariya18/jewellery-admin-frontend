import { createContext, useEffect, useReducer } from 'react';
import shortId from 'shortid';

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_NOTIFICATIONS': {
      return { ...state, notifications: action.payload };
    }

    case 'DELETE_NOTIFICATION': {
      return { ...state, notifications: action.payload };
    }

    case 'CLEAR_NOTIFICATIONS': {
      return { ...state, notifications: action.payload };
    }

    default:
      return state;
  }
};

const NotificationContext = createContext({
  notifications: [],
  deleteNotification: () => {},
  clearNotifications: () => {},
  getNotifications: () => {},
  createNotification: () => {}
});

const dummyNotifications = [
    {
      id: shortId.generate(),
      heading: 'Message',
      icon: { name: 'chat', color: 'primary' },
      timestamp: new Date().getTime() - 864000,
      title: 'New message from Devid',
      subtitle: 'Hello, Any progress...',
      path: 'chat'
    },
    {
      id: shortId.generate(),
      heading: 'Alert',
      icon: { name: 'notifications', color: 'error' },
      timestamp: new Date().getTime() - 1864000,
      title: 'Server overloaded',
      subtitle: 'Traffice reached 2M',
      path: 'page-layouts/user-profile'
    },
    {
      id: shortId.generate(),
      heading: 'Message',
      icon: { name: 'chat', color: 'primary' },
      timestamp: new Date().getTime() - 5864000,
      title: 'New message from Goustove',
      subtitle: 'Hello, send me details',
      path: 'chat'
    }
  ]

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);

  const deleteNotification = async (notificationID) => {
    try {
    //   const res = await axios.post('/api/notification/delete', { id: notificationID });
    //   dispatch({ type: 'DELETE_NOTIFICATION', payload: res.data });
      dispatch({ type: 'DELETE_NOTIFICATION', payload: dummyNotifications });
    } catch (e) {
      console.error(e);
    }
  };

  const clearNotifications = async () => {
    try {
    //   const res = await axios.post('/api/notification/delete-all');
    //   dispatch({ type: 'CLEAR_NOTIFICATIONS', payload: res.data });
      dispatch({ type: 'CLEAR_NOTIFICATIONS', payload: dummyNotifications });
    } catch (e) {
      console.error(e);
    }
  };

  const getNotifications = async () => {
    try {
    //   const res = await axios.get('/api/notification');
    //   dispatch({ type: 'LOAD_NOTIFICATIONS', payload: res.data });
      dispatch({ type: 'LOAD_NOTIFICATIONS', payload: dummyNotifications });
    } catch (e) {
      console.error(e);
    }
  };

  const createNotification = async (notification) => {
    try {
    //   const res = await axios.post('/api/notification/add', { notification });
    //   dispatch({ type: 'CREATE_NOTIFICATION', payload: res.data });
      dispatch({ type: 'CREATE_NOTIFICATION', payload: dummyNotifications });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        getNotifications,
        deleteNotification,
        clearNotifications,
        createNotification,
        notifications: state.notifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
