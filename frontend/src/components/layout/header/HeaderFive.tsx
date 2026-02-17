"use client";
import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";

import Logo from "public/img/logo/logo.png";

const HeaderFive = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const handleSubmenu = (submenu: string) => {
    if (submenu === openSubMenu) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu(submenu);
    }
  };

  const isSubMenuOpen = (submenu: string) => {
    return submenu === openSubMenu ? "sub-menu-open" : "";
  };

  const isSubMenuButton = (submenu: string) => {
    return submenu === openSubMenu ? " sm-btn-active" : " ";
  };

  useEffect(() => {
    const handleResizeHeader = (): void => {
      setToggleMenu(false);
      setOpenSubMenu(null);
    };

    window.addEventListener("resize", handleResizeHeader);

    return () => {
      window.removeEventListener("resize", handleResizeHeader);
    };
  }, []);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Fragment>
      <div className="fix">
        <div className={(toggleMenu ? " info-open" : " ") + " offcanvas__info"}>
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-40 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link href="/">
                    <Image src={Logo} alt="logo not found" priority />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button
                    aria-label="Close"
                    onClick={() => setToggleMenu(false)}
                  >
                    <i className="fal fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="offcanvas__search mb-25">
                <form action="/">
                  <input
                    type="text"
                    placeholder="What are you searching for?"
                    required
                  />
                  <button type="submit">
                    <i className="far fa-search"></i>
                  </button>
                </form>
              </div>
              <div className="mobile-menu fix mb-40 mean-container">
                <div className="mean-bar d-block d-lg-none">
                  <nav className="mean-nav">
                    <ul>
                      <li className="has-dropdown">
                        <button
                          aria-label="Select Dropdown"
                          className={`nul ${isSubMenuButton("home")}`}
                          onClick={() => handleSubmenu("home")}
                        >
                          Home
                          <span className="mean-expand">
                            <i className="fal fa-plus"></i>
                          </span>
                        </button>
                        <ul className={`sub-menu ${isSubMenuOpen("home")}`}>
                          <li>
                            <Link href="/">SEO Agency 01</Link>
                          </li>
                          <li>
                            <Link href="/index-2">Digital Agency</Link>
                          </li>
                          <li>
                            <Link href="/index-3">SEO Agency 02</Link>
                          </li>
                          <li>
                            <Link href="/index-4">Creative Agency</Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link href="/about">About</Link>
                      </li>
                      <li>
                        <Link href="/service">Services</Link>
                      </li>
                      <li>
                        <Link href="/project">Portfolio</Link>
                      </li>
                      <li className="has-dropdown">
                        <button
                          className={`${isSubMenuButton("pages")}`}
                          onClick={() => handleSubmenu("pages")}
                        >
                          Pages
                          <span className="mean-expand">
                            <i className="fal fa-plus"></i>
                          </span>
                        </button>
                        <ul className={`sub-menu ${isSubMenuOpen("pages")}`}>
                          <li className="has-dropdown">
                            <Link href="/about">about us</Link>
                          </li>
                          <li>
                            <Link href="/service">service</Link>
                          </li>
                          <li>
                            <Link href="/technical">Technical</Link>
                          </li>
                          <li>
                            <Link href="/project">Portfolio</Link>
                          </li>
                          <li>
                            <Link href="/analys">Analys</Link>
                          </li>
                          <li>
                            <Link href="/team">team</Link>
                          </li>
                        </ul>
                      </li>
                      <li className="has-dropdown">
                        <button
                          aria-label="select dropdown"
                          className={`${isSubMenuButton("blog")}`}
                          onClick={() => handleSubmenu("blog")}
                        >
                          Blog
                          <span className="mean-expand">
                            <i className="fal fa-plus"></i>
                          </span>
                        </button>
                        <ul className={`sub-menu ${isSubMenuOpen("blog")}`}>
                          <li>
                            <Link href="/blog">blog</Link>
                          </li>
                          <li>
                            <Link href="/blog-details">blog Details</Link>
                          </li>
                        </ul>
                      </li>
                      <li className="mean-last">
                        <Link href="/contact">Contact</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="offcanvas__contact mt-30 mb-20">
                <h4>Contact Info</h4>
                <ul>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-map-marker-alt"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link
                        target="_blank"
                        href="https://www.google.com/maps/place/Dhaka/@23.7806207,90.3492859,12z/data=!3m1!4b1!4m5!3m4!1s0x3755b8b087026b81:0x8fa563bbdd5904c2!8m2!3d23.8104753!4d90.4119873"
                      >
                        12/A, Mirnada City Tower, NYC
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="far fa-phone"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link href="tel:+088889797697" aria-label="Contact Us">
                        +088889797697
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-envelope"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link href="tel:+012-345-6789" aria-label="Contact Us">
                        <span className="mailto:support@mail.com">
                          support@mail.com
                        </span>
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="offcanvas__social">
                <ul>
                  <li>
                    <Link href="/">
                      <i className="fab fa-facebook-f"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="/">
                      <i className="fab fa-twitter"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="/">
                      <i className="fab fa-youtube"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="/">
                      <i className="fab fa-linkedin"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={(toggleMenu ? " overlay-open" : " ") + " offcanvas__overlay"}
        onClick={() => setToggleMenu(false)}
      ></div>
      <div className="offcanvas__overlay-white"></div>
      <header>
        <div
          id="header-sticky"
          className={
            (scrolled ? " sticky" : " ") +
            " header__area header__transparent header-five"
          }
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-2 col-6">
                <div className="header__logo">
                  <Link href="/">
                    <Image src={Logo} priority alt="logo not found" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-7 col-lg-9 d-none d-lg-block">
                <div className="menu__main-wrapper d-flex justify-content-center">
                  <div className="main-menu d-none d-none d-lg-block">
                    <nav id="mobile-menu">
                      <ul>
                        <li className="has-dropdown">
                          <button aria-label="Select dropdown">Home</button>
                          <ul className="submenu">
                            <li>
                              <Link href="/">SEO Agency 01</Link>
                            </li>
                            <li>
                              <Link href="/index-2">Digital Agency</Link>
                            </li>
                            <li>
                              <Link href="/index-3">SEO Agency 02</Link>
                            </li>
                            <li>
                              <Link href="/index-4">Creative Agency</Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <Link href="/about">About</Link>
                        </li>
                        <li>
                          <Link href="/service">Services</Link>
                        </li>

                        <li>
                          <Link href="/project">Portfolio</Link>
                        </li>
                        <li className="has-dropdown">
                          <button aria-label="Select Dropdown">Pages</button>
                          <ul className="submenu">
                            <li className="has-dropdown">
                              <Link href="about">about us</Link>
                            </li>
                            <li>
                              <Link href="/service">service</Link>
                            </li>
                            <li>
                              <Link href="/technical">Technical</Link>
                            </li>
                            <li>
                              <Link href="/project">Portfolio</Link>
                            </li>
                            <li>
                              <Link href="/analys">Analys</Link>
                            </li>
                            <li>
                              <Link href="/team">team</Link>
                            </li>
                          </ul>
                        </li>
                        <li className="has-dropdown">
                          <button aria-label="Select Dropdown">Blog</button>
                          <ul className="submenu">
                            <li>
                              <Link href="/blog">blog</Link>
                            </li>
                            <li>
                              <Link href="/blog-details">blog Details</Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <Link href="/contact">Contact</Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-1 col-6">
                <div className="header__right d-flex align-items-center justify-content-end">
                  <div className="header__btn d-none d-xl-block">
                    <Link className="border__btn" href="/contact">
                      Let&apos;s Talk
                    </Link>
                  </div>
                  <div className="header__toggle d-lg-none">
                    <button
                      className="sidebar__active"
                      aria-label="Toggle Sidebar"
                      onClick={handleToggleMenu}
                    >
                      <div className="bar-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </button>
                  </div>
                  <div className="header__hamburger d-none d-lg-block ml-60">
                    <button
                      className="humbager__icon sidebar__active"
                      aria-label="Hamburger"
                      onClick={handleToggleMenu}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="24"
                        viewBox="0 0 28 24"
                      >
                        <g
                          id="Group_27406"
                          data-name="Group 27406"
                          transform="translate(-1629 -60)"
                        >
                          <circle
                            id="Ellipse_1144"
                            data-name="Ellipse 1144"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(1641 60)"
                            fill="#828282"
                          />
                          <circle
                            id="Ellipse_1145"
                            data-name="Ellipse 1145"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(1653 60)"
                            fill="#828282"
                          />
                          <circle
                            id="Ellipse_1146"
                            data-name="Ellipse 1146"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(1629 60)"
                            fill="#828282"
                          />
                          <circle
                            id="Ellipse_1147"
                            data-name="Ellipse 1147"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(1641 70)"
                            fill="#828282"
                          />
                          <circle
                            id="Ellipse_1148"
                            data-name="Ellipse 1148"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(1653 70)"
                            fill="#828282"
                          />
                          <circle
                            id="Ellipse_1149"
                            data-name="Ellipse 1149"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(1629 70)"
                            fill="#828282"
                          />
                          <circle
                            id="Ellipse_1150"
                            data-name="Ellipse 1150"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(1641 80)"
                            fill="#828282"
                          />
                          <circle
                            id="Ellipse_1151"
                            data-name="Ellipse 1151"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(1653 80)"
                            fill="#828282"
                          />
                          <circle
                            id="Ellipse_1152"
                            data-name="Ellipse 1152"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(1629 80)"
                            fill="#828282"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default HeaderFive;
