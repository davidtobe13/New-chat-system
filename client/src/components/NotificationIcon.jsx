// import React from 'react';

function NotificationIcon({ unreadCount, onOpen }) {
  return (
    <div onClick={onOpen} className="cursor-pointer">
      🔔 {unreadCount > 0 && <span className="bg-red-500 text-white rounded-full px-2">{unreadCount}</span>}
    </div>
  );
}

export default NotificationIcon;