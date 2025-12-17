// 'use client'

// import { Variants } from 'framer-motion'
// import { useEffect, useState } from 'react'
// import Image from 'next/image'
// import SplitText from '@/components/SplitText'


// interface GreetingData {
//   content: string
//   image: string
// }

// const ChatBlankState = () => {
//   const [greeting, setGreeting] = useState<GreetingData>({
//     content: "Hi there!",
//     image: "/hi.webp"
//   })
//   const getGreetingByTime = (hour: number): GreetingData => {
//     if (hour >= 5 && hour < 12) {
//       return {
//         content: "Good morning!",
//         image: "/sun.webp"
//       }
//     } else if (hour >= 12 && hour < 17) {
//       return {
//         content: "Good afternoon!",
//         image: "/sun_behind_cloud.webp"
//       }
//     } else if (hour >= 17 && hour < 21) {
//       return {
//         content: "Good evening!",
//         image: "/night_with_star.webp"
//       }
//     } else {
//       return {
//         content: "Good night!",
//         image: "/crescent_moon.webp"
//       }
//     }
//   }

//   // Helper function để lấy timezone offset của user
//   const getUserTimezone = (): string => {
//     try {
//       return Intl.DateTimeFormat().resolvedOptions().timeZone
//     } catch {
//       return "UTC"
//     }
//   }

//   // Helper function để lấy giờ local của user
//   const getUserLocalHour = (): number => {
//     const now = new Date()
//     return now.getHours()
//   }

//   useEffect(() => {
//     // Lấy giờ local của user
//     const hour = getUserLocalHour()
//     const timezone = getUserTimezone()

//     setGreeting(getGreetingByTime(hour))
//   }, [])


//   return (
//     <section
//       className="flex flex-col items-center text-center font-geist"
//       aria-label="Welcome message"
//     >
//       <div className="flex max-w-3xl flex-col gap-y-8">
//         <Image
//           src={greeting.image}
//           alt={greeting.content}
//           width={60}
//           height={60}
//           className="mx-auto mb-4"
//         />
//         <SplitText
//           text={greeting.content}
//           className="text-2xl font-semibold text-center"
//           delay={100}
//           duration={0.4}
//           ease="power3.out"
//           splitType="chars"
//           from={{ opacity: 0, y: 40 }}
//           to={{ opacity: 1, y: 0 }}
//           threshold={0.1}
//           rootMargin="-100px"
//           textAlign="center"
//         />
//       </div>
//     </section>
//   )
// }

// export default ChatBlankState

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface GreetingData {
  content: string
  image: string
}

const ChatBlankState = () => {
  const [greeting, setGreeting] = useState<GreetingData | null>(null)
  const [isClient, setIsClient] = useState(false)

  const getGreetingByTime = (hour: number): GreetingData => {
    if (hour >= 5 && hour < 12) {
      return {
        content: "Good morning!",
        image: "/sun.webp"
      }
    } else if (hour >= 12 && hour < 17) {
      return {
        content: "Good afternoon!",
        image: "/sun_behind_cloud.webp"
      }
    } else if (hour >= 17 && hour < 21) {
      return {
        content: "Good evening!",
        image: "/night_with_star.webp"
      }
    } else {
      return {
        content: "Good night!",
        image: "/crescent_moon.webp"
      }
    }
  }

  const getUserLocalHour = (): number => {
    return new Date().getHours()
  }

  useEffect(() => {
    setIsClient(true)
    const hour = getUserLocalHour()
    setGreeting(getGreetingByTime(hour))
  }, [])

  if (!isClient || !greeting) {
    return null
  }

  return (
    <section
      className="flex flex-col items-center text-center font-geist"
      aria-label="Welcome message"
    >
      <motion.div
        className="flex max-w-3xl flex-col gap-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <Image
            // src={greeting.image}
            src={"/hi.webp"}
            alt={greeting.content}
            width={60}
            height={60}
            className="mx-auto"
          />
        </motion.div>

        <motion.h1
          className="text-2xl font-semibold text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          {greeting.content}
        </motion.h1>
      </motion.div>
    </section>
  )
}

export default ChatBlankState