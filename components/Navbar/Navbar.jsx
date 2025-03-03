import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../context/userContext';
import { useDebouncedValue } from '@mantine/hooks';
import style from './Navbar.module.css';
import { FiMenu, FiSearch, FiX } from 'react-icons/fi';
import axios from 'axios';

const Navbar = () => {

  const { user, logout } = useUserContext();
  const [showNav, setShowNav] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState()
  const [debounceSearch] = useDebouncedValue(search, 500);
  useEffect(() => {
    if (debounceSearch) {
      search()
    }
    async function search() {
      setSearchResults(undefined)
      const response = await axios.get(`/api/search/${debounceSearch}`);
      if (response.data[0]) {
        setSearchResults(response.data)
      }
    }
  }, [debounceSearch]);
  const handleShowNavbar = () => {
    setShowNav(!showNav);
    setShowSearch(false)
  }
  const handleSearchbar = () => {
    setShowSearch(!showSearch);
    setShowNav(false)
  }
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <div className={style.nav}>
      <nav className={style.navbar}>
        <div className={style.menuicon} onClick={handleShowNavbar}>
          {showNav ? <FiX /> : <FiMenu />}
        </div>
        <div className={style.logo}>
          <Link href='/'
            onClick={() => setShowNav(false)}><h1>NT,HE.</h1></Link>
        </div>
        <div className={`${style.navitems} ${showNav && style.active}`}>
          <li><Link href="/posts" onClick={handleShowNavbar}>All Posts</Link></li>
          {user ? (<>
            <li><Link href='/write' onClick={handleShowNavbar}>Write</Link></li>
            <li><Link href='/user' onClick={handleShowNavbar}>{user.username}</Link></li>
            <li><a href='#' onClick={logout}>Logout</a></li>
          </>) :
            <li>
              <Link href="/login" onClick={handleShowNavbar}>Login</Link>
            </li>
          }

        </div>
        <div className={style.searchicon} onClick={handleSearchbar}>
          <span>{showSearch ? <FiX /> : <FiSearch />}</span>
        </div>
        <div className={style.cancelicon}>
          <span><FiX /></span>
        </div>
        <form className={showSearch ? style.active : ''}>
          <input type="search" className={style.searchdata} placeholder="Search" value={search}
            onChange={(e) => setSearch(e.target.value)} required />
          {searchResults ?
            <div className={style.searchresults}>
              <ul>
                {searchResults?.map((r, i) => {
                  const result = r.username ? <Link href={`/user/${r._id}`}
                    onClick={() => {
                      setSearch('');
                      setShowSearch(false);
                      setSearchResults(undefined)
                    }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: '1rem'
                    }} >
                      <img src={r.profilePic ? r.profilePic : '/blank-pfp.png'} style={{
                        width: '5rem',
                        height: '5rem',
                        borderRadius: '50%'
                      }} alt="" />

                      <h4 classname={style.username}>
                        <Link href={`/user/${r._id}`}>{r.username}</Link>
                      </h4>
                    </div></Link> :
                    <Link href={`/posts/${r._id}`}
                      onClick={() => {
                        setSearch('')
                        setShowSearch(false);
                        setSearchResults(undefined)
                      }}>
                      {r.title}
                    </Link>
                  return <li key={i}>{result}</li>
                })}
              </ul>
            </div>
            : <></>}

        </form>
      </nav>
    </div>
  )
}

export default Navbar