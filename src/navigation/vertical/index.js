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
      path: '/review'
    },
    {
      title: 'Team',
      icon: 'tabler:calendar',
      path: '/teams'
    },
    {
      title: 'Properties',
      icon: 'tabler:calendar',
      path: '/properties'
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
          path: '/'
        },
        {
          title: 'Hoe Is Works',
          path: '/'
        },
        {
          title: 'About Counter',
          path: '/'
        },
        {
          title: 'Contact Us',
          path: '/'
        },
        {
          title: 'Company Settings',
          path: '/'
        },
        {
          title: 'Banner',
          path: '/'
        }
      ]
    }
  ]
}

export default navigation
