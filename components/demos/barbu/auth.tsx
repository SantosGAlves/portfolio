"use client"

import { Lock, Mail, Phone, User as UserIcon } from "lucide-react"
import { useRef, useState } from "react"
import type { BarbuDemoContent } from "@/content/demos/barbu-types"
import { AppBar, AppDialog, Field, Logo, PrimaryButton, TextButton, c, focus } from "./ui"

// Splash, login (com "Esqueceu a senha?") e cadastro. Nada é autenticado de verdade.

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Splash({ content }: { content: BarbuDemoContent }) {
  return (
    <div className="grid h-full place-items-center">
      <div className="grid justify-items-center gap-8">
        <Logo size="lg" />
        <span
          role="img"
          aria-label={content.splash.loading}
          className="size-8 animate-spin rounded-full border-2 border-[#D32F2F] border-t-transparent motion-reduce:animate-none"
        />
      </div>
    </div>
  )
}

export function Login({
  content,
  onSignIn,
  onRegister,
  notify,
}: {
  content: BarbuDemoContent
  onSignIn: (email: string) => void
  onRegister: () => void
  notify: (text: string) => void
}) {
  const t = content.login
  const [forgot, setForgot] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <>
      <div inert={forgot !== null} className="h-full overflow-y-auto overscroll-contain px-7 pt-14 pb-8">
        <div className="grid gap-1 text-center">
          <Logo />
          <p className={`text-xs tracking-[0.2em] ${c.muted}`}>{t.tagline}</p>
        </div>
        <form
          ref={formRef}
          className="mt-12 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            const email = String(new FormData(e.currentTarget).get("email") ?? "").trim()
            onSignIn(email)
          }}
        >
          <Field label={t.email} icon={Mail} name="email" type="email" autoComplete="off" inputMode="email" />
          <Field label={t.password} icon={Lock} name="password" type="password" autoComplete="off" />
          <div className="-mt-1 flex justify-end">
            <TextButton
              // O pop-up já abre com o e-mail digitado no login, como no app.
              onClick={() => setForgot(String(new FormData(formRef.current ?? undefined).get("email") ?? ""))}
              className={c.muted}
            >
              {t.forgot}
            </TextButton>
          </div>
          <PrimaryButton type="submit" className="mt-3">
            {t.submit}
          </PrimaryButton>
          <button
            type="button"
            onClick={() => onSignIn("")}
            className={`h-12 rounded-[15px] border border-white/15 text-sm font-semibold text-white ${focus}`}
          >
            {t.guest}
          </button>
          <p className={`text-center text-xs ${c.muted}`}>{t.hint}</p>
        </form>
        <p className={`mt-6 flex flex-wrap items-center justify-center gap-x-1 text-sm ${c.muted}`}>
          {t.noAccount}
          <TextButton onClick={onRegister} className={`font-bold ${c.redText}`}>
            {t.signUp}
          </TextButton>
        </p>
      </div>

      {forgot !== null ? (
        <ForgotDialog
          content={content}
          initial={forgot}
          onClose={() => setForgot(null)}
          onSent={() => {
            setForgot(null)
            notify(content.forgot.sent)
          }}
          notify={notify}
        />
      ) : null}
    </>
  )
}

function ForgotDialog({
  content,
  initial,
  onClose,
  onSent,
  notify,
}: {
  content: BarbuDemoContent
  initial: string
  onClose: () => void
  onSent: () => void
  notify: (text: string) => void
}) {
  const t = content.forgot
  return (
    <AppDialog labelledBy="barbu-forgot" onClose={onClose}>
      <h3 id="barbu-forgot" className="text-lg font-bold text-white">
        {t.title}
      </h3>
      <p className={`text-sm leading-relaxed ${c.soft}`}>{t.text}</p>
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          const email = String(new FormData(e.currentTarget).get("email") ?? "").trim()
          if (!emailPattern.test(email)) {
            notify(t.invalid)
            return
          }
          onSent()
        }}
      >
        <Field label={t.email} icon={Mail} name="email" type="email" inputMode="email" autoComplete="off" defaultValue={initial} />
        <div className="flex justify-end gap-2">
          <TextButton onClick={onClose} className={c.muted}>
            {t.cancel}
          </TextButton>
          <button type="submit" className={`min-h-11 rounded-[10px] bg-[#D32F2F] px-4 text-sm font-bold text-white ${focus}`}>
            {t.send}
          </button>
        </div>
      </form>
    </AppDialog>
  )
}

export function Register({
  content,
  onBack,
  onCreate,
  notify,
}: {
  content: BarbuDemoContent
  onBack: () => void
  onCreate: (user: { name: string; phone: string; email: string }) => void
  notify: (text: string) => void
}) {
  const t = content.register
  return (
    <div className="flex h-full flex-col">
      <AppBar back={t.back} onBack={onBack} />
      <div className="flex-1 overflow-y-auto overscroll-contain px-7 pb-8">
        <h3 className="text-[2rem] leading-tight font-bold text-white">{t.title}</h3>
        <p className={c.muted}>{t.subtitle}</p>
        <form
          noValidate
          className="mt-8 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            const get = (k: string) => String(f.get(k) ?? "").trim()
            const user = { name: get("name"), phone: get("phone"), email: get("email") }
            const password = get("password")
            if (!user.name || !user.phone || !user.email || !password) return notify(t.required)
            if (!emailPattern.test(user.email)) return notify(t.invalidEmail)
            // Mesma regra do Firebase Auth no app: senha com menos de 6 caracteres é "weak-password".
            if (password.length < 6) return notify(t.weak)
            onCreate(user)
          }}
        >
          <Field label={t.name} icon={UserIcon} name="name" autoComplete="off" />
          <Field label={t.phone} icon={Phone} name="phone" type="tel" inputMode="tel" autoComplete="off" />
          <Field label={t.email} icon={Mail} name="email" type="email" inputMode="email" autoComplete="off" />
          <Field label={t.password} icon={Lock} name="password" type="password" autoComplete="off" />
          <PrimaryButton type="submit" className="mt-4">
            {t.submit}
          </PrimaryButton>
        </form>
      </div>
    </div>
  )
}
