use axum::{routing::get, Router};
use tokio::net::TcpListener;
use tracing_subscriber;

async fn root() -> &'static str {
    "OneClick backend up"
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    // Build router
    let app = Router::new().route("/", get(root));

    // Bind TCP listener
    let listener = TcpListener::bind("127.0.0.1:8000")
        .await
        .expect("Failed to bind port 8000");

    tracing::info!(" Server running on http://127.0.0.1:8000");

    // Start server
    axum::serve(listener, app).await.unwrap();
}
