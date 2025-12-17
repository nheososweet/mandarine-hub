'use client'

import React, { useState, useEffect } from 'react'

interface RealtimeClockProps {
    className?: string
    dateTimeClassName?: string
    locale?: 'en' | 'vi'
}

const RealtimeClock: React.FC<RealtimeClockProps> = ({
    className = '',
    dateTimeClassName = '',
    locale = 'vi'
}) => {
    const [date, setDate] = useState<string>('')
    const [time, setTime] = useState<string>('')

    useEffect(() => {
        // Set initial value
        const updateDateTime = () => {
            const now = new Date()

            // Format time (giờ:phút:giây)
            const formattedTime = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })
            setTime(formattedTime)

            // Format date (khác nhau theo locale)
            let formattedDate: string

            if (locale === 'vi') {
                // dd/mm/yyyy
                const day = String(now.getDate()).padStart(2, '0')
                const month = String(now.getMonth() + 1).padStart(2, '0')
                const year = now.getFullYear()
                formattedDate = `${day}/${month}/${year}`
            } else {
                // en: Mon, Jan 1, 2025
                formattedDate = now.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })
            }

            setDate(formattedDate)
        }

        updateDateTime()

        // Update mỗi giây
        const interval = setInterval(updateDateTime, 1000)

        return () => clearInterval(interval)
    }, [locale])

    return (
        <div className={`flex gap-2 ${className}`}>
            <div className={`font-mono text-xs ${dateTimeClassName}`}>
                {date}
            </div>
            <div className={`font-mono text-xs ${dateTimeClassName}`}>
                {time}
            </div>
        </div>
    )
}

export default React.memo(RealtimeClock)