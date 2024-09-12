// Settings.js
import React from 'react';
import { IoPersonOutline } from "react-icons/io5";
import { GrShieldSecurity } from "react-icons/gr";
import { TiDeviceLaptop } from "react-icons/ti";
import SettingItem from './SettingItem';
import { settingsLinks } from './settingsLinks';

function Settings() {
    return (
        <div className="flex">
            {/* Sidebar with scrolling */}
            <div className="w-[400px] p-4 bg-black h-screen overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 ml-2 text-white">Settings</h2>
                <div className="space-y-4">
                    {/* Accounts Centre Section */}
                    <div className="p-5 rounded-md bg-zinc-900 hover:bg-zinc-800 shadow-custom">
                        <h3 className="text-md font-medium mb-2 mx-1 text-white">Accounts Centre</h3>
                        <p className="text-zinc-400 text-xs  mx-1">
                            Manage your connected experiences and account settings across Meta technologies.
                        </p>
                        <ul className="mt-3 space-y-1">
                            <li>
                                <a href="#" className="flex items-center text-zinc-400 text-xs  hover:text-white">
                                    <IoPersonOutline className='mx-1' size={14} />
                                    Personal details
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center text-zinc-400 text-xs  hover:text-white">
                                    <GrShieldSecurity className='mx-1' size={14} />
                                    Password and security
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center text-zinc-400 text-xs  hover:text-white">
                                    <TiDeviceLaptop className='mx-1' size={14} />
                                    Ad preferences
                                </a>
                            </li>
                        </ul>
                        <div className="text-sm mt-3 text-blue-500 mx-1 hover:text-blue-400">
                            See more in Accounts Centre
                        </div>
                    </div>

                    {/* Settings List */}
                    <div className="p-3 rounded-md bg-black shadow-custom">
                        <ul className="space-y-1">
                            {settingsLinks.map(link => (
                                <SettingItem
                                    key={link.id}
                                    icon={link.icon}
                                    label={link.label}
                                    link={link.link}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
