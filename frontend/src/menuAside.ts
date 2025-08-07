import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS'
  },
  {
    href: '/events/events-list',
    label: 'Events',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiCalendar' in icon ? icon['mdiCalendar' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_EVENTS'
  },
  {
    href: '/newsletters/newsletters-list',
    label: 'Newsletters',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiEmail' in icon ? icon['mdiEmail' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_NEWSLETTERS'
  },
  {
    href: '/subscriptions/subscriptions-list',
    label: 'Subscriptions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiCreditCard' in icon ? icon['mdiCreditCard' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_SUBSCRIPTIONS'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

 {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS'
  },
]

export default menuAside
