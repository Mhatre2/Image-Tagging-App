import React from 'react';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
import { MdOutlineImageSearch } from 'react-icons/md';

const Navbar = () => (
  <BootstrapNavbar bg="dark" variant="dark">
    <BootstrapNavbar.Brand className="flex items-center">
      <MdOutlineImageSearch className="ml-3 mr-2 text-black"  />
      Image Tagging App
    </BootstrapNavbar.Brand>
  </BootstrapNavbar>
);

export default Navbar;
