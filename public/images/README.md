# Images Folder

Place your images in this folder. They will be served from `/images/filename.ext`.

## Structure Example
```
images/
├── logo.png
├── hero/
│   └── background.jpg
├── portfolio/
│   ├── project-1.jpg
│   └── project-2.jpg
└── avatars/
    └── profile.jpg
```

## Usage
```html
<img src="/images/logo.png" alt="Logo" />
```

## CDN Usage
After setting up Cloudflare CDN:
```html
<img src="https://cdn.yourdomain.com/images/logo.png" alt="Logo" />
```
