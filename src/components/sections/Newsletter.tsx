'use client'

import { useState, useTransition } from 'react'
import { subscribeToNewsletter } from '@/app/actions/newsletter'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({
    type: 'idle',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    setStatus({ type: 'idle', message: '' })

    startTransition(async () => {
      try {
        const result = await subscribeToNewsletter(email)

        if (result.success) {
          setStatus({ type: 'success', message: result.message })
          setEmail('')
        } else {
          setStatus({ type: 'error', message: result.message })
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Ocorreu um erro inesperado. Tente novamente.' })
      }
    })
  }

  return (
    <section className="w-full bg-surface py-20 px-6 md:px-16 lg:px-[120px]">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20 max-w-[1200px] mx-auto">

        {/* Text Content */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <h2 className="font-serif text-[36px] md:text-[44px] text-primary font-bold mb-4 leading-[1.1]">
            Assine nossa newsletter
          </h2>
          <p className="font-sans text-[#a86c53] text-sm md:text-base leading-relaxed">
            Receba semanalmente os melhores endereços e notícias exclusivas<br className="hidden md:block" /> da Zona Norte direto no seu e-mail.
          </p>
        </div>

        {/* Form Area */}
        <div className="w-full lg:w-auto flex-shrink-0 flex flex-col items-center justify-center lg:items-end">
          {status.type === 'success' ? (
            <div className="w-full max-w-md lg:w-[450px] bg-[#FAF3EE] border border-green-200 rounded-2xl p-6 text-center shadow-sm">
              <span className="text-green-700 font-bold text-lg block mb-2">🎉 {status.message}</span>
              <p className="text-green-600/80 text-sm">Fique de olho na sua caixa de entrada.</p>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className={`flex items-center w-full max-w-md lg:w-[450px] bg-[#FAF3EE] border ${status.type === 'error' ? 'border-red-300' : 'border-[#E8D5C8]'} rounded-2xl p-1.5 shadow-sm transition-colors`}
              >
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  required
                  disabled={isPending}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-primary px-6 py-3 placeholder:text-[#C49A88] text-sm md:text-base w-full min-w-0 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary hover:bg-[#7a2a10] text-white font-bold text-[10px] md:text-xs uppercase tracking-widest px-8 md:px-10 py-4 rounded-2xl transition-colors flex-shrink-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {isPending ? 'Enviando...' : 'Cadastrar'}
                </button>
              </form>

              {status.type === 'error' && (
                <p className="text-red-500 text-sm mt-3 font-medium text-center lg:text-right w-full">
                  {status.message}
                </p>
              )}
            </>
          )}
        </div>

      </div>
    </section>
  )
}
