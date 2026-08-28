"use client";

import { useEffect } from "react";

export function RevealController() {
  useEffect(() => {
    const selectors = [
      ".section-heading", ".service-card", ".quality-copy",
      ".price-intro", ".price-card", ".industries > .kicker", ".industries > h2",
      ".industry-list > div", ".calculator-intro", ".calculator-card", ".contact > div", "footer > *",
    ];
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selectors.join(",")));
    if (!("IntersectionObserver" in window)) {
      document.documentElement.dataset.motion = "unsupported";
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    document.documentElement.dataset.motion = "full";
    document.documentElement.classList.add("motion-ready");
    elements.forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${(index % 3) * 45}ms`);
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -10% 0px" });

    // Let the browser paint the initial hidden state before observing. Without
    // this frame boundary, content near the fold can become visible before its
    // transition is perceptible.
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        elements.forEach((element) => observer.observe(element));
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      observer.disconnect();
    };
  }, []);
  return null;
}
