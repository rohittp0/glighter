# Setup Instructions

## ⚠️ IMPORTANT: Add Your MapTiler API Key

Before you can run the application, you need to configure your MapTiler API key:

1. **Get a MapTiler API Key**
   - Go to [https://www.maptiler.com/](https://www.maptiler.com/)
   - Sign up for a free account
   - Navigate to your account dashboard
   - Copy your API key

2. **Configure the API Key**
   - Open the `.env.local` file in the project root
   - Replace `your_api_key_here` with your actual MapTiler API key:
     ```
     VITE_MAPTILER_API_KEY=your_actual_maptiler_api_key
     ```

3. **Start the Application**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - Navigate to [http://localhost:5173](http://localhost:5173)

## Troubleshooting

- **Map doesn't load**: Make sure your MapTiler API key is correctly set in `.env.local`
- **Geocoding fails**: Check your internet connection and API key validity
- **Video export not working**: Ensure you're using a modern browser that supports MediaRecorder API (Chrome, Firefox, or Safari 14.1+)

## What Works Without API Key

Nothing - the map requires a valid MapTiler API key to function.

## Next Steps

After setup:
1. Click the map to add location markers
2. Add at least 2 locations
3. Click "Next: Preview Animation"
4. Click "Play" to see the animation
5. Click "Export Video" to download the animation as a `.webm` file
