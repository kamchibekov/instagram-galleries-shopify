import React, { useState, useCallback } from 'react'
import { TopBar } from '@shopify/polaris'
import { LogOutMinor } from '@shopify/polaris-icons'

export default function Navigation(shop) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    [],
  )

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [{ content: 'Log Out', icon: LogOutMinor, url: '/logout' }],
        },
      ]}
      name={shop.name}
      detail={shop.url}
      initials={shop.name[0]}
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  )

  return <TopBar userMenu={userMenuMarkup} />
}
