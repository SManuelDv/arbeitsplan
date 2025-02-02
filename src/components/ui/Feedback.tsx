import React from 'react'
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'

export interface FeedbackProps {
  type?: 'success' | 'error' | 'info' | 'warning'
  message: string | string[]
  onClose?: () => void
  className?: string
}

export function Feedback({ type = 'info', message, onClose, className = '' }: FeedbackProps) {
  const messages = Array.isArray(message) ? message : [message]
  
  const styles = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  }

  const icons = {
    success: <FiCheckCircle className="w-5 h-5" />,
    error: <FiAlertCircle className="w-5 h-5" />,
    info: <FiInfo className="w-5 h-5" />,
    warning: <FiAlertCircle className="w-5 h-5" />
  }

  return (
    <div
      className={`rounded-lg p-4 mb-4 border ${styles[type]} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3">
          {messages.map((msg, index) => (
            <p key={index} className="text-sm">
              {msg}
            </p>
          ))}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8"
          >
            <span className="sr-only">Fechar</span>
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
} 
