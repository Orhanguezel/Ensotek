"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

function useCountUp(end: number, duration: number, inView: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60);
    let raf: number;

    const animate = () => {
      start += step;
      if (start >= end) {
        setValue(end);
        return;
      }
      setValue(Math.floor(start));
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, inView]);

  return value;
}

const AboutCounter = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const count1 = useCountUp(45, 3, inView);
  const count2 = useCountUp(7140, 3, inView);
  const count3 = useCountUp(502, 3, inView);

  return (
    <section className="fact__area pt-120 pb-90 bg-white">
      <div className="container">
        <div className="row " data-aos="fade-up" data-aos-delay="300" ref={ref}>
          <div className="col-xl-4">
            <div className="fact__item mb-30">
              <div className="fact__count">
                <div className="fact__number">
                  <span className="counter">{count1}</span>
                </div>
                <div className="fact__letter">
                  <span>k</span>
                  <span className="plus">+</span>
                </div>
              </div>
              <div className="fact__content">
                <h3>
                  <Link href="/">Succeeded projects</Link>
                </h3>
                <p>Projects Completed</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="fact__item mb-30">
              <div className="fact__count">
                <div className="fact__number">
                  <span className="counter">{count2}</span>
                </div>
                <div className="fact__letter">
                  <span>k</span>
                  <span className="plus">+</span>
                </div>
              </div>
              <div className="fact__content">
                <h3>
                  <Link href="/">Succeeded projects</Link>
                </h3>
                <p>Projects Completed</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="fact__item mb-30">
              <div className="fact__count">
                <div className="fact__number">
                  <span className="counter">{count3}</span>
                </div>
                <div className="fact__letter">
                  <span>k</span>
                  <span className="plus">+</span>
                </div>
              </div>
              <div className="fact__content">
                <h3>
                  <Link href="/">Succeeded projects</Link>
                </h3>
                <p>Projects Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCounter;
