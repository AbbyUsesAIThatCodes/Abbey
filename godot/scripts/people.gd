extends Node2D

var current := PackedFloat32Array()
var previous := PackedFloat32Array()
var blend := 1.0
var elapsed := 0.0
var floor_level := 0
var selected := 0
var order: Array[int] = []
var monk := preload("res://assets/monk.svg")
var villager := preload("res://assets/villager.svg")
var scale_people := 0.82

func set_people(data: PackedFloat32Array) -> void:
	previous=current if current.size()==data.size() else data
	current=data
	blend=0.0
	order.clear()
	for i in range(0,current.size(),6):
		if roundi(current[i+3])==floor_level:order.append(i)
	order.sort_custom(func(a: int,b: int) -> bool: return current[a+1]+current[a+2]<current[b+1]+current[b+2])
	queue_redraw()

func _process(delta: float) -> void:
	blend=minf(1.0,blend+delta*10.0)
	elapsed+=delta
	queue_redraw()

func position_at(i: int) -> Vector2:
	var x:=lerpf(previous[i+1],current[i+1],blend)
	var y:=lerpf(previous[i+2],current[i+2],blend)
	var z:=lerpf(previous[i+3],current[i+3],blend)
	return Vector2((x-y)*32.0,(x+y)*16.0-z*84.0)

func _draw() -> void:
	var visible:=get_viewport_rect().grow(50)
	var transform:=get_global_transform_with_canvas()
	for i in order:
		var p:=position_at(i)
		if not visible.has_point(transform*p):continue
		var chosen:=int(current[i])==selected
		if chosen:
			draw_arc(p+Vector2(0,1),14,0,TAU,24,Color("f6db84"),2.5,true)
			draw_circle(p+Vector2(0,1),12,Color(0.97,0.85,0.51,0.17))
		var walking:=int(current[i+5])==1
		var stride:=sin(elapsed*10+current[i])*2 if walking else 0.0
		if walking:
			draw_line(p+Vector2(-3,-3),p+Vector2(-4+stride,2),Color("483c2e"),3)
			draw_line(p+Vector2(3,-3),p+Vector2(4-stride,2),Color("483c2e"),3)
		var tint:=Color.WHITE
		if current[i+4]<0.5:tint=Color.from_hsv(fmod(current[i]*0.071,1.0),0.18,1.0)
		var pose:=p+Vector2(0,absf(stride)*-0.4)
		draw_texture_rect(monk if current[i+4]>0.5 else villager,Rect2(pose-Vector2(17,46)*scale_people,Vector2(34,52)*scale_people),false,tint)
		if int(current[i+5])==2:
			draw_circle(p-Vector2(0,42),2,Color("eed492"))
		elif int(current[i+5])==5:
			draw_circle(p-Vector2(0,43),4,Color("c15f4c"))

func pick(local: Vector2) -> int:
	var found:=-1
	var distance:=22.0
	for i in order:
		var d:=local.distance_to(position_at(i)-Vector2(0,19))
		if d<distance:
			distance=d
			found=int(current[i])
	return found
