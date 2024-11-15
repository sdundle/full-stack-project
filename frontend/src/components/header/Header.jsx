import { Form, NavLink, Outlet, useNavigate, useRouteLoaderData } from 'react-router-dom';
import './Header.css';
import { useEffect, useRef, useState } from 'react';

export default function Header() {

    const [responsive, setResponsive] = useState('');
    const menuRef = useRef();
    const navigate = useNavigate();

    const token = useRouteLoaderData('root');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }else{
            navigate('/home');
        }
    }, [token, navigate]);

    function handleMenuClick(e) {
        e.preventDefault();
        const checkClasses = menuRef.current.className;
        if (checkClasses.includes("responsive")) {
            setResponsive('');
        } else {
            setResponsive('responsive');
        }
    }

    return (
        <>
            <div className={`topnav ${responsive}`} id="myTopnav" ref={menuRef}>
                {!token && <><NavLink to="/login" className={({ isActive }) => isActive ? 'active' : null}>Login</NavLink>
                    <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : null}>Registration</NavLink></>}

                {token && <>
                    <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : null}>Home</NavLink>
                    <NavLink to="/user/profile" className={({ isActive }) => isActive ? 'active' : null}>Profile</NavLink>
                    <a className="logout-link"><Form method="POST" action="/logout"><button>Logout</button></Form></a>
                </>}
                <NavLink className="icon" onClick={handleMenuClick}>&#9776;</NavLink>
            </div>

            <Outlet />
        </>
    );
}