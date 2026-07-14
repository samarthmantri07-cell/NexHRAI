"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Only register in browser environment
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useGsap(callback: (context: gsap.Context, node: HTMLElement) => void, dependencies: any[] = []) {
  useIsomorphicLayoutEffect(() => {
    let ctx: gsap.Context;
    
    ctx = gsap.context((self) => {
      if (document.body) {
        callback(self, document.body);
      }
    });

    return () => ctx.revert();
  }, dependencies);
}
