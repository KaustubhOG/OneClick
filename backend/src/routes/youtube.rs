use axum::{
    Json, Router,
    routing::{get, post},
    response::IntoResponse,
    http::{HeaderMap, HeaderValue, StatusCode}
};
use serde::{Deserialize, Serialize};
use tokio::fs::File;
use tokio::io::AsyncReadExt;
use std::path::PathBuf;

use crate::services::youtube_service;

// ------------------------------
// Base route
// ------------------------------
async fn youtube_root() -> &'static str {
    "YouTube API working"
}

// ------------------------------
// /info request + response types
// ------------------------------
#[derive(Deserialize)]
pub struct InfoRequest {
    url: String,
}

#[derive(Serialize)]
pub struct InfoResponse {
    title: String,
    channel: String,
    duration: u32,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    error: String,
}

async fn get_info(Json(body): Json<InfoRequest>) -> impl IntoResponse {
    match youtube_service::fetch_info(&body.url).await {
        Ok(info) => (
            StatusCode::OK,
            Json(InfoResponse {
                title: info.title,
                channel: info.channel,
                duration: info.duration,
            })
        ),
        Err(e) => (
            StatusCode::BAD_REQUEST,
            Json(InfoResponse {
                title: format!("Error: {}", e),
                channel: String::new(),
                duration: 0,
            })
        )
    }
}

// ------------------------------
// /download types
// ------------------------------
#[derive(Deserialize)]
pub struct DownloadRequest {
    url: String,
    quality: Option<String>,
}

// ------------------------------
// REAL file download route
// ------------------------------
async fn download(Json(body): Json<DownloadRequest>) -> impl IntoResponse {
    // Download the video
    let file_path = match youtube_service::download_video(&body.url, body.quality.as_deref()).await {
        Ok(path) => path,
        Err(e) => {
            let mut headers = HeaderMap::new();
            headers.insert("Content-Type", HeaderValue::from_static("application/json"));
            let error_body = format!(r#"{{"error":"{}"}}"#, e);
            return (StatusCode::BAD_REQUEST, headers, error_body.into_bytes());
        }
    };

    // Read the file
    let mut file = match File::open(&file_path).await {
        Ok(f) => f,
        Err(e) => {
            let mut headers = HeaderMap::new();
            headers.insert("Content-Type", HeaderValue::from_static("application/json"));
            let error_body = format!(r#"{{"error":"Failed to open file: {}"}}"#, e);
            return (StatusCode::INTERNAL_SERVER_ERROR, headers, error_body.into_bytes());
        }
    };

    let mut buffer = Vec::new();
    if let Err(e) = file.read_to_end(&mut buffer).await {
        let mut headers = HeaderMap::new();
        headers.insert("Content-Type", HeaderValue::from_static("application/json"));
        let error_body = format!(r#"{{"error":"Failed to read file: {}"}}"#, e);
        return (StatusCode::INTERNAL_SERVER_ERROR, headers, error_body.into_bytes());
    }

    // Clean up the file after reading
    let _ = tokio::fs::remove_file(&file_path).await;

    // Return the file
    let mut headers = HeaderMap::new();
    headers.insert("Content-Type", HeaderValue::from_static("video/mp4"));
    headers.insert(
        "Content-Disposition",
        HeaderValue::from_static("attachment; filename=\"video.mp4\"")
    );

    (StatusCode::OK, headers, buffer)
}

// ------------------------------
// Router
// ------------------------------
pub fn youtube_routes() -> Router {
    Router::new()
        .route("/", get(youtube_root))
        .route("/info", post(get_info))
        .route("/download", post(download))
}