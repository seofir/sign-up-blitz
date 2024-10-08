import React, { useRef, useState, useEffect } from 'react'
import { Download, Eraser } from 'lucide-react'

function SignatureOnStamp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [companyNumber, setCompanyNumber] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [stampGenerated, setStampGenerated] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const context = canvas.getContext('2d')
      if (context) {
        context.lineWidth = 2
        context.lineCap = 'round'
        context.strokeStyle = '#000000'
        setCtx(context)
      }
    }
  }, [])

  const prepareCanvas = () => {
    if (stampGenerated && !canvasReady) {
      setCanvasReady(true)
      if (ctx) {
        ctx.beginPath()
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!stampGenerated || !canvasReady) return
    setIsDrawing(true)
    const { offsetX, offsetY } = getCoordinates(e)
    ctx?.moveTo(offsetX, offsetY)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (ctx) {
      ctx.beginPath()
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !canvasRef.current || !canvasReady) return
    const { offsetX, offsetY } = getCoordinates(e)
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(offsetX, offsetY)
  }

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { offsetX: 0, offsetY: 0 }
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    let clientX, clientY
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    const offsetX = clientX - rect.left
    const offsetY = clientY - rect.top
    return { offsetX, offsetY }
  }

  const generateStamp = () => {
    if (!ctx || !canvasRef.current) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

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

    setStampGenerated(true)
    setCanvasReady(false)
  }

  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      generateStamp()
      setCanvasReady(false)
    }
  }

  const downloadSignatureOnStamp = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'signature_on_stamp.png'
      link.href = dataUrl
      link.click()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-blue-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How to use Signature on Stamp:</h2>
        <ol className="list-decimal list-inside">
          <li>Enter your company details in the fields below</li>
          <li>Click "Generate Stamp" to create your company stamp</li>
          <li>Click once on the stamp to activate the drawing area</li>
          <li>Use your mouse or finger to sign on the stamp</li>
          <li>Click "Clear Signature" to remove the signature and try again</li>
          <li>When satisfied, click "Download" to save your stamped signature</li>
        </ol>
      </div>
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
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            Generate Stamp
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="border border-gray-300 rounded cursor-crosshair"
            onClick={prepareCanvas}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
          />
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={clearCanvas}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
              disabled={!stampGenerated}
            >
              <Eraser className="mr-2" size={20} /> Clear Signature
            </button>
            <button
              onClick={downloadSignatureOnStamp}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
              disabled={!stampGenerated}
            >
              <Download className="mr-2" size={20} /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignatureOnStamp