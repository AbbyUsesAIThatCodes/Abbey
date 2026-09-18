extends SceneTree

var failures:=0

func check(condition: bool, message: String) -> void:
	if not condition:
		failures+=1
		printerr("UI CHECK FAILED: ",message)

func _initialize() -> void:
	call_deferred("run")

func run() -> void:
	var game=load("res://main.tscn").instantiate()
	root.add_child(game)
	game.paused=true
	await process_frame
	await process_frame
	game.layout_ui()
	await process_frame
	check(game.inspector.get_global_rect().end.y<=game.footer.position.y,"Inspector overlaps footer")
	check(game.build_button.get_global_rect().end.y<game.footer.position.y,"Construction button is hidden")
	var initial:String=game.sim.digest()
	game.set_floor(-1)
	check(game.people.floor_level==-1 and game.terrain.floor_level==-1,"Cellar visibility")
	game.set_floor(1)
	check(game.people.floor_level==1,"Upper-floor visibility")
	game.set_floor(0)
	check(initial==game.sim.digest(),"Changing floors changed simulation state")
	game.follow_button.grab_focus()
	var pause_key:=InputEventKey.new()
	pause_key.physical_keycode=KEY_SPACE
	pause_key.keycode=KEY_SPACE
	pause_key.pressed=true
	root.push_input(pause_key)
	check(not game.paused and not game.following,"Space must pause even when a button has focus")
	game.paused=true
	game.select_person(3)
	check(game.name_label.text=="Brother Thomas","Person selection")
	game.duty_picker.item_selected.emit(0)
	check(game.sim.inspect_person(3).duty_id==0,"Duty command did not reach native core")
	game.duty_picker.item_selected.emit(2)
	game.follow_button.pressed.emit()
	check(game.following,"Follow control")
	game.reset_camera()
	check(not game.following,"Home must release camera follow")
	game.roof_button.pressed.emit()
	check(game.roofs.show_roofs,"Roof toggle")
	game.roof_button.pressed.emit()
	game.build_button.pressed.emit()
	check(game.sim.summary().commissioned,"Construction command")
	var saved:String=game.sim.digest()
	var path:=ProjectSettings.globalize_path("user://ui-test.save")
	check(game.sim.save_game(path).is_empty(),"Save through bridge")
	game.sim.advance(400)
	check(game.sim.load_game(path).is_empty(),"Load through bridge")
	check(game.sim.digest()==saved,"UI snapshot failed to restore")
	game.refresh_world()
	game.change_zoom(10)
	check(is_equal_approx(game.camera.zoom.x,2.2),"Upper zoom bound")
	game.change_zoom(0.01)
	check(is_equal_approx(game.camera.zoom.x,0.45),"Lower zoom bound")
	game.reset_camera()
	var p:Dictionary=game.sim.inspect_person(3)
	var point:Vector2=preload("res://scripts/world.gd").iso(p.x,p.y,p.floor)
	check(game.people.pick(point)>=0,"Visible character picking")
	game.select_person(80)
	check(game.duty_picker.disabled,"Villager duty must not be player-controlled")
	game.select_person(3)
	check(not game.duty_picker.disabled,"Monk duty must remain assignable")
	var release:=InputEventMouseButton.new()
	release.button_index=MOUSE_BUTTON_RIGHT
	release.pressed=false
	game.dragging=true
	game._input(release)
	check(not game.dragging,"Mouse release over UI must stop dragging")
	DirAccess.remove_absolute(path)
	DirAccess.remove_absolute(path+".bak")
	game.queue_free()
	await process_frame
	if failures==0:print("PASS: UI layout, floors, selection, commands, follow, roofs, save/load, zoom, picking and panning")
	quit(0 if failures==0 else 1)
