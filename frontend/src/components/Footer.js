import React from 'react';

const currentYear = new Date().getFullYear();

const Footer = React.memo(() => {
  return (
    <footer className="footer">
      <p className="footer__copyright">
        &copy; {currentYear === 2020 ? '2020' : `2020 - ${currentYear}`} Mesto Russia
      </p>
    </footer>
  );
});

export default Footer;
