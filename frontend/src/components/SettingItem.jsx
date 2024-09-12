// SettingItem.js
import React from 'react';

function SettingItem({ icon, label, link }) {
  return (
    <li className="pr-32 pl-4 py-2 rounded-md hover:bg-zinc-800 hover:text-white cursor-pointer">
      <a href={link} className="flex items-center text-white hover:text-white text-sm mx-2">
        <span className="mr-2 text-white">{icon}</span>
        {label}
      </a>
    </li>
  );
}

export default SettingItem;
