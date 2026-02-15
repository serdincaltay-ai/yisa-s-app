'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type PanelRole = 'owner' | 'coach' | 'parent'

const PanelRoleContext = createContext<PanelRole>('owner')

export function PanelRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<PanelRole>('owner')
  useEffect(() => {
    fetch('/api/franchise/role')
      .then((r) => r.json())
      .then((d) => { if (d?.role) setRole(d.role) })
      .catch(() => {})
  }, [])
  return (
    <PanelRoleContext.Provider value={role}>
      {children}
    </PanelRoleContext.Provider>
  )
}

export function usePanelRole() {
  return useContext(PanelRoleContext)
}
