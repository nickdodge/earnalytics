# Earnalytics Dashboard

A modern dashboard for tracking creator income across multiple platforms.

## Features

- Track income from multiple platforms (YouTube, Twitch, TikTok)
- Visualize earnings with interactive charts
- Secure authentication with Clerk
- Dark mode support
- Responsive design

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Clerk publishable key:
   ```
   REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Production Deployment

### Vercel Deployment

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Configure the following environment variables in Vercel:
   - `REACT_APP_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

### Custom Domain Setup (earnalytics.app)

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain: `earnalytics.app`
3. Follow Vercel's instructions to configure your DNS settings:
   - Add an A record pointing to Vercel's IP addresses
   - Add a CNAME record for www subdomain
4. Enable SSL/TLS certificates (Vercel handles this automatically)

### Environment Variables

For production, ensure these environment variables are set in Vercel:
- `REACT_APP_CLERK_PUBLISHABLE_KEY`: Your production Clerk publishable key

## Build Process

To create a production build:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Security

- Never commit `.env` files to version control
- Use environment variables for sensitive data
- Keep your Clerk publishable key secure

## License

MIT
