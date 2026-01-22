import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://tapos360.com',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://tapos360.com/login',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://tapos360.com/shop',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: 'https://tapos360.com/privacy',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: 'https://tapos360.com/terms',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        // We could dynamically fetch cards here too, but for now base pages are good.
    ];
}
