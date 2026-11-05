"use client"

import { buttonVariants } from "@/components/ui/button"
import { useState } from "react"
import { priorities, sectorIds, type DemandasDemoContent, type Priority, type SectorId } from "@/content/demos/demandas-types"
import { addDays, fill, isLockedUser, toDateInput, type DemoState, type TicketDraft, type User } from "./logic"
import { CloseIcon, Dialog, inputClass, labelClass } from "./parts"

// Abertura de demanda e gestão de usuários (só admin).

export function NewTicketDialog({
  open,
  user,
  now,
  content,
  onClose,
  onCreate,
}: {
  open: boolean
  user: User
  now: number
  content: DemandasDemoContent
  onClose: () => void
  onCreate: (draft: TicketDraft) => void
}) {
  const f = content.form
  const today = toDateInput(now)
  const defaultTarget = sectorIds.find((s) => s !== user.sector) ?? "ti"

  return (
    <Dialog open={open} onClose={onClose} labelledBy="demo-new-title">
      <form
        className="grid"
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          onCreate({
            title: String(data.get("title")).trim(),
            description: String(data.get("description")).trim(),
            target: data.get("target") as SectorId,
            priority: data.get("priority") as Priority,
            deadline: String(data.get("deadline")),
          })
        }}
      >
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 id="demo-new-title" className="text-h3">
            {f.title}
          </h2>
          <button type="button" onClick={onClose} aria-label={f.cancel} className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
            <CloseIcon />
          </button>
        </header>
        <div className="grid gap-5 px-5 py-5 md:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="grid content-start gap-4">
            <label className={labelClass}>
              {f.subject}
              <input name="title" required maxLength={120} autoComplete="off" placeholder={f.subjectPlaceholder} className={inputClass} />
            </label>
            <label className={labelClass}>
              {f.description}
              <textarea name="description" required rows={6} placeholder={f.descriptionPlaceholder} className={inputClass} />
            </label>
          </div>
          <div className="grid content-start gap-4">
            <label className={labelClass}>
              {f.origin}
              <input name="origem" value={content.sectors[user.sector]} readOnly className={`${inputClass} text-muted-foreground`} />
            </label>
            <label className={labelClass}>
              {f.destination}
              <select name="target" defaultValue={defaultTarget} className={inputClass}>
                {sectorIds.map((s) => (
                  <option key={s} value={s}>
                    {content.sectors[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              {f.priority}
              <select name="priority" defaultValue="media" className={inputClass}>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {content.priorities[p]}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              {f.deadline}
              <input
                name="deadline"
                type="date"
                required
                min={today}
                defaultValue={toDateInput(addDays(now, 3))}
                className={inputClass}
              />
            </label>
          </div>
        </div>
        <footer className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">
          <button type="button" onClick={onClose} className={buttonVariants({ variant: "outline", size: "sm" })}>
            {f.cancel}
          </button>
          <button type="submit" className={buttonVariants({ size: "sm" })}>
            {f.submit}
          </button>
        </footer>
      </form>
    </Dialog>
  )
}

export function UsersDialog({
  open,
  state,
  content,
  onClose,
  onAdd,
  onToggleAdmin,
  onRemove,
}: {
  open: boolean
  state: DemoState
  content: DemandasDemoContent
  onClose: () => void
  onAdd: (user: Omit<User, "id">) => string
  onToggleAdmin: (id: string) => void
  onRemove: (id: string) => void
}) {
  const u = content.users
  const [created, setCreated] = useState<string | null>(null)

  return (
    <Dialog
      open={open}
      onClose={() => {
        setCreated(null)
        onClose()
      }}
      labelledBy="demo-users-title"
    >
      <div className="grid">
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="grid gap-1">
            <h2 id="demo-users-title" className="text-h3">
              {u.title}
            </h2>
            <p className="text-small text-muted-foreground">{u.intro}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={u.close} className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
            <CloseIcon />
          </button>
        </header>

        <div className="overflow-x-auto px-5 pt-4">
          <table className="w-full min-w-[34rem] border-collapse text-left text-small">
            <thead>
              <tr className="border-b border-line">
                {[u.name, u.email, u.sector, u.admin, u.actions].map((h) => (
                  <th key={h} scope="col" className="py-2 pr-3 font-mono text-meta font-normal text-subtle">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.users.map((user) => {
                const locked = isLockedUser(state, user.id)
                return (
                  <tr key={user.id} className="border-b border-line">
                    <th scope="row" className="py-2.5 pr-3 font-semibold text-foreground">
                      {user.name}
                    </th>
                    <td className="py-2.5 pr-3 text-muted-foreground">{user.email}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{content.sectors[user.sector]}</td>
                    <td className="py-2.5 pr-3">
                      {locked ? (
                        <span className="text-muted-foreground">{user.isAdmin ? u.yes : u.no}</span>
                      ) : (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={user.isAdmin}
                          aria-label={fill(user.isAdmin ? u.revokeAdmin : u.makeAdmin, { nome: user.name })}
                          onClick={() => onToggleAdmin(user.id)}
                          className={`relative h-6 w-10 rounded-full border transition-colors ${
                            user.isAdmin ? "border-brand-line bg-brand-soft" : "border-line-strong bg-surface-2"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`absolute top-0.5 size-4.5 rounded-full transition-[left] ${
                              user.isAdmin ? "left-[1.1rem] bg-brand" : "left-0.5 bg-subtle"
                            }`}
                          />
                        </button>
                      )}
                    </td>
                    <td className="py-2.5">
                      {locked ? (
                        <span className="font-mono text-meta text-subtle">{u.demoProfile}</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRemove(user.id)}
                          className="rounded-sm text-small text-danger hover:underline hover:underline-offset-4"
                        >
                          {fill(u.remove, { nome: user.name })}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <form
          className="grid gap-3 px-5 py-5 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget
            const data = new FormData(form)
            const password = onAdd({
              name: String(data.get("name")).trim(),
              email: String(data.get("email")).trim(),
              sector: data.get("sector") as SectorId,
              isAdmin: data.get("admin") === "on",
            })
            setCreated(fill(u.created, { senha: password }))
            form.reset()
          }}
        >
          <label className={labelClass}>
            {u.name}
            <input name="name" required maxLength={60} autoComplete="off" className={inputClass} />
          </label>
          <label className={labelClass}>
            {u.email}
            <input name="email" type="email" required autoComplete="off" spellCheck={false} className={inputClass} />
          </label>
          <label className={labelClass}>
            {u.sector}
            <select name="sector" defaultValue="financeiro" className={inputClass}>
              {sectorIds.map((s) => (
                <option key={s} value={s}>
                  {content.sectors[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-small text-foreground">
            <input name="admin" type="checkbox" className="size-4 accent-[var(--brand)]" />
            {u.admin}
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button type="submit" className={buttonVariants({ size: "sm" })}>
              {u.add}
            </button>
            <p role="status" className="text-small text-muted-foreground">
              {created}
            </p>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
