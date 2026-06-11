'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Integração futura com API de Newsletter
    console.log('E-mail cadastrado:', email)
    setEmail('')
  }

  return (
    <section className="w-full bg-surface py-20 px-6 md:px-16 lg:px-[120px]">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20 max-w-[1200px] mx-auto">
        
        {/* Text Content */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <h2 className="font-serif text-[36px] md:text-[44px] text-primary font-bold mb-4 leading-[1.1]">
            Assine nossa curadoria
          </h2>
          <p className="font-sans text-[#a86c53] text-sm md:text-base leading-relaxed">
            Receba semanalmente os melhores endereços e notícias exclusivas<br className="hidden md:block" /> da Zona Norte direto no seu e-mail.
          </p>
        </div>

        {/* Form Area */}
        <div className="w-full lg:w-auto flex-shrink-0 flex items-center justify-center lg:justify-end">
          <form 
            onSubmit={handleSubmit}
            className="flex items-center w-full max-w-md lg:w-[450px] bg-[#FAF3EE] border border-[#E8D5C8] rounded-2xl p-1.5 shadow-sm"
          >
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-primary px-6 py-3 placeholder:text-[#C49A88] text-sm md:text-base w-full min-w-0"
            />
            <button 
              type="submit"
              className="bg-primary hover:bg-[#7a2a10] text-white font-bold text-[10px] md:text-xs uppercase tracking-widest px-8 md:px-10 py-4 rounded-2xl transition-colors flex-shrink-0"
            >
              Cadastrar
            </button>
          </form>
        </div>

      </div>
    </section>
  )
}
