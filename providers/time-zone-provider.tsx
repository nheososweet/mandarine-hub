'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface TimezoneContextType {
    timezone: string
    currentTime: Date
    formattedTime: string
    formattedDate: string
    hour: number
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined)

export const TimezoneProvider = ({ children }: { children: ReactNode }) => {
    const [timezone, setTimezone] = useState<string>('UTC')
    const [currentTime, setCurrentTime] = useState<Date>(new Date())
    const [formattedTime, setFormattedTime] = useState<string>('')
    const [formattedDate, setFormattedDate] = useState<string>('')
    const [hour, setHour] = useState<number>(0)

    // Helper function để lấy timezone của user
    const getUserTimezone = (): string => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone
        } catch {
            return 'UTC'
        }
    }

    // Helper function để format giờ phút giây
    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })
    }

    // Helper function để format ngày tháng năm
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    useEffect(() => {
        // Set timezone lần đầu
        setTimezone(getUserTimezone())

        // Update time mỗi giây
        const interval = setInterval(() => {
            const now = new Date()
            setCurrentTime(now)
            setFormattedTime(formatTime(now))
            setFormattedDate(formatDate(now))
            setHour(now.getHours())
        }, 1000)

        // Set initial values
        const now = new Date()
        setFormattedTime(formatTime(now))
        setFormattedDate(formatDate(now))
        setHour(now.getHours())

        return () => clearInterval(interval)
    }, [])

    return (
        <TimezoneContext.Provider
            value={{
                timezone,
                currentTime,
                formattedTime,
                formattedDate,
                hour
            }}
        >
            {children}
        </TimezoneContext.Provider>
    )
}

export const useTimezone = () => {
    const context = useContext(TimezoneContext)
    if (!context) {
        throw new Error('useTimezone must be used within TimezoneProvider')
    }
    return context
}