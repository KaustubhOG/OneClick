use axum::Router;
use tokio::net::TcpListener;
use tracing_subscriber;

mod routes;
mod services;  // Add this line!

use routes::youtube::youtube_routes;

async fn root() -> &'static str {
    "OneClick backend up"
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/", axum::routing::get(root))
        .nest("/youtube", youtube_routes());

    let listener = TcpListener::bind("127.0.0.1:8000")
        .await
        .expect("Failed to bind port 8000");

    tracing::info!("🚀 Server running on http://127.0.0.1:8000");

    axum::serve(listener, app).await.unwrap();
}