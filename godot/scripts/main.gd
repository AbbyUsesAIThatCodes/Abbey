extends Node2D

const WorldView = preload("res://scripts/world.gd")
const PeopleView = preload("res://scripts/people.gd")
const GOLD = Color("d0b478")
const INK = Color("283b32")
const CREAM = Color("efe5c9")
const SAVE_PATH = "user://abbey.save"
var sim: Object
var terrain: Node2D
var roofs: Node2D
var people: Node2D
var camera: Camera2D
var hud: Control
var inspector: PanelContainer
var header: PanelContainer
var footer: PanelContainer
var chronicle_panel: PanelContainer
var time_label: Label
var resource_label: Label
var phase_label: Label
var name_label: Label
var detail_label: Label
var activity_label: Label
var reason_label: Label
var history_label: Label
var needs_label: Label
var feedback_label: Label
var chronicle_label: Label
var duty_picker: OptionButton
var population_picker: OptionButton
var floor_picker: OptionButton
var build_button: Button
var follow_button: Button
var pause_button: Button
var roof_button: Button
var bell: AudioStreamPlayer
var title_font := SystemFont.new()
var tick_bank:=0.0
var speed:=1
var paused:=false
var selected:=0
var following:=false
var dragging:=false
var floor_level:=0
var ui_clock:=0.0
var autosave_clock:=0.0
var last_office:=""
var frame_count:=0
var capture_path:=""
var capture_frame:=60
var quit_frame:=-1

func _ready() -> void:
	title_font.font_names=PackedStringArray(["Georgia","DejaVu Serif","serif"])
	get_tree().auto_accept_quit=false
	if not ClassDB.class_exists("AbbeySimulation"):
		var error:=Label.new()
		error.text="Abbey’s native simulation could not load.\nBuild the C++ extension using the README, then reopen this project."
		error.position=Vector2(60,80)
		error.add_theme_font_size_override("font_size",22)
		add_child(error)
		push_error("AbbeySimulation GDExtension is missing")
		return
	sim=ClassDB.instantiate("AbbeySimulation")
	var population:=96
	var fresh:=false
	var start_at_vespers:=false
	var args:=OS.get_cmdline_user_args()
	for i in range(args.size()):
		if args[i].begins_with("--population="):population=int(args[i].get_slice("=",1))
		if args[i].begins_with("--capture="):capture_path=args[i].trim_prefix("--capture=")
		if args[i].begins_with("--capture-frame="):capture_frame=int(args[i].get_slice("=",1))
		if args[i].begins_with("--quit-frame="):quit_frame=int(args[i].get_slice("=",1))
		if args[i].begins_with("--floor="):floor_level=clampi(int(args[i].get_slice("=",1)),-1,1)
		if args[i]=="--vespers":start_at_vespers=true
		if args[i]=="--fresh":fresh=true
	if population!=96:sim.reset(clampi(population,8,10000),1135)
	var restore_error:=""
	if args.is_empty() and not fresh and FileAccess.file_exists("user://abbey-autosave.save"):
		restore_error=sim.load_game(ProjectSettings.globalize_path("user://abbey-autosave.save"))
	if start_at_vespers:sim.advance(420)
	terrain=WorldView.new()
	add_child(terrain)
	people=PeopleView.new()
	add_child(people)
	roofs=WorldView.new()
	roofs.roof_only=true
	add_child(roofs)
	camera=Camera2D.new()
	camera.position=Vector2(150,560)
	camera.zoom=Vector2(0.97,0.97)
	add_child(camera)
	bell=AudioStreamPlayer.new()
	bell.stream=preload("res://assets/bell.wav")
	bell.volume_db=-12
	add_child(bell)
	create_ui()
	set_floor(floor_level)
	get_viewport().size_changed.connect(layout_ui)
	layout_ui()
	refresh_world()
	refresh_ui()
	feedback("Welcome to Abbey. Click a person to follow their day." if restore_error.is_empty() else "Could not resume the autosave: "+restore_error)

func panel(bg: Color=Color("183a30"), border: Color=GOLD) -> StyleBoxFlat:
	var s:=StyleBoxFlat.new()
	s.bg_color=bg
	s.border_color=border
	s.set_border_width_all(1)
	s.set_corner_radius_all(7)
	s.content_margin_left=18
	s.content_margin_right=18
	s.content_margin_top=14
	s.content_margin_bottom=14
	s.shadow_color=Color(0.04,0.09,0.07,0.35)
	s.shadow_size=8
	return s

func label(text: String, size: int=16, color: Color=CREAM, serif: bool=false) -> Label:
	var l:=Label.new()
	l.text=text
	l.add_theme_color_override("font_color",color)
	l.add_theme_font_size_override("font_size",size)
	if serif:l.add_theme_font_override("font",title_font)
	return l

func button(text: String, action: Callable) -> Button:
	var b:=Button.new()
	b.text=text
	b.custom_minimum_size=Vector2(0,36)
	b.add_theme_font_size_override("font_size",14)
	b.add_theme_color_override("font_color",CREAM)
	b.add_theme_color_override("font_hover_color",Color.WHITE)
	var style:=panel(Color("285044"),Color("967f52"))
	style.content_margin_left=10
	style.content_margin_right=10
	style.content_margin_top=6
	style.content_margin_bottom=6
	b.add_theme_stylebox_override("normal",style)
	var hover:=style.duplicate()
	hover.bg_color=Color("3b6552")
	b.add_theme_stylebox_override("hover",hover)
	var pressed:=style.duplicate()
	pressed.bg_color=Color("645237")
	b.add_theme_stylebox_override("pressed",pressed)
	b.pressed.connect(action)
	return b

func option(items: Array) -> OptionButton:
	var o:=OptionButton.new()
	for item in items:o.add_item(str(item))
	o.custom_minimum_size.y=36
	o.add_theme_font_size_override("font_size",14)
	o.add_theme_color_override("font_color",CREAM)
	var style:=panel(Color("285044"),Color("967f52"))
	style.content_margin_top=7
	style.content_margin_bottom=7
	o.add_theme_stylebox_override("normal",style)
	return o

func create_ui() -> void:
	var canvas:=CanvasLayer.new()
	add_child(canvas)
	hud=Control.new()
	hud.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	hud.mouse_filter=Control.MOUSE_FILTER_IGNORE
	canvas.add_child(hud)
	header=PanelContainer.new()
	header.add_theme_stylebox_override("panel",panel())
	hud.add_child(header)
	var row:=HBoxContainer.new()
	row.add_theme_constant_override("separation",18)
	header.add_child(row)
	var crest:=TextureRect.new()
	crest.texture=preload("res://assets/crest.svg")
	crest.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
	crest.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	crest.custom_minimum_size=Vector2(47,58)
	row.add_child(crest)
	var branding:=VBoxContainer.new()
	branding.custom_minimum_size.x=195
	row.add_child(branding)
	branding.add_child(label("ABBEY",31,GOLD,true))
	branding.add_child(label("LIVING FOUNDATIONS  ·  0.0.2",10,Color("b1c2a5")))
	var clock:=VBoxContainer.new()
	clock.custom_minimum_size.x=245
	row.add_child(clock)
	time_label=label("Day 1 · Early autumn",18,CREAM,true)
	clock.add_child(time_label)
	phase_label=label("Vespers approaches",13,Color("cbd0b5"))
	clock.add_child(phase_label)
	resource_label=label("",16)
	resource_label.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	resource_label.vertical_alignment=VERTICAL_ALIGNMENT_CENTER
	row.add_child(resource_label)
	pause_button=button("Ⅱ",toggle_pause)
	pause_button.tooltip_text="Pause / resume · Space"
	row.add_child(pause_button)
	for rate in [1,2,4]:
		var b:=button("%d×"%rate,func() -> void: speed=rate; paused=false; refresh_ui())
		row.add_child(b)
	# Character inspection lives on an opaque parchment surface.
	inspector=PanelContainer.new()
	inspector.add_theme_stylebox_override("panel",panel(CREAM,Color("b2955e")))
	hud.add_child(inspector)
	var inspector_stack:=VBoxContainer.new()
	inspector.add_child(inspector_stack)
	var scroll:=ScrollContainer.new()
	scroll.size_flags_vertical=Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED
	inspector_stack.add_child(scroll)
	var iv:=VBoxContainer.new()
	iv.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	iv.add_theme_constant_override("separation",6)
	scroll.add_child(iv)
	var person_nav:=HBoxContainer.new()
	iv.add_child(person_nav)
	var community:=label("THE COMMUNITY",12,Color("63715b"))
	community.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	person_nav.add_child(community)
	person_nav.add_child(button("‹",func() -> void: select_person(posmod(selected-1,int(sim.summary().population)))))
	person_nav.add_child(button("›",func() -> void: select_person(posmod(selected+1,int(sim.summary().population)))))
	var portrait:=TextureRect.new()
	portrait.texture=preload("res://assets/portrait.svg")
	portrait.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
	portrait.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	portrait.custom_minimum_size=Vector2(0,72)
	portrait.tooltip_text="Shared prototype portrait; individual portraits are planned."
	iv.add_child(portrait)
	name_label=label("Brother Anselm",25,INK,true)
	name_label.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	iv.add_child(name_label)
	detail_label=label("",13,Color("6d725c"))
	iv.add_child(detail_label)
	activity_label=label("",19,Color("4e694d"),true)
	iv.add_child(activity_label)
	reason_label=label("",14,INK)
	reason_label.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	reason_label.custom_minimum_size.y=60
	iv.add_child(reason_label)
	needs_label=label("",14,INK)
	iv.add_child(needs_label)
	history_label=label("",13,Color("66715d"))
	iv.add_child(history_label)
	iv.add_child(HSeparator.new())
	iv.add_child(label("Assigned work",13,INK))
	duty_picker=option(["Gardening","Provisioning","Masonry","Stewardship","Letters","Trading"])
	duty_picker.item_selected.connect(func(index: int) -> void:
		if sim.assign_duty(selected,index):feedback("Duty changed. Scheduled prayer and rest remain protected.")
		refresh_ui())
	iv.add_child(duty_picker)
	follow_button=button("Follow this person",func() -> void: following=not following;refresh_ui())
	iv.add_child(follow_button)
	build_button=button("Commission chapel bay",commission)
	inspector_stack.add_child(build_button)
	inspector_stack.add_child(label("40 stone · 20 timber · 30 coin",12,Color("787558")))
	# View controls sit at the upper left of the world.
	var tools:=HBoxContainer.new()
	tools.position=Vector2(24,124)
	tools.add_theme_constant_override("separation",8)
	hud.add_child(tools)
	floor_picker=option(["Cellar", "Ground", "Upper rooms"])
	floor_picker.select(floor_level+1)
	floor_picker.item_selected.connect(func(index: int) -> void: set_floor(index-1))
	tools.add_child(floor_picker)
	roof_button=button("Show roofs",func() -> void:
		roofs.show_roofs=not roofs.show_roofs
		roof_button.text="Reveal interiors" if roofs.show_roofs else "Show roofs"
		roofs.queue_redraw())
	tools.add_child(roof_button)
	tools.add_child(button("−",func() -> void: change_zoom(0.87)))
	tools.add_child(button("+",func() -> void: change_zoom(1.15)))
	tools.add_child(button("Home",reset_camera))
	# Chronicle can be opened without blocking the settlement.
	chronicle_panel=PanelContainer.new()
	chronicle_panel.add_theme_stylebox_override("panel",panel())
	chronicle_panel.visible=false
	hud.add_child(chronicle_panel)
	var cv:=VBoxContainer.new()
	chronicle_panel.add_child(cv)
	cv.add_child(label("The abbey chronicle",23,GOLD,true))
	chronicle_label=label("",14)
	chronicle_label.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	cv.add_child(chronicle_label)
	footer=PanelContainer.new()
	footer.add_theme_stylebox_override("panel",panel())
	hud.add_child(footer)
	var fv:=VBoxContainer.new()
	fv.add_theme_constant_override("separation",10)
	footer.add_child(fv)
	var controls:=HBoxContainer.new()
	controls.add_theme_constant_override("separation",8)
	fv.add_child(controls)
	population_picker=option(["Founders · 8", "Village · 96", "Market · 500", "Town · 2,000", "Stress · 5,000"])
	population_picker.select(1)
	population_picker.item_selected.connect(change_population)
	controls.add_child(population_picker)
	controls.add_child(button("Chronicle",func() -> void: chronicle_panel.visible=not chronicle_panel.visible))
	controls.add_child(button("Save · F5",save_manual))
	controls.add_child(button("Load · F9",load_manual))
	controls.add_child(button("Full screen · F11",toggle_fullscreen))
	controls.add_child(button("Bell on / off",func() -> void: bell.volume_db=-80 if bell.volume_db>-50 else -12))
	var spacer:=Control.new()
	spacer.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	controls.add_child(spacer)
	controls.add_child(button("Quit",request_quit))
	feedback_label=label("",13,Color("ced6ba"))
	fv.add_child(feedback_label)

func layout_ui() -> void:
	var v:=get_viewport_rect().size
	header.position=Vector2(24,20)
	header.size=Vector2(v.x-48,84)
	inspector.position=Vector2(v.x-344,124)
	inspector.size=Vector2(320,v.y-264)
	footer.position=Vector2(24,v.y-120)
	footer.size=Vector2(v.x-48,96)
	chronicle_panel.position=Vector2(24,v.y-420)
	chronicle_panel.size=Vector2(500,280)
	camera.offset=Vector2(160,0)/camera.zoom

func refresh_world() -> void:
	people.set_people(sim.positions())
	var s:Dictionary=sim.summary()
	if terrain.bay_work!=int(s.bay_work) or terrain.commissioned!=bool(s.commissioned):
		terrain.bay_work=int(s.bay_work)
		terrain.commissioned=bool(s.commissioned)
		terrain.queue_redraw()
	var day_tick:=int(s.day_tick)
	var tint:=Color.WHITE
	if day_tick>=7000:
		tint=Color("ffe6c5").lerp(Color("8298ad"),clampf((day_tick-7000)/400.0,0,1))
	elif day_tick<450:
		tint=Color("8298ad").lerp(Color.WHITE,day_tick/450.0)
	elif day_tick>6000:
		tint=Color.WHITE.lerp(Color("ffe6c5"),(day_tick-6000)/1000.0)
	terrain.modulate=tint
	people.modulate=tint
	roofs.modulate=tint
	var office:String=s.office
	if office!=last_office and office!="Work and community":
		bell.play()
		feedback("The bell calls the brothers to %s."%office)
	last_office=office

func refresh_ui() -> void:
	if sim==null:return
	var s:Dictionary=sim.summary()
	time_label.text="Day %d · Early autumn"%int(s.day)
	phase_label.text="%s   ·   %s in %ds"%[s.office,s.next_office,int(s.next_seconds)]
	resource_label.text="Meals %d   Timber %d\nStone %d   Coin %d"%[s.meals,s.timber,s.stone,s.coin]
	pause_button.text="▶" if paused else "Ⅱ"
	var population_index:=[8,96,500,2000,5000].find(int(s.population))
	if population_index>=0:population_picker.select(population_index)
	var p:Dictionary=sim.inspect_person(selected)
	if p.is_empty():return
	name_label.text=p.name
	detail_label.text="%s · Age %d · %s"%["Brother" if p.monk else "Resident",p.age,p.trait]
	activity_label.text="%s · %s"%[p.activity,p.duty]
	reason_label.text=p.reason
	needs_label.text="Hunger %d / 100     Fatigue %d / 100\nWorking skill %d / 10"%[p.hunger,p.fatigue,p.skill]
	history_label.text="%d work cycles · %d offices attended"%[p.work_units,p.services]
	duty_picker.select(int(p.duty_id))
	duty_picker.disabled=not bool(p.monk)
	duty_picker.tooltip_text="Residents manage their own work in this prototype." if not p.monk else "Choose the brother’s ordinary work."
	follow_button.text="Stop following" if following else "Follow this person"
	build_button.disabled=bool(s.commissioned)
	build_button.text="Bay progress · %d%%"%int(float(s.bay_work)/6.0) if s.commissioned else "Commission chapel bay"
	var lines:PackedStringArray=[]
	var events:Array=s.chronicle
	for i in range(maxi(0,events.size()-6),events.size()):lines.append("• "+str(events[i]))
	chronicle_label.text="\n\n".join(lines)

func _process(delta: float) -> void:
	if sim==null:return
	frame_count+=1
	if frame_count==4:layout_ui()
	ui_clock+=delta
	autosave_clock+=delta
	if not paused:
		tick_bank+=delta*speed*10.0
		var steps:=mini(int(tick_bank),40)
		if steps>0:
			sim.advance(steps)
			tick_bank-=steps
			refresh_world()
	if ui_clock>0.3:
		refresh_ui()
		ui_clock=0.0
	if autosave_clock>90:
		var error:String=sim.save_game(ProjectSettings.globalize_path("user://abbey-autosave.save"))
		if not error.is_empty():feedback("Autosave failed: "+error)
		autosave_clock=0.0
	if following:
		var p:Dictionary=sim.inspect_person(selected)
		if int(p.floor)!=floor_level:set_floor(int(p.floor),false)
		camera.position=camera.position.lerp(WorldView.iso(p.x,p.y,p.floor),minf(delta*5,1))
	elif not dragging:
		var direction:=Vector2(float(Input.is_physical_key_pressed(KEY_D))-float(Input.is_physical_key_pressed(KEY_A)),float(Input.is_physical_key_pressed(KEY_S))-float(Input.is_physical_key_pressed(KEY_W)))
		camera.position+=direction*delta*650/camera.zoom.x
	if not capture_path.is_empty() and frame_count==capture_frame:capture.call_deferred()
	if quit_frame>0 and frame_count>=quit_frame:get_tree().quit()

func _input(event: InputEvent) -> void:
	# Mouse release must end panning even when the pointer has entered a UI panel.
	if event is InputEventMouseButton and not event.pressed:
		if event.button_index==MOUSE_BUTTON_MIDDLE or event.button_index==MOUSE_BUTTON_RIGHT:dragging=false

func _unhandled_input(event: InputEvent) -> void:
	if sim==null:return
	if event is InputEventMouseButton:
		if event.button_index==MOUSE_BUTTON_MIDDLE or event.button_index==MOUSE_BUTTON_RIGHT:
			dragging=event.pressed
			following=false
		if event.pressed:
			if event.button_index==MOUSE_BUTTON_WHEEL_UP:change_zoom(1.1)
			if event.button_index==MOUSE_BUTTON_WHEEL_DOWN:change_zoom(0.91)
			if event.button_index==MOUSE_BUTTON_LEFT:
				var hit:int=people.pick(people.get_local_mouse_position())
				if hit>=0:select_person(hit)
	elif event is InputEventMouseMotion and dragging:
		camera.position-=event.relative/camera.zoom.x
	elif event is InputEventKey and event.pressed and not event.echo:
		match event.physical_keycode:
			KEY_SPACE:toggle_pause()
			KEY_F5:save_manual()
			KEY_F9:load_manual()
			KEY_F11:toggle_fullscreen()
			KEY_ESCAPE:paused=true;refresh_ui();feedback("Paused. Use Quit to close Abbey; F11 switches to a window.")
			KEY_PAGEUP:set_floor(mini(1,floor_level+1))
			KEY_PAGEDOWN:set_floor(maxi(-1,floor_level-1))

func _notification(what: int) -> void:
	if what==NOTIFICATION_WM_CLOSE_REQUEST:request_quit()
	if what==NOTIFICATION_PREDELETE:sim=null

func set_floor(value: int, focus: bool=true) -> void:
	floor_level=value
	terrain.floor_level=value
	roofs.floor_level=value
	people.floor_level=value
	terrain.queue_redraw()
	roofs.queue_redraw()
	people.set_people(sim.positions())
	floor_picker.select(value+1)
	if focus and value!=0:
		camera.position=WorldView.iso(11,19,value)
		camera.zoom=Vector2(1.55,1.55)
		layout_ui()
	elif focus:reset_camera()

func select_person(id: int) -> void:
	selected=id
	people.selected=id
	refresh_ui()

func toggle_pause() -> void:
	paused=not paused
	refresh_ui()

func change_zoom(factor: float) -> void:
	var before:=get_global_mouse_position()
	camera.zoom=Vector2.ONE*clampf(camera.zoom.x*factor,0.45,2.2)
	camera.offset=Vector2(160,0)/camera.zoom
	camera.force_update_scroll()
	var after:=get_global_mouse_position()
	camera.position+=before-after

func reset_camera() -> void:
	following=false
	camera.position=Vector2(150,560)
	camera.zoom=Vector2(0.97,0.97)
	layout_ui()

func change_population(index: int) -> void:
	var confirm:=ConfirmationDialog.new()
	confirm.title="Begin a new settlement?"
	confirm.dialog_text="This replaces the current unsaved session. Manual saves remain available."
	confirm.confirmed.connect(func() -> void:
		sim.reset([8,96,500,2000,5000][index],1135)
		selected=0
		people.selected=0
		following=false
		refresh_world()
		refresh_ui()
		feedback("New settlement started. Population: %d."%int(sim.summary().population))
		confirm.queue_free())
	confirm.canceled.connect(func() -> void: refresh_ui();confirm.queue_free())
	add_child(confirm)
	confirm.popup_centered()

func commission() -> void:
	if sim.commission_bay():feedback("The new bay is commissioned. Assigned masons will begin work.")
	else:feedback("The bay needs 40 stone, 20 timber and 30 coin.")
	refresh_world()
	refresh_ui()

func save_manual() -> void:
	var error:String=sim.save_game(ProjectSettings.globalize_path(SAVE_PATH))
	feedback("Abbey saved. The previous save is retained as a backup." if error.is_empty() else "Save failed: "+error)

func load_manual() -> void:
	var error:String=sim.load_game(ProjectSettings.globalize_path(SAVE_PATH))
	if error.is_empty():
		selected=mini(selected,int(sim.summary().population)-1)
		people.selected=selected
		tick_bank=0
		refresh_world()
		refresh_ui()
	feedback("Abbey restored." if error.is_empty() else "Load failed: "+error)

func toggle_fullscreen() -> void:
	DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED if DisplayServer.window_get_mode()==DisplayServer.WINDOW_MODE_FULLSCREEN else DisplayServer.WINDOW_MODE_FULLSCREEN)

func feedback(message: String) -> void:
	feedback_label.text=message

func request_quit() -> void:
	if sim!=null:
		var error:String=sim.save_game(ProjectSettings.globalize_path("user://abbey-autosave.save"))
		if not error.is_empty():
			paused=true
			feedback("Could not save on exit: "+error+". Use a manual save before closing.")
			return
	get_tree().quit()

func capture() -> void:
	await RenderingServer.frame_post_draw
	var image:=get_viewport().get_texture().get_image()
	var result:=image.save_png(capture_path)
	print("CAPTURE ",capture_path," ",result)
