#!/bin/sh
npx expo export --platform web
mv dist/index.html dist/app.html
cp landing/index.html dist/index.html
cp landing/styles.css dist/styles.css
cp landing/robots.txt dist/robots.txt
cp landing/sitemap.xml dist/sitemap.xml
cp landing/favicon.svg dist/favicon.svg
cp landing/og-image.png dist/og-image.png 2>/dev/null || true
