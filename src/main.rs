

#[macro_use] extern crate rocket;

use std::io::BufRead;
use std::sync::{Mutex, Arc};
use std::thread;
use std::time::Duration;

use instance::ServerInstance;
use rocket::{response::content, request::FromRequest, request::Request};
use rocket::{State, request};
use serde::{Serialize, Deserialize};
use serde_json::{Value};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::path::Path;
mod instance;
mod util;


struct HitCount {
    count: AtomicUsize
}

struct MyManagedState {
    server : Arc<Mutex<ServerInstance>>
}

#[get("/versions/<rtype>")]
async fn versions(rtype: String) -> content::Json<String> {
    let response: Response = serde_json::from_str(minreq::get("https://launchermeta.mojang.com/mc/game/version_manifest.json")
    .send().unwrap().as_str().unwrap()).unwrap();
    let mut r = Vec::new();
    for version in response.versions {
        if version.r#type == rtype {
            r.push(version.id);
        }
    }
    content::Json(serde_json::to_string(&r).unwrap())
}

fn get_version_url(version: String) -> Option<String> {
    let response: Response = serde_json::from_str(minreq::get("https://launchermeta.mojang.com/mc/game/version_manifest.json")
    .send().unwrap().as_str().unwrap()).unwrap();
    for version_indiv in response.versions {
        if version_indiv.id == version {
           let response : Value = serde_json::from_str(minreq::get(version_indiv.url).send().unwrap().as_str().unwrap()).unwrap();
           return Some(response["downloads"]["server"]["url"].to_string().replace("\"", ""));
        }
    }
    None
}

#[get("/setup/<instance_name>/<version>")]
async fn setup(instance_name : String, version : String) -> String {
    let path = format!("/home/peter/Lodestone/backend/test/{}", instance_name); // TODO: Add a global path string
    if Path::new(path.as_str()).is_dir() {
        return "instance already exists".to_string()
    }
    std::fs::create_dir(path.as_str()).unwrap();

    match get_version_url(version) {
        Some(url) => {
            println!("{}",url);
            util::download_file(url.as_str(), format!("{}/server.jar", path).as_str()).await.unwrap();

            format!("downloaded to {}", path)
        }
        None => "version not found".to_string()
    }
}

// #[get("/count")]
// async fn test(hit_count: &State<HitCount>) -> String {
//     let current_count = hit_count.count.load(Ordering::Relaxed);
//     hit_count.count.store(current_count + 1, Ordering::Relaxed);
//     format!("Number of visits: {}", current_count)
// }

#[get("/start")]
async fn start(state: &State<MyManagedState>) -> String {
    let server = state.server.clone();
    if server.lock().unwrap().running {
       return "already running".to_string();
    }
    let mut instance = server.lock().unwrap();
    instance.start().unwrap();
    "server starting".to_string()
    // let server_test_mutex = ServerInstance::new(None);
    // let mut server = server_test_mutex.lock().unwrap();
    // server.start().unwrap();
    // server.stdout.as_ref().unwrap().lock().unwrap();
    // for rec in  {
    //     println!("Server said: {}", rec);
    // }
}

#[get("/stop")]
fn stop(state: &State<MyManagedState>) -> String {
    let server = state.server.clone();
    if !server.lock().unwrap().running {
        return "already stopped".to_string();
    }
    let mut instance = server.lock().unwrap();
    instance.stop().unwrap();
    "server stopped".to_string()
    
}

#[get("/send/<command>")]
fn send(command: String, state: &State<MyManagedState>) -> String {
    let server = state.server.clone();
    if !server.lock().unwrap().running {
        return "sever not started".to_string();
    }
    let instance = server.lock().unwrap();
    instance.stdin.clone().unwrap().send(format!("{}\n", command.clone())).unwrap();
    format!("sent command: {}", command)
}

#[derive(Deserialize, Serialize)]
#[allow(non_snake_case)]
struct Version {
    id: String,
    r#type: String, // bruh
    url: String,
    time: String,
    releaseTime: String,
}

#[derive(Deserialize, Serialize)]
struct Response {
    versions: Vec<Version>,
}

#[launch]
fn rocket() -> _ {

    rocket::build().mount("/", routes![start, stop, send, setup]).manage(MyManagedState{server : Arc::new(Mutex::new(ServerInstance::new(None)))})

}