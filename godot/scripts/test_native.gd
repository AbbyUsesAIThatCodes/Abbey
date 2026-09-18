extends SceneTree

func _initialize() -> void:
	if not ClassDB.class_exists("AbbeySimulation"):
		push_error("Native simulation not registered")
		quit(1)
		return
	var a: Object=ClassDB.instantiate("AbbeySimulation")
	var b: Object=ClassDB.instantiate("AbbeySimulation")
	assert(a.reset(500,1135))
	assert(not a.reset(-1,0))
	assert(a.positions().size()==3000)
	assert(a.inspect_person(-1).is_empty())
	assert(a.commission_bay())
	a.advance(451)
	var path:=OS.get_environment("ABBEY_TEST_SAVE")
	if path.is_empty():path=ProjectSettings.globalize_path("user://native-integration-test.save")
	assert(a.save_game(path).is_empty())
	assert(b.load_game(path).is_empty())
	assert(a.digest()==b.digest())
	for i in range(100):
		a.advance(10)
		b.advance(10)
	assert(a.digest()==b.digest())
	assert(a.assign_duty(0,2))
	assert(not a.assign_duty(99999,2))
	assert(a.summary().population==500)
	print("PASS: GDExtension registration, packed positions, commands, save and continuation")
	quit()
