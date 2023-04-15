import React, { Component } from 'react';
import AppHeader from './AppHeader';

export default function AppLayout({children}) {
  return (
    <div className='layout'>
      <AppHeader />
      {children}
    </div>
  );
}