'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function EyeIcon() {
  return (
    <svg
      aria-hidden
      className="h-6 w-6 text-[#CFD9E0]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 5c-5.23 0-9.82 3.17-11.58 7.75a1.1 1.1 0 0 0 0 .8C2.18 18.17 6.77 21.34 12 21.34s9.82-3.17 11.58-7.79a1.1 1.1 0 0 0 0-.8C21.82 8.17 17.23 5 12 5Zm0 13.07c-3.69 0-7-2.32-8.56-5.67C6 8.05 9.31 5.73 12 5.73s7 2.32 8.56 5.67c-1.56 3.38-4.87 5.67-8.56 5.67Zm0-9.9a4.23 4.23 0 1 0 4.23 4.23A4.23 4.23 0 0 0 12 8.17Zm0 6.53a2.3 2.3 0 1 1 2.3-2.3 2.3 2.3 0 0 1-2.3 2.3Z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden
      className="h-6 w-6 text-[#CFD9E0]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 5.73c2.69 0 7 2.32 8.56 5.67a15.45 15.45 0 0 1-1.92 2.95l1.42 1.42A17.42 17.42 0 0 0 23.58 12.8a1.1 1.1 0 0 0 0-.8C21.82 8.17 17.23 5 12 5a11.67 11.67 0 0 0-3.45.52l1.64 1.64A9.88 9.88 0 0 1 12 5.73ZM1.71 3.29a1 1 0 0 0 0 1.42l2.62 2.62A17.42 17.42 0 0 0 .42 11.2a1.1 1.1 0 0 0 0 .8C2.18 16.83 6.77 20 12 20a11.67 11.67 0 0 0 4.88-1.06l3.7 3.7a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42ZM12 18.07c-3.69 0-7-2.32-8.56-5.67a15.45 15.45 0 0 0 2.43-3.24l2.07 2.07a4.23 4.23 0 0 0 5.9 5.9l1.76 1.76A9.88 9.88 0 0 1 12 18.07Zm2.3-5.77a2.3 2.3 0 0 1-2.3 2.3 2.26 2.26 0 0 1-.89-.18l2.93-2.93a2.26 2.26 0 0 1 .26.81Zm-4.6-4.6 1.14 1.14a4.23 4.23 0 0 0-1.14 2.89 4.23 4.23 0 0 0 4.23 4.23 4.23 4.23 0 0 0 2.89-1.14l1.43 1.43a9.88 9.88 0 0 1-5.55 1.68c-3.69 0-7-2.32-8.56-5.67a15.45 15.45 0 0 0 2.43-3.24l1.14 1.14Z" />
    </svg>
  )
}

export default function Home() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center bg-night px-4 py-10">
      <div className="grid w-full max-w-[1120px] grid-cols-1 overflow-hidden rounded-[30px] bg-night shadow-card md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="flex flex-col gap-12 px-8 py-12 sm:px-12 lg:px-16">
          <div className="flex justify-start">
            <Image
              src="/images/tartibix-logo.svg"
              alt="Tartibix logo"
              width={259}
              height={82}
              priority
              className="h-auto w-48 sm:w-56"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <form className="mx-auto flex w-full max-w-[528px] flex-col gap-8">
              <div className="flex flex-col gap-6">
                <label className="flex flex-col gap-2 text-base font-medium text-muted-text">
                  E-mail
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="h-[55px] rounded-xl border border-transparent bg-surface px-5 text-base text-soft-white shadow-inset focus:border-accent focus:ring-0"
                  />
                </label>

                <label className="flex flex-col gap-2 text-base font-medium text-muted-text">
                  Password
                  <div className="flex items-center rounded-xl bg-surface shadow-inset">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="@#*%"
                      className="h-[55px] flex-1 rounded-xl rounded-r-none border-0 bg-transparent px-5 text-base text-soft-white focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex h-[55px] items-center justify-center gap-3 rounded-xl rounded-l-none border-l border-[#2F303A] px-4 text-muted-foreground transition hover:text-accent"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-3 text-base text-muted-text">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#CFD9E0] bg-transparent text-accent focus:ring-accent/40"
                  />
                  Remember me
                </label>
                <Link
                  href="#"
                  className="text-base font-medium text-accent transition hover:text-accent/80"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="mt-2 h-[60px] rounded-[20px] bg-accent-soft text-lg font-semibold text-soft-white transition hover:bg-accent/70"
              >
                Sign in
              </button>
            </form>
          </div>
        </section>

        <section className="hidden h-full flex-col justify-between bg-surface px-10 py-12 text-center text-soft-white md:flex lg:px-16">
          <div className="flex flex-1 flex-col items-center justify-center gap-10 pb-16">
            <Image
              src="/images/login-illustration.png"
              alt="Team showcasing new features"
              width={443}
              height={425}
              priority
              className="h-auto w-full max-w-[420px]"
            />
            <div className="max-w-[480px] space-y-5">
              <h2 className="text-3xl font-semibold">Introducing new features</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Streamline your workflow with powerful project management tools. 
                Track tasks, manage teams, and deliver projects on time with Tartibix.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src="/images/login-carousel-indicator.svg"
              alt="Carousel indicator"
              width={106}
              height={29}
              className="h-5 w-auto"
            />
          </div>
        </section>
      </div>
    </main>
  )
}
