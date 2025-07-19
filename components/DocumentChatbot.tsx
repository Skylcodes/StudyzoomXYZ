'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Document } from '@/types/Document';
import { toast } from 'react-hot-toast';
import { 
  SendIcon, 
  BotIcon, 
  UserIcon, 
  AlertCircleIcon,
  MessageSquareIcon,
  LoaderIcon
} from 'lucide-react';

interface DocumentChatbotProps {
  document: Document;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function DocumentChatbot({ document }: DocumentChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canChat, setCanChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkChatAvailability = useCallback(async () => {
    try {
      const response = await fetch(`/api/documents/${document.id}/chat`);
      if (response.ok) {
        const data = await response.json();
        setCanChat(data.document?.canChat || false);
      }
    } catch (err) {
      console.error('Error checking chat availability:', err);
    }
  }, [document.id]);

  useEffect(() => {
    checkChatAvailability();
  }, [document.id, document.status, document.parsed_text, checkChatAvailability]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/documents/${document.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      if (data.success && data.response) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!canChat) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b border-slate-800/50 p-4">
          <div className="flex items-center gap-3">
            <BotIcon className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Document Chat</h3>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <AlertCircleIcon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h4 className="text-white font-medium mb-2">Chat Not Available</h4>
            <p className="text-slate-400 text-sm">
              {document.status === 'ready' 
                ? 'This document needs text extraction for chat. Click "Fix Document" button to enable chat.'
                : 'This document needs to be processed before you can chat with it.'
              }
            </p>
            <div className="mt-4 text-xs text-slate-500">
              Status: {document.status} • Text Available: {document.parsed_text ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/50">
      {/* Header */}
      <div className="border-b border-slate-800/50 p-4">
        <div className="flex items-center gap-3">
          <BotIcon className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Document Chat</h3>
            <p className="text-xs text-slate-400">
              Ask questions about {document.title || document.original_filename} or anything else
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <MessageSquareIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">
              Start a conversation about your document or ask any question
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'bot' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <BotIcon className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            )}
            
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
              <div
                className={`rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/50 border border-slate-700 text-slate-100'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              <div className="text-xs text-slate-500 mt-1 px-1">
                {formatTime(message.timestamp)}
              </div>
            </div>

            {message.type === 'user' && (
              <div className="flex-shrink-0 order-1">
                <div className="w-8 h-8 bg-slate-600/20 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <BotIcon className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <LoaderIcon className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-sm text-slate-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800/50 p-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about this document or anything else..."
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
            maxLength={1000}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-slate-500">
          {inputMessage.length}/1000 characters
        </div>
      </div>
    </div>
  );
}