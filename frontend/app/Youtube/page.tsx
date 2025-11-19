"use client"
import { useState } from 'react';
import { Download, Info, Loader2, Video, Music } from 'lucide-react';

export default function Youtube_home_page() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const fetchVideoInfo = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const response = await fetch('http://localhost:8000/youtube/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.title && data.title.startsWith('Error:')) {
        setError(data.title);
      } else {
        setVideoInfo(data);
      }
    } catch (err) {
      setError('Failed to fetch video info. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = async () => {
    setDownloading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/youtube/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Download failed');
        setDownloading(false);
        return;
      }

      // Get the video blob
      const blob = await response.blob();
      
      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${videoInfo?.title || 'video'}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      setError('');
    } catch (err) {
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video className="w-12 h-12 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">YouTube Downloader</h1>
          </div>
          <p className="text-gray-600">Download your favorite YouTube videos with audio</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* URL Input Section */}
          <div className="mb-6">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Video URL
            </label>
            <div className="flex gap-3">
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchVideoInfo()}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              />
              <button
                onClick={fetchVideoInfo}
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2 font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Info className="w-5 h-5" />
                    Get Info
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Video Info Display */}
          {videoInfo && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Information</h3>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Title</p>
                    <p className="text-gray-900 font-medium">{videoInfo.title}</p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Channel</p>
                      <p className="text-gray-900">{videoInfo.channel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="text-gray-900">{formatDuration(videoInfo.duration)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={downloadVideo}
                disabled={downloading}
                className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-3 font-semibold text-lg"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    Download Video
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Video className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">High Quality</h3>
            <p className="text-sm text-gray-600">Best available video quality</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Music className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">With Audio</h3>
            <p className="text-sm text-gray-600">Video + audio merged</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Download className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Fast Download</h3>
            <p className="text-sm text-gray-600">Quick and reliable</p>
          </div>
        </div>
      </div>
    </div>
  );
}