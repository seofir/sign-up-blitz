import React, { useState, useRef } from 'react'
import { Download } from 'lucide-react'

function CompanyStamp() {
  const [companyName, setCompanyName] = useState('')
  const [companyNumber, setCompanyNumber] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateStamp = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set stamp style
    ctx.fillStyle = '#f0f0f0'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2

    // Draw square with rounded corners
    const size = 280
    const radius = 20
    ctx.beginPath()
    ctx.moveTo(10 + radius, 10)
    ctx.lineTo(10 + size - radius, 10)
    ctx.quadraticCurveTo(10 + size, 10, 10 + size, 10 + radius)
    ctx.lineTo(10 + size, 10 + size - radius)
    ctx.quadraticCurveTo(10 + size, 10 + size, 10 + size - radius, 10 + size)
    ctx.lineTo(10 + radius, 10 + size)
    ctx.quadraticCurveTo(10, 10 + size, 10, 10 + size - radius)
    ctx.lineTo(10, 10 + radius)
    ctx.quadraticCurveTo(10, 10, 10 + radius, 10)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Add text
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'

    // Company name
    ctx.font = 'bold 24px Arial'
    ctx.fillText(companyName.toUpperCase(), 150, 80)

    // Company number
    ctx.font = '18px Arial'
    ctx.fillText(companyNumber, 150, 120)

    // Company description (if provided)
    if (companyDescription) {
      ctx.font = '16px Arial'
      const words = companyDescription.split(' ')
      let line = ''
      let y = 160
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > 260 && i > 0) {
          ctx.fillText(line, 150, y)
          line = words[i] + ' '
          y += 24
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, 150, y)
    }
  }

  const downloadStamp = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'company_stamp.png'
      link.href = dataUrl
      link.click()
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="mb-4">
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="companyNumber" className="block text-sm font-medium text-gray-700">
            Company Number
          </label>
          <input
            type="text"
            id="companyNumber"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={companyNumber}
            onChange={(e) => setCompanyNumber(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700">
            Company Description (optional)
          </label>
          <textarea
            id="companyDescription"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={3}
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
          ></textarea>
        </div>
        <button
          onClick={generateStamp}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Stamp
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="border border-gray-300 rounded"
        ></canvas>
        <button
          onClick={downloadStamp}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Download className="mr-2" size={20} /> Download Stamp
        </button>
      </div>
    </div>
  )
}

export default CompanyStamp