// src/components/common/Header.js

import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/Header.css';

function Header(){
    const toggleMenubar = () => {
        // setShowMenubar(!showMenubar);
    };

    return (
        <header className='header'>
            <div className='leftWrapper'>
                <button type="button" onClick={toggleMenubar} className='menuButton'>☰</button>
                <Link to="/" className='logoLink'>
                KURUNG
                </Link>
            </div>
            <div>
                <nav>
                    <ul className='navList'>
                        <li>
                            <Link to="/" className='navItem'>
                            비니
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className='navItem'>
                            식단
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className='navItem'>
                            운동
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className='navItem'>
                            라이프로그
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className='navItem'>
                            마이페이지
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className='navItem'>
                            프로필
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;