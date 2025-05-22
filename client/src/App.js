import React from 'react';
import io from 'socket.io-client';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';


const socket = io('http://localhost:3000');


function App() {
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    if(Notification.permission !== 'default' || Notification.permission === 'denied') {
      Notification.requestPermission().then((permission) => {
        if(permission === 'granted') {
          new Notification('Notification permission granted');
        }
        else {
          console.log('Notification permission denied');
        }
      }
      );
    }
    
    socket.on('pushnotification', (data) => {
      console.log('Notification received:', data);
      if(Notification.permission === 'granted') {
        new Notification('New Notification', {
          body: data.message,
          icon: 'https://via.placeholder.com/150'
        });
      }
      else if(Notification.permission === 'default') {
        console.log('Notification permission not granted');
      }
      else {
        console.log('Notification permission denied');
      }

      setNotification((prev) => [...prev, data]);
    });

    return () => {
      socket.off('pushnotification');
    };
  }, []);
//returning message notification for every index
  return (
    <div className="App">
      <h1>Push Notifications</h1>
      <ul>
        {notification.map((note, idx) => (
          <li key={idx}>{note.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
