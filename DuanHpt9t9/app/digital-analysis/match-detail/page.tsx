'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Mock match data
const mockMatches = {
  "1": {
    id: "1",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool", 
    homeLogo: "🔴",
    awayLogo: "🔴",
    time: "22:00",
    date: "2024-01-15",
    league: "Premier League",
    status: "Chưa đá"
  },
  "2": {
    id: "2", 
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    homeLogo: "🔵",
    awayLogo: "⚪",
    time: "21:00",
    date: "2024-01-15", 
    league: "La Liga",
    status: "Live",
    score: "1-1"
  },
  "3": {
    id: "3",
    homeTeam: "Bayern Munich", 
    awayTeam: "Dortmund",
    homeLogo: "🔴",
    awayLogo: "🟡",
    time: "20:30",
    date: "2024-01-15",
    league: "Bundesliga", 
    status: "FT",
    score: "2-1"
  }
}

export default function MatchDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const matchId = searchParams.get('id') || '1'
  const matchData = mockMatches[matchId as keyof typeof mockMatches] || mockMatches["1"]
  
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [duration] = useState(5400) // 90 minutes in seconds

  const handleBack = () => {
    console.log('Back button clicked')
    // Try browser history first, fallback to router
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    } else {
      router.back()
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const rewind = () => {
    setCurrentTime(Math.max(0, currentTime - 10))
  }

  const fastForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10))
  }

  const toggleSpeedMenu = () => {
    setShowSpeedMenu(prev => !prev)
  }

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed)
    setShowSpeedMenu(false)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value)
    setCurrentTime(newTime)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Auto-update time when playing
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + playbackSpeed
          return newTime >= duration ? duration : newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTime, duration, playbackSpeed])

  // Auto-pause when reaching the end
  useEffect(() => {
    if (currentTime >= duration) {
      setIsPlaying(false)
    }
  }, [currentTime, duration])



  return (
    <div className="min-h-screen bg-slate-800 text-white">
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
        }
        
        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: #475569;
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900">
        <button 
          onClick={handleBack}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Quay lại</span>
        </button>
        
        <h1 className="text-xl font-bold">Chi tiết trận đấu</h1>
        
        <div className="w-32"></div>
      </div>

      {/* Match Info */}
      <div className="p-4">
        <div className="bg-slate-700 rounded-lg p-4 mb-4">
          <h2 className="text-blue-400 text-center text-lg font-semibold mb-4">{matchData.league}</h2>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  {matchData.homeLogo}
                </div>
                <span className="text-sm">{matchData.homeTeam}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{matchData.score || "vs"}</div>
              <div className="text-sm text-slate-400">{matchData.time}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  {matchData.awayLogo}
                </div>
                <span className="text-sm">{matchData.awayTeam}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <span className="bg-slate-600 px-3 py-1 rounded text-sm">
              {currentTime === 0 ? 'Chưa đá' : isPlaying ? 'Đang đá' : 'Tạm dừng'}
            </span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm">{formatTime(currentTime)}'</span>
            </div>
          </div>
        </div>

        {/* Betting Table */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="bg-slate-100 p-2">
            <span className="text-slate-800 font-medium text-sm">TRỰC TIẾP 00:00AM</span>
          </div>

          {/* Header Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-400">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-medium text-blue-600 border border-slate-400" style={{width: '13.33%'}}>Tên đội</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-blue-600 border border-slate-400" style={{width: '6.67%'}}>Tỷ số</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-blue-600 border border-slate-400" colSpan={2} style={{width: '13.33%'}}>Cược Chấp Toàn Trận</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-blue-600 border border-slate-400" colSpan={2} style={{width: '13.33%'}}>Tài Xỉu Toàn Trận</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-blue-600 border border-slate-400" style={{width: '13.33%'}}>1X2 Toàn Trận</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-blue-600 border border-slate-400" colSpan={2} style={{width: '13.33%'}}>Cược Chấp Hiệp 1</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-blue-600 border border-slate-400" colSpan={2} style={{width: '13.33%'}}>Tài Xỉu Hiệp 1</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-blue-600 border border-slate-400" style={{width: '13.33%'}}>1X2 Hiệp 1</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Data Table 1 - Teams */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-400 border-t-0">
              <tbody>
                {/* Team 1 Row */}
                <tr className="h-12">
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '13.33%'}}>
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-orange-500 text-xs">{matchData.homeLogo}</span>
                      <span className="font-medium text-slate-800 text-xs">{matchData.homeTeam}</span>
                    </div>
                  </td>
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '6.67%'}}>
                    <span className="text-red-500 text-xs font-bold">2</span>
                  </td>
                  {/* Cược Chấp Toàn Trận - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}>0/0.5</td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '6.665%'}}>0.85</td>
                  {/* Tài Xỉu Toàn Trận - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}>3.5/4</td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '6.665%'}}>0.90</td>
                  {/* 1X2 Toàn Trận */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '13.33%'}}>1.05</td>
                  {/* Cược Chấp Hiệp 1 - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}>0/0.5</td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-red-500" style={{width: '6.665%'}}>-0.68</td>
                  {/* Tài Xỉu Hiệp 1 - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}>2.5</td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-red-500" style={{width: '6.665%'}}>-0.9</td>
                  {/* 1X2 Hiệp 1 */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '13.33%'}}>1.85</td>
                </tr>

                {/* Team 2 Row */}
                <tr className="h-12">
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '13.33%'}}>
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-orange-500 text-xs">{matchData.awayLogo}</span>
                      <span className="font-medium text-slate-800 text-xs">{matchData.awayTeam}</span>
                    </div>
                  </td>
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '6.67%'}}>
                    <span className="text-red-500 text-xs font-bold">0</span>
                  </td>
                  {/* Cược Chấp Toàn Trận - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}></td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '6.665%'}}>0.99</td>
                  {/* Tài Xỉu Toàn Trận - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}>u</td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '6.665%'}}>0.92</td>
                  {/* 1X2 Toàn Trận */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '13.33%'}}>42.00</td>
                  {/* Cược Chấp Hiệp 1 - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}></td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '6.665%'}}>0.52</td>
                  {/* Tài Xỉu Hiệp 1 - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}>u</td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '6.665%'}}>0.72</td>
                  {/* 1X2 Hiệp 1 */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '13.33%'}}>30.15</td>
                </tr>

                {/* Third row - Additional team/odds row */}
                <tr className="h-12">
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '13.33%'}}>
                  </td>
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '6.67%'}}>
                  </td>
                  {/* Cược Chấp Toàn Trận - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}></td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}></td>
                  {/* Tài Xỉu Toàn Trận - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}></td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}></td>
                  {/* 1X2 Toàn Trận */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '13.33%'}}>6.90</td>
                  {/* Cược Chấp Hiệp 1 - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}></td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}></td>
                  {/* Tài Xỉu Hiệp 1 - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}></td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}></td>
                  {/* 1X2 Hiệp 1 */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '13.33%'}}>2.50</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Spacer Row - Bằng chiều cao 1 hàng bảng */}
          <div className="h-12"></div>

          {/* Data Table 2 - Additional Odds */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-400">
              <tbody>
                {/* Draw Row - Hòa */}
                <tr className="h-12">
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '13.33%'}}>
                  </td>
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '6.67%'}}></td>
                  {/* Cược Chấp Toàn Trận - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}>0.5</td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-red-500" style={{width: '6.665%'}}>-0.86</td>
                  {/* Tài Xỉu Toàn Trận - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}>3.5</td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '6.665%'}}>0.67</td>
                  {/* 1X2 Toàn Trận */}
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '13.33%'}}></td>
                  {/* Cược Chấp Hiệp 1 - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}>0</td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '6.665%'}}>0.49</td>
                  {/* Tài Xỉu Hiệp 1 - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}>2.5/3</td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-red-500" style={{width: '6.665%'}}>-0.61</td>
                  {/* 1X2 Hiệp 1 */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '13.33%'}}></td>
                </tr>

                {/* Additional odds row */}
                <tr className="h-12">
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '13.33%'}}></td>
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '6.67%'}}></td>
                  {/* Cược Chấp Toàn Trận - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}></td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '6.665%'}}>0.70</td>
                  {/* Tài Xỉu Toàn Trận - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}>u</td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-red-500" style={{width: '6.665%'}}>-0.85</td>
                  {/* 1X2 Toàn Trận */}
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '13.33%'}}></td>
                  {/* Cược Chấp Hiệp 1 - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}></td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-red-500" style={{width: '6.665%'}}>-0.65</td>
                  {/* Tài Xỉu Hiệp 1 - 2 cột */}
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs text-slate-800" style={{width: '6.665%'}}>u</td>
                  <td className="px-1 py-2 text-center border border-slate-400 text-xs font-semibold text-slate-800" style={{width: '6.665%'}}>0.43</td>
                  {/* 1X2 Hiệp 1 */}
                  <td className="px-1 py-2 text-center border border-slate-400" style={{width: '13.33%'}}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 p-4">
        <div className="flex items-center justify-center space-x-4 mb-4">
          {/* Restart Button */}
          <button 
            onClick={() => setCurrentTime(0)}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
            title="Restart"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Rewind Button */}
          <button 
            onClick={rewind}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
            title="Tua lại 10s"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" transform="rotate(180 10 10)" />
            </svg>
          </button>
          
          {/* Play/Pause Button */}
          <button 
            onClick={togglePlay}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
            title={isPlaying ? "Tạm dừng" : "Phát"}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          {/* Fast Forward Button */}
          <button 
            onClick={fastForward}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
            title="Tua tới 10s"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Speed Settings Button */}
          <div className="relative speed-menu-container">
            <button 
              onClick={toggleSpeedMenu}
              className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors relative"
              title={`Cài đặt tốc độ (${playbackSpeed}x)`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              {showSpeedMenu && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {playbackSpeed}x
                </span>
              )}
            </button>
          </div>
          
          {/* Speed Menu - Rendered separately */}
          {showSpeedMenu && (
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowSpeedMenu(false)}
            >
              <div 
                className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-slate-900 rounded-lg shadow-lg border border-slate-600 py-2 min-w-[120px] z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-1 text-xs text-slate-400 border-b border-slate-600 mb-1">Tốc độ phát</div>
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedSelect(speed)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-700 transition-colors ${
                      playbackSpeed === speed ? 'text-blue-400 bg-slate-700' : 'text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1 mx-4 relative">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSliderChange}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #475569 ${(currentTime / duration) * 100}%, #475569 100%)`
              }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}