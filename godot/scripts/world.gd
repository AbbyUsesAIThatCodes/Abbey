extends Node2D

var floor_level := 0
var roof_only := false
var show_roofs := false
var bay_work := 0
var commissioned := false
var serif := SystemFont.new()
var tree_tex := preload("res://assets/tree.svg")
var pine_tex := preload("res://assets/pine.svg")

func _ready() -> void:
	serif.font_names = PackedStringArray(["Georgia", "DejaVu Serif", "serif"])
	queue_redraw()

static func iso(x: float, y: float, z: float = 0.0) -> Vector2:
	return Vector2((x - y) * 32.0, (x + y) * 16.0 - z * 84.0)

func polygon(points: Array, color: Color) -> void:
	draw_colored_polygon(PackedVector2Array(points), color)

func tile(x: float, y: float, color: Color, z: float = 0.0) -> void:
	polygon([iso(x,y,z), iso(x+1,y,z), iso(x+1,y+1,z), iso(x,y+1,z)], color)

func area(x: float, y: float, w: float, h: float, color: Color, z: float = 0.0) -> void:
	polygon([iso(x,y,z),iso(x+w,y,z),iso(x+w,y+h,z),iso(x,y+h,z)],color)

func wall(a: Vector2, b: Vector2, tall: float, color: Color) -> void:
	polygon([a,b,b-Vector2(0,tall),a-Vector2(0,tall)],color)
	draw_line(a-Vector2(0,tall),b-Vector2(0,tall),Color("f3dfab"),2.0)
	for i in range(1, int(tall / 14)):
		draw_line(a-Vector2(0,i*14),b-Vector2(0,i*14),color.darkened(0.09),1.0)

func caption(text: String, x: float, y: float, color := Color("f5ecd4")) -> void:
	var pos := iso(x,y)
	var tw := serif.get_string_size(text,HORIZONTAL_ALIGNMENT_LEFT,-1,17).x
	draw_style_box(_plaque(),Rect2(pos-Vector2(tw/2+12,19),Vector2(tw+24,28)))
	draw_string(serif,pos-Vector2(tw/2,0),text,HORIZONTAL_ALIGNMENT_LEFT,-1,17,color)

func _plaque() -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color=Color(0.10,0.20,0.16,0.93)
	s.border_color=Color("b39d6e")
	s.set_border_width_all(1)
	s.set_corner_radius_all(4)
	return s

func _draw() -> void:
	if roof_only:
		if show_roofs and floor_level == 0:
			roof(12,5,8,10,90,Color("765f57"))
			roof(7,17,8,5,108,Color("9c6747"))
		return
	# Quiet individual grass tiles. The boundary has visible earth beneath it.
	wall(iso(0,32),iso(40,32),-22,Color("776a47"))
	wall(iso(40,0),iso(40,32),-22,Color("8e8053"))
	for y in range(32):
		for x in range(40):
			var n := posmod(x*17+y*31+x*y,9)
			var color := Color("8da577").lerp(Color("a9b785"),float(n)/18.0)
			if floor_level != 0: color=color.darkened(0.32)
			tile(x,y,color)
	# Paths, an orchard, and garden plots.
	area(15,14,3,16,Color("c8bd94"))
	area(7,15,26,2,Color("c8bd94"))
	area(20,17,12,7,Color("c7b991"))
	area(13,20,10,2,Color("c8bd94"))
	area(25,23,4,7,Color("c8bd94"))
	area(5,6,6,7,Color("716549"))
	for yy in range(6,13):
		for xx in range(5,11):
			tile(xx,yy,Color("938258") if yy%2==0 else Color("6e6848"))
			var g:=iso(xx+0.5,yy+0.5)
			draw_line(g+Vector2(0,3),g-Vector2(0,6),Color("d5bf70"),2)
			draw_line(g-Vector2(0,2),g+Vector2(4,-5),Color("b8c775"),2)
	# Pond and reeds share the simulation's impassable footprint.
	area(27,5,6,5,Color("7b9e99"))
	area(27.3,5.3,5.4,4.4,Color("608e8d"))
	for i in range(10):
		var p:=iso(27.6+fmod(i*1.3,4.8),5.8+fmod(i*1.7,3.6))
		draw_line(p,p+Vector2(15,0),Color("a3beb1"),1)
	# Trees on the estate edge leave the center readable.
	for y in range(1,31,3):
		for x in range(1,39,3):
			if x < 4 or x > 35 or y < 3 or (y>28 and x<13):
				var p:=iso(x+float(posmod(y,3))*0.18,y)
				var tex:=tree_tex if posmod(x+y,3)!=0 else pine_tex
				draw_texture_rect(tex,Rect2(p-Vector2(40,108),Vector2(80,114)),false)
	for x in [5,8,11]:
		draw_texture_rect(tree_tex,Rect2(iso(x,26)-Vector2(37,104),Vector2(74,110)),false)
	church()
	dormitory()
	market()
	construction()
	for i in range(4):
		cottage(23+i*3,25+posmod(i,2)*2)
	# Well and stacked timber are original vector primitives.
	var well:=iso(20,19)
	draw_ellipse(well,Vector2(22,11),Color("a38c67"))
	draw_ellipse(well-Vector2(0,12),Vector2(22,11),Color("e2d2a5"))
	draw_ellipse(well-Vector2(0,13),Vector2(14,6),Color("445f5c"))
	for i in range(6):
		var p:=iso(20+fmod(i,3)*0.3,12+float(i/3)*0.25)
		draw_line(p,p+Vector2(35,-16),Color("88613b"),7)
		draw_circle(p,3.5,Color("c9a875"))
	caption("Saint Anselm’s",16,4)
	caption("Kitchen · Dormitory",10,22.6)
	caption("Market green",27,23.8)
	caption("Kitchen garden",8,13.8)
	if floor_level != 0:
		caption("Upper rooms" if floor_level==1 else "Cellar",11,17,Color("f5d589"))

func draw_ellipse(center: Vector2, radius: Vector2, color: Color) -> void:
	var p:=PackedVector2Array()
	for i in range(32):p.append(center+Vector2(cos(i*TAU/32.0),sin(i*TAU/32.0))*radius)
	draw_colored_polygon(p,color)

func church() -> void:
	for y in range(5,15):
		for x in range(12,20):tile(x,y,Color("d9ccaa") if (x+y)%2==0 else Color("cdbc98"))
	wall(iso(12,5),iso(20,5),92,Color("cabb96"))
	wall(iso(12,5),iso(12,15),92,Color("b7a684"))
	# Repeated blind arches in the rear walls.
	for y in range(6,14,2):
		var p:=iso(12,y)-Vector2(0,51)
		draw_line(p+Vector2(4,20),p-Vector2(9,2),Color("8a8066"),7)
		draw_line(p-Vector2(9,2),p-Vector2(24,1),Color("8a8066"),7)
	for y in range(7,13,2):
		for x in [14,17]:
			var p:=iso(x,y)
			draw_line(p+Vector2(-12,0),p+Vector2(12,12),Color("795d41"),6)
	area(14,6,4,1,Color("aa8661"))
	area(15,6,2,0.8,Color("f2e7c9"))
	var cross:=iso(16,6)-Vector2(0,25)
	draw_line(cross-Vector2(0,20),cross+Vector2(0,5),Color("b8904c"),3)
	draw_line(cross-Vector2(9,12),cross+Vector2(9,-12),Color("b8904c"),3)
	wall(iso(20,5),iso(20,15),20,Color("dcc99d"))
	wall(iso(12,15),iso(16,15),18,Color("cfbd91"))
	wall(iso(17,15),iso(20,15),18,Color("cfbd91"))

func dormitory() -> void:
	var z:=float(floor_level)
	for y in range(17,22):
		for x in range(7,15):tile(x,y,Color("bfa57b") if (x+y)%2==0 else Color("ccb48a"),z)
	wall(iso(7,17,z),iso(15,17,z),53,Color("b49e77"))
	wall(iso(7,17,z),iso(7,22,z),53,Color("968468"))
	if floor_level==1:
		for x in range(8,13):
			for y in [18,20]:
				area(x,y,0.7,0.75,Color("815e45"),z)
				area(x,y,0.7,0.5,Color("e2d0a6"),z+0.05)
	elif floor_level==-1:
		for x in range(8,13,2):
			for y in [18,20]:
				var p:=iso(x,y,z)
				draw_line(p,p-Vector2(0,18),Color("866140"),17)
				draw_ellipse(p-Vector2(0,18),Vector2(9,4),Color("bd955d"))
	else:
		for y in [18,20]:
			area(8,y,4,0.5,Color("826242"),0.12)
			for x in range(8,12):draw_circle(iso(x+0.5,y+0.3,0.15),3,Color("ebdfb9"))
	# A visible stair marker exactly matches the core's vertical connection.
	for i in range(5):
		var p:=iso(13,20.2,z)+Vector2(i*3,-i*3)
		draw_line(p,p+Vector2(16,8),Color("ebe0c3"),3)

func roof(x: float,y: float,w: float,h: float,tall: float,color: Color) -> void:
	var a:=iso(x,y)-Vector2(0,tall)
	var b:=iso(x+w,y)-Vector2(0,tall)
	var c:=iso(x+w,y+h)-Vector2(0,tall)
	var d:=iso(x,y+h)-Vector2(0,tall)
	var r1:=(a+b)/2-Vector2(0,44)
	var r2:=(d+c)/2-Vector2(0,44)
	polygon([a,d,r2,r1],color.lightened(0.12))
	polygon([r1,r2,c,b],color)
	draw_line(r1,r2,Color("c4a780"),3)
	for i in range(1,int(h)):
		var t:=float(i)/h
		draw_line(a.lerp(d,t),r1.lerp(r2,t),color.darkened(0.15),1)
		draw_line(r1.lerp(r2,t),b.lerp(c,t),color.darkened(0.12),1)

func market() -> void:
	for i in range(5):
		var x:=23+posmod(i,3)*3
		var y:=18+int(i/3)*4
		area(x,y,2,1.5,Color("897254"),0.15)
		for v in [Vector2(x,y),Vector2(x+2,y),Vector2(x,y+1.5),Vector2(x+2,y+1.5)]:
			draw_line(iso(v.x,v.y),iso(v.x,v.y)-Vector2(0,42),Color("6b543a"),3)
		var colors:=[Color("a95746"),Color("536d75"),Color("a28a48"),Color("5d7b59"),Color("986854")]
		for stripe in range(4):
			var color:Color=colors[i] if stripe%2==0 else Color("eadbbb")
			area(x+stripe*0.5,y,0.5,1.7,color,0.5)
		for j in range(5):draw_circle(iso(x+0.3+j*0.3,y+1.3,0.19),3,Color("cca760"))

func construction() -> void:
	area(21,6,5,7,Color("9b957b"))
	for x in range(21,26):
		for y in range(6,13):
			if x==21 or x==25 or y==6 or y==12:tile(x,y,Color("d8c9a4"))
	if commissioned:
		var h:=12.0+float(bay_work)/600.0*68.0
		wall(iso(21,6),iso(26,6),h,Color("d4c49a"))
		wall(iso(21,6),iso(21,13),h,Color("bca983"))
		for y in range(6,14,2):
			var p:=iso(26,y)
			draw_line(p,p-Vector2(0,h+20),Color("8a653f"),4)
			draw_line(p-Vector2(10,h),p+Vector2(12,-h+11),Color("ba905b"),3)
		if bay_work>=600:roof(21,6,5,7,80,Color("877462"))
	caption("The next chapel bay",24,14)

func refresh() -> void:
	queue_redraw()

func cottage(x: float, y: float) -> void:
	area(x,y,2,2,Color("ad9670"))
	wall(iso(x,y),iso(x+2,y),38,Color("e0cda3"))
	wall(iso(x+2,y),iso(x+2,y+2),38,Color("beac85"))
	wall(iso(x,y+2),iso(x+2,y+2),38,Color("d4c09b"))
	var door:=iso(x+1,y+2)
	draw_line(door,door-Vector2(0,24),Color("69563e"),10)
	roof(x,y,2,2,38,Color("b48c54"))
