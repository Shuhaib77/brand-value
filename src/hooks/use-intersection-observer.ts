"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return [ref, visible]
}
