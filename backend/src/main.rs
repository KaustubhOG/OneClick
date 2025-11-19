use axum::Router;
use tokio::net::TcpListener;
use tracing_subscriber;
use tower_http::cors::{CorsLayer, Any};

mod routes;
mod services;

use routes::youtube::youtube_routes;

async fn root() -> &'static str {
    "OneClick backend up"
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", axum::routing::get(root))
        .nest("/youtube", youtube_routes())
        .layer(cors);  // Add CORS layer

    let listener = TcpListener::bind("127.0.0.1:8000")
        .await
        .expect("Failed to bind port 8000");

    tracing::info!("🚀 Server running on http://127.0.0.1:8000");

    axum::serve(listener, app).await.unwrap();
}