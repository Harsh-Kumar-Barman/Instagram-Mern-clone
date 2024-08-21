// import React from 'react'
// import InstaLogo from '../assets/InstaLogo.png'
// import { GoHomeFill } from "react-icons/go";
// import { IoSearchOutline } from "react-icons/io5";
// import { MdOutlineExplore } from "react-icons/md";
// import { BiSolidMoviePlay } from "react-icons/bi";
// import { FiSend } from "react-icons/fi";
// import { FaRegHeart } from "react-icons/fa";
// import { CiSquarePlus } from "react-icons/ci";
// import { RxHamburgerMenu } from "react-icons/rx";
// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';



// function Sidebar() {
//     const userDetails=useSelector((state)=>state.counter.userDetails)
//     // console.log(userDetails)
//     const linksLogo = [
//         {
//             id: 1,
//             logo: <GoHomeFill color="white" size={28} />,
//             abtLogo: "Home",
//             link:'/'
//         }, {
//             id: 2,
//             logo: <IoSearchOutline color="white" size={28} />,
//             abtLogo: "Search",
//             link:'/'
//         }, {
//             id: 3,
//             logo: <MdOutlineExplore color="white" size={28} />,
//             abtLogo: "Explore",
//             link:'/'
//         }, {
//             id: 4,
//             logo: <BiSolidMoviePlay color="white" size={28} />,
//             abtLogo: "Reels",
//             link:'/'
//         }, {
//             id: 5,
//             logo: <FiSend color="white" size={28} />,
//             abtLogo: "Messages",
//             link:'/'
//         }, {
//             id: 6,
//             logo: <FaRegHeart color="white" size={28} />,
//             abtLogo: "Notification",
//             link:'/'
//         }, {
//             id: 7,
//             logo: <CiSquarePlus color="white" size={28} />,
//             abtLogo: "Create",
//             link:'/'
//         }, {
//             id: 8,
//             logo: <RxHamburgerMenu color="white" size={28} />,
//             abtLogo: "Profile",
//             link:`/profile/${userDetails.username}`
//         }, {
//             id: 9,
//             logo: <RxHamburgerMenu color="white" size={28} />,
//             abtLogo: "More",
//             link:'/'
//         }
//     ]
//     return (
//         <>
//             <div className="w-[18.2%] h-screen fixed top-0 bg-black p-2 border-zinc-800 border-r-[.1px]">
//                 <div className="content">
//                     <div className="logo w-44 ml-5 mb-5 mt-8">
//                         <img className='w-28' src={InstaLogo} alt="aaaa" />
//                     </div>
//                     <div className="links">
//                         <div className="flex flex-col gap-1">

//                             {linksLogo.map((logoItem) => (
//                                 <Link key={logoItem.id} to={logoItem.link}>
                                    
//                                 <div  className="link flex items-center cursor-pointer duration-150 rounded-md hover:bg-[#272727] gap-4 justify-start w-56 p-3">
//                                     <span className=' inline-block'>{logoItem.id==8? <img className='w-6 h-6 rounded-full' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEXk5ueutLepsLPo6uursbXJzc/p6+zj5ea2u76orrKvtbi0ubzZ3N3O0dPAxcfg4uPMz9HU19i8wcPDx8qKXtGiAAAFTElEQVR4nO2d3XqzIAyAhUD916L3f6+f1m7tVvtNINFg8x5tZ32fQAIoMcsEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQTghAJD1jWtnXJPP/54IgNzZQulSmxvTH6oYXX4WS+ivhTbqBa1r26cvCdCu6i0YXbdZ0o4A1rzV+5IcE3YE+z58T45lqo7g1Aa/JY5tgoqQF3qb382x7lNzBLcxft+O17QUYfQI4IIeklKsPSN4i6LKj/7Zm8n99RbHJpEw9gEBXNBpKIYLJqKYRwjOikf//r+J8ZsVuacbqCMNleI9TqGLGqMzhnVdBOdd6F/RlrFijiCoVMk320CBIahUxTWI0KKEcJqKbMdpdJb5QvdHq6wCI5qhKlgGMS/RBHkubWDAE+QZxB4xhCyDiDkLZxgGEVdQldzSKbTIhmZkFkSEPcVvmBn2SMuZB9od7fQDsMiDdKJjFUSCQarM5WirZ3C2TT/htYnyPcPfgrFHWz0BI74gr6J/IZiGUxAZGQLqmvQLTrtE/Go4YxhVRIpEw+sww1IIcqr5NKmUUzLF3d4/qPkYIp2T/obPuemlojFUR4t9Q2Vojhb7BmgElWHzLPH8hucfpefPNFTVgs9h1AdU/Pin96vwWbWdf+X9Absn3OdO34aMdsDnP8WgKYisTqI6CkNGqZQo1XA6Ef6AU32SJzOcBukHPF07/xNSgmHKa5BOhtezv6mA/rYJpwXNAnbRZ1XuF3BzDcO3vpA3+ny2909gbqE4hhD3LIPhLLyBNhPZvbZ3B+3tPYa18A7auSlXQayKwTPNLKDcuOB0xPYKDPFTkWsevQPRZ1J8Hji9I1KQ34r7hZhrwNwOZ97QxNx0drwn4QI0wQk1DcEsfKCWKdxVvxPSNUIp/knmAXT+nT+Ko3+0H96rcNb3m1fx7MBTJdeBJ7uFcWsc0wvgAsC4pROW0l2inbAmIBv/7GZmuhQH6API2rr8T0e6yuZJ+80A9LZeG62T3tik31XwxtwZcizKuTHkMjB1WdZde4Kmic/A5ZI3rr1ae21d08PlVHYfAaxw9G9CYRbJ+8ZdbTcMRV1XM3VdF0M32vtoTdZ0+u29s0OttJ5bz64UwinjaFMVY9vkqc3KKSxN21Xl+0L4Q3Vuv1tYl0pqnX6ms4XetFz7gdZVAgUEoJntfOUe4ZwsHd9FzqQ3Vv6xe41l0XJcqcKl6TZvlv7ClAW3BsqQW4X7ypApB8dmTgK4IX5wvqIVj33HtD2qSG4BqznxdIefL27Y4sahi0MdIdvUsDva8agGGbCtITmCY31MHD2O0uIdh/0rJDQ1VX5Zdxz3rR2QDbv6qXl9vudzqQtGm1Jv9LDXOsfvvB7VcZ8PDKD0mQ1VHPYQ9O+Yj4hR1IUD8rBnn3ho2m8oQMxbCFiKlL2ioSW5heeJqegED52CzxCtcGD3Kv8Wms9EYLyUhwaFIhSMBClevWEmiK/Iaogu4H7sg6ppQhQG8RUqivuTGOAJOg6FfgW0q0M0PQMRMEgXaeNf3SYDZ8PIMI0+wHgr/MgN7wYwpiLjCCqM6ydUDZLQiB6nDdNC8SDyig3jPPpFXGcC9O8BUBDVmgBY59E7Md/35Loe/UVEECEJwYggJjELZ4J71SaQSBeC02n4Da29CayJNA28SAhd2CQyC1Xw6pSmGSINQVuMhAZp4DClan9MgmkDDNmezqwS8sgtlXK/EPBhoaSmYVC/F7IO1jQEdHOlabpKh3+jzLQSTUiq4X2I+Ip/zU8rlaqAvkS21ElR+gqu3zbjjL+hIAiCIAiCIAiCIAiCsCf/AKrfVhSbvA+DAAAAAElFTkSuQmCC" alt="" /> : logoItem.logo }</span>
//                                     <span className='text-white'>{logoItem.abtLogo}</span>
//                                 </div>
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Sidebar


import React from 'react';
import InstaLogo from '../assets/InstaLogo.png';
import { GoHomeFill } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { BiSolidMoviePlay } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import myPic from '../assets/myPic.jpeg'


function Sidebar() {
    const userDetails = useSelector((state) => state.counter.userDetails);

    const links = [
        { id: 1, icon: <GoHomeFill size={28} />, label: "Home", link: '/' },
        { id: 2, icon: <IoSearchOutline size={28} />, label: "Search", link: '/' },
        { id: 3, icon: <MdOutlineExplore size={28} />, label: "Explore", link: '/' },
        { id: 4, icon: <BiSolidMoviePlay size={28} />, label: "Reels", link: '/' },
        { id: 5, icon: <FiSend size={28} />, label: "Messages", link: '/' },
        { id: 6, icon: <FaRegHeart size={28} />, label: "Notification", link: '/' },
        { id: 7, icon: <CiSquarePlus size={28} />, label: "Create", link: '/' },
        {
            id: 8,
            icon: (
                <img
                    className="w-6 h-6 rounded-full object-cover"
                    src={ myPic }
                    alt={userDetails.username}
                />
            ),
            label: "Profile",
            link: `/profile/${userDetails.username}`,
        },
        { id: 9, icon: <RxHamburgerMenu size={28} />, label: "More", link: '/' },
    ];

    return (
        <aside className="fixed hidden sm:block top-0 w-[18.2%] h-screen p-2 bg-black border-r border-zinc-800">
            <div className="flex w-full flex-col items-start">
                <div className="w-44 ml-5 mb-5 mt-8">
                    <img className="w-28" src={InstaLogo} alt="Instagram Logo" />
                </div>

                <nav className="flex flex-col gap-1 w-full">
                    {links.map((link) => (
                        <Link key={link.id} to={link.link} className="w-[90%] ">
                            <div className="flex items-center gap-4 p-3 rounded-md cursor-pointer hover:scale-105 duration-150 hover:bg-[#272727]">
                                <span className="text-white">{link.icon}</span>
                                <span className="text-white">{link.label}</span>
                            </div>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;
