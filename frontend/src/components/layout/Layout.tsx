"use client";
import React, { Fragment } from "react";
// Head removed

import Header from "./header/Header";
import HeaderTwo from "./header/HeaderTwo";
import HeaderThree from "./header/HeaderThree";
import HeaderFour from "./header/HeaderFour";
import Footer from "./footer/Footer";
import FooterTwo from "./footer/FooterTwo";
import FooterThree from "./footer/FooterThree";
import FooterFour from "./footer/FooterFour";
import ScrollProgress from "./ScrollProgress";
import HeaderFive from "./header/HeaderFive";
import FooterFive from "./footer/FooterFive";

type layoutProps = {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
};

const Layout = ({ children, header, footer }: layoutProps) => {
  return (
    <Fragment>
      <div className={header === 4 ? " fourth-page" : " my-app"}>
        {header === 1 && <Header />}
        {header === 2 && <HeaderTwo />}
        {header === 3 && <HeaderThree />}
        {header === 4 && <HeaderFour />}
        {header === 5 && <HeaderFive />}
        <main>{children}</main>
        {footer === 1 && <Footer />}
        {footer === 2 && <FooterTwo />}
        {footer === 3 && <FooterThree />}
        {footer === 4 && <FooterFour />}
        {footer === 5 && <FooterFive />}
        <ScrollProgress />
      </div>
    </Fragment>
  );
};

export default Layout;
