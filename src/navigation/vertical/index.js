const navigation = () => {
  return [
    {
      title: 'Customers',
      icon: 'tabler:mail',
      path: '/customers'
    },
    {
      title: 'Brokers',
      icon: 'tabler:messages',
      path: '/brokers'
    },
    {
      title: 'Financial Advisor',
      icon: 'tabler:messages',
      path: '/financial-advisor'
    },
    {
      title: 'Contact Inquiries',
      icon: 'tabler:messages',
      path: '/contact-inquiry'
    },
    {
      sectionTitle: 'Master Data'
    },
    {
      title: 'Category',
      icon: 'tabler:mail',
      path: '/category'
    },
    {
      title: 'Review',
      icon: 'tabler:messages',
      path: '/apps/chat'
    },
    {
      title: 'Team',
      icon: 'tabler:calendar',
      path: '/apps/calendar'
    },
    {
      title: 'Properties',
      icon: 'tabler:calendar',
      path: '/apps/calendar'
    },
    {
      sectionTitle: 'Apps & Pages'
    },
    {
      title: 'Page Settings',
      icon: 'tabler:id',
      children: [
        {
          title: 'About Us',
          path: '/ui/cards/basic'
        },
        {
          title: 'Hoe Is Works',
          path: '/ui/cards/advanced'
        },
        {
          title: 'About Counter',
          path: '/ui/cards/statistics'
        },
        {
          title: 'Contact Us',
          path: '/ui/cards/widgets'
        },
        {
          title: 'Company Settings',
          path: '/ui/cards/actions'
        },
        {
          title: 'Banner',
          path: '/ui/cards/actions'
        }
      ]
    }
  ]
}

export default navigation
