import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Apps from './Apps/Apps';
import Photography from './Photography/Photography';
import MyProfile from './Profile/MyProfile';

const AppRoutes = () => {
    return (
        <Routes>
            <Route index path='/' element={<MyProfile />} />
            <Route path='/photography' element={<Photography />} />
            <Route path='/apps' element={<Apps />} />             
        </Routes>
    );
}
export default AppRoutes;