const express = require('express');
const router = express.Router();

const Course = require('../models/Course.model.js');
const CurrentAffair = require('../models/CurrentAffair.model.js');
const Update = require('../models/Update.model.js');
// Helper function to stop Google from crashing on special characters
const escapeXml = (unsafe) => {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
};

router.get('/sitemap.xml', async (req, res) => {
  try {
    const courses = await Course.find().select('slug updatedAt');
    const news = await CurrentAffair.find().select('slug updatedAt');
    const notifications = await Update.find().select('slug updatedAt');

    const baseUrl = 'https://thesamarthacademy.in';

    // Strictly NO spaces before <?xml
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    xml += `  <url><loc>${baseUrl}</loc><priority>1.0</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/courses</loc><priority>0.8</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/current-affairs</loc><priority>0.8</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/notifications</loc><priority>0.8</priority></url>\n`;

    const safeDate = (date) => date ? date.toISOString() : new Date().toISOString();

    courses.forEach(course => {
      xml += `  <url>\n`;
      // We wrap the slug in the escapeXml function!
      xml += `    <loc>${baseUrl}/courses/${escapeXml(course.slug)}</loc>\n`;
      xml += `    <lastmod>${safeDate(course.updatedAt)}</lastmod>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    news.forEach(item => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/current-affairs/${escapeXml(item.slug)}</loc>\n`;
      xml += `    <lastmod>${safeDate(item.updatedAt)}</lastmod>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    notifications.forEach(notification => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/notifications/${escapeXml(notification.slug)}</loc>\n`;
      xml += `    <lastmod>${safeDate(notification.updatedAt)}</lastmod>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += '</urlset>';

    res.set('Content-Type', 'text/xml');
    res.send(xml);
    
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;