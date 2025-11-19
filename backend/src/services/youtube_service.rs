use serde::{Deserialize, Serialize};
use tokio::process::Command;
use std::path::PathBuf;
use uuid::Uuid;

#[derive(Serialize)]
pub struct YouTubeInfo {
    pub title: String,
    pub channel: String,
    pub duration: u32,
}

pub async fn fetch_info(url: &str) -> Result<YouTubeInfo, String> {
    // Validate URL
    if !url.contains("youtube.com") && !url.contains("youtu.be") {
        return Err("Invalid YouTube URL".to_string());
    }

    let output = Command::new("yt-dlp")
        .arg("--dump-json")
        .arg(url)
        .output()
        .await
        .map_err(|e| format!("Failed to execute yt-dlp: {}", e))?;

    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        return Err(format!("yt-dlp error: {}", error));
    }

    let json_str = String::from_utf8_lossy(&output.stdout);

    #[derive(Deserialize)]
    struct YtDlpJson {
        title: String,
        uploader: String,
        duration: f64,
    }

    let parsed: YtDlpJson = serde_json::from_str(&json_str)
        .map_err(|e| format!("Failed to parse JSON: {}", e))?;

    Ok(YouTubeInfo {
        title: parsed.title,
        channel: parsed.uploader,
        duration: parsed.duration as u32,
    })
}

pub async fn download_video(url: &str, quality: Option<&str>) -> Result<PathBuf, String> {
    // Validate URL
    if !url.contains("youtube.com") && !url.contains("youtu.be") {
        return Err("Invalid YouTube URL".to_string());
    }

    // Create unique filename to avoid conflicts
    let unique_id = Uuid::new_v4();
    let output_template = format!("tmp/{}.%(ext)s", unique_id);
    
    let mut cmd = Command::new("yt-dlp");
    cmd.arg("-o").arg(&output_template);
    
    // Format selection - ensures both video and audio are included
    if let Some(q) = quality {
        cmd.arg("-f").arg(format!("{}+bestaudio/best", q));
    } else {
        cmd.arg("-f").arg("bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best");
    }
    
    // Merge into single file
    cmd.arg("--merge-output-format").arg("mp4");
    
    // Add progress and error output
    cmd.arg("--newline");
    
    cmd.arg(url);
    
    let output = cmd.output()
        .await
        .map_err(|e| format!("Failed to execute yt-dlp: {}", e))?;
    
    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Download failed: {}", error));
    }
    
    // The output file will be tmp/{unique_id}.mp4
    let file_path = PathBuf::from(format!("tmp/{}.mp4", unique_id));
    
    if file_path.exists() {
        Ok(file_path)
    } else {
        Err("Download completed but file not found".to_string())
    }
}