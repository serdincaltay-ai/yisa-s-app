'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type PanelRole = 'owner' | 'coach' | 'parent'

type PanelRoleState = { role: PanelRole; canAccessKasa: boolean }

const PanelRoleContext = createContext<PanelRoleState>({ role: 'owner', canAccessKasa: true })

export function PanelRoleProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PanelRoleState>({ role: 'owner', canAccessKasa: true })
  useEffect(() => {
    fetch('/api/franchise/role')
      .then((r) => r.json())
      .then((d) => {
        if (d?.role) setState({ role: d.role, canAccessKasa: d.canAccessKasa !== false })
      })
      .catch(() => {})
  }, [])
  return (
    <PanelRoleContext.Provider value={state}>
      {children}
    </PanelRoleContext.Provider>
  )
}

export function usePanelRole(): PanelRole {
  const { role } = useContext(PanelRoleContext)
  return role
}

export function usePanelRoleState() {
  return useContext(PanelRoleContext)
}
