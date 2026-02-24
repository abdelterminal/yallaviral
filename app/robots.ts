import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/admin/'],
        },
        sitemap: 'https://yallaviral.com/sitemap.xml',
    }
}
