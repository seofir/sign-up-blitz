import React, { useState } from 'react'
import SignatureCanvas from './components/SignatureCanvas'
import CompanyStamp from './components/CompanyStamp'
import SignatureOnStamp from './components/SignatureOnStamp'
import { Pen, Stamp, PenTool } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState<'signature' | 'stamp' | 'combined'>('signature')

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Signature and Stamp App</h1>
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl">
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === 'signature'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } rounded-l-lg flex items-center justify-center`}
            onClick={() => setActiveTab('signature')}
          >
            <Pen className="mr-2" size={20} /> Signature
          </button>
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === 'stamp'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } flex items-center justify-center`}
            onClick={() => setActiveTab('stamp')}
          >
            <Stamp className="mr-2" size={20} /> Company Stamp
          </button>
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === 'combined'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } rounded-r-lg flex items-center justify-center`}
            onClick={() => setActiveTab('combined')}
          >
            <PenTool className="mr-2" size={20} /> Signature on Stamp
          </button>
        </div>
        {activeTab === 'signature' && <SignatureCanvas />}
        {activeTab === 'stamp' && <CompanyStamp />}
        {activeTab === 'combined' && <SignatureOnStamp />}
      </div>
    </div>
  )
}

export default App