import { writeFileSync } from 'fs';

const generateSitemap = () => {
  const baseURL = 'https://edandlinda.com'; // Replace with your actual domain
  const currentDate = new Date().toISOString();

  const urls = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/manuals', priority: '0.8', changefreq: 'monthly' },
    { url: '/map', priority: '0.7', changefreq: 'weekly' },
    { url: '/triplist', priority: '0.7', changefreq: 'weekly' },
    { url: '/education', priority: '0.6', changefreq: 'monthly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, priority, changefreq }) => `
  <url>
    <loc>${baseURL}${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('')}
</urlset>`;

  writeFileSync('./public/sitemap.xml', sitemap);
  writeFileSync('../reactapp_prod/sitemap.xml', sitemap);
  console.log('Sitemap generated successfully!', sitemap);
};

generateSitemap();