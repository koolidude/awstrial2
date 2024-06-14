// src/components/NavigationTabs.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavigationTabs = ({ genres }) => {
  return (
    <nav className="navigation-tabs">
      <NavLink to="/" exact="true" className={({ isActive }) => (isActive ? 'active' : '')}>
        Home
      </NavLink>
      <NavLink to="/top-rated" className={({ isActive }) => (isActive ? 'active' : '')}>
        Top Rated
      </NavLink>
      <NavLink to="/upcoming" className={({ isActive }) => (isActive ? 'active' : '')}>
        Upcoming
      </NavLink>
      {genres.map((genre) => (
        <NavLink
          key={genre.id}
          to={`/genre/${genre.id}`}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          {genre.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default NavigationTabs;
