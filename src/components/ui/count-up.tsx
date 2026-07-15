"use client"

import { useEffect, useState, useRef } from "react"

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export default function CountUp({ end, duration = 1500, suffix = "", prefix = "", className }: CountUpProps) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    let start = 0
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [visible, end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  )
}
