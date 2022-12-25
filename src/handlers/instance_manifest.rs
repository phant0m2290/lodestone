use axum::{extract::Path, routing::get, Extension, Json, Router};

use crate::{
    traits::{t_manifest::Manifest, t_manifest::TManifest, Error, ErrorInner},
    types::InstanceUuid,
    AppState,
};

pub async fn get_instance_manifest(
    Path(uuid): Path<InstanceUuid>,
    Extension(state): Extension<AppState>,
) -> Result<Json<Manifest>, Error> {
    Ok(Json(
        state
            .instances
            .lock()
            .await
            .get(&uuid)
            .ok_or(Error {
                inner: ErrorInner::InstanceNotFound,
                detail: "".to_string(),
            })?
            .get_manifest()
            .await,
    ))
}

pub fn get_instance_manifest_routes() -> Router {
    Router::new().route("/instance/:uuid/manifest", get(get_instance_manifest))
}
