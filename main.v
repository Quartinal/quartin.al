module main

import veb
import os

pub struct Context {
	veb.Context
}

pub struct App {
	veb.StaticHandler
}

fn serve_static() {
	os.chdir(os.dir(os.executable())) or { panic(err) }

	mut app := &App{}

	app.static_mime_types['.glb'] = 'model/gltf-binary'
	app.handle_static('dist', true) or { panic(err) }

	veb.run[App, Context](mut app, 8080)
}

fn main() {
	serve_static()
}