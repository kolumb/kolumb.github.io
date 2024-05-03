"use strict";

function tick(dt) {
    car.update(dt);
    camera.addMut(new Vector(width / 2, height / 2)
        .sub(camera)
        .sub(cameraTarget.pos)
        .scale(dt * CAMERA_FRICTION)
    );
    vehicles.forEach(v => v.update(dt));
}
function mid(a, b) {
    return new Vector((a.x + b.x) / 2, (a.y + b.y) / 2);
}
function render() {
    ctx.save()
    ctx.fillStyle = pause ? "rgb(200,200,200)" : "rgb(240,230,200)";
    ctx.fillRect(0, 0, width, height);
    ctx.translate(camera.x, camera.y);
    trees.filter(tree => tree.pos.distEuclidean(cameraTarget.pos) < 1000 * 1000).forEach(tree => tree.render())
    // ctx.strokeStyle = "lightgrey"
    // for (let i = 0; i < roadPoints.length - 1; i++) {
    //     const first = roadPoints[i]
    //     if (first.distEuclidean(car.pos.scale(1 / ROAD_SCALE)) > 40000) continue
    //     const second = roadPoints[i + 1]
    //     ctx.beginPath()
    //     ctx.moveTo(first.x * ROAD_SCALE, first.y * ROAD_SCALE)
    //     ctx.lineTo(second.x * ROAD_SCALE, second.y * ROAD_SCALE);
    //     ctx.stroke();
    // }
    for (let i = 0; i < roadPoints.length - 2; i+=2) {
        const p1 = roadPoints[i+0]
        if (p1.distEuclidean(cameraTarget.pos.scale(1 / ROAD_SCALE)) > 140 * 140) continue
        const p2 = roadPoints[i+1]
        const p3 = roadPoints[i+2]
        const p4 = roadPoints[i+3]

        const a1 = p1.add(p2).scale(0.5).add(p1.sub(p2).normalized().scale(0.03))
        const a2 = p3.add(p4).scale(0.5)
        ctx.beginPath();
        ctx.moveTo(a1.x * ROAD_SCALE, a1.y * ROAD_SCALE);
        ctx.bezierCurveTo(
            p2.x * ROAD_SCALE, p2.y * ROAD_SCALE,
            p3.x * ROAD_SCALE, p3.y * ROAD_SCALE,
            a2.x * ROAD_SCALE, a2.y * ROAD_SCALE);
        ctx.setLineDash([]);
        if (!lowGraphics) {
            ctx.strokeStyle = "#7734"
            ctx.lineWidth = 250
            ctx.stroke();
        }
        ctx.strokeStyle = "#777"
        ctx.lineWidth = 200
        ctx.stroke();
        ctx.setLineDash([35, 20]);
        ctx.strokeStyle = "yellow"
        ctx.lineWidth = 3
        ctx.stroke();
        if (i === roadPoints.length - 6 - 8) {
            let ang1 = p2.angleTo(p1)
            let ang2 = p2.angleTo(p3)
            const perpendicular = (ang1 + ang2) / 2 + ((   ang2 > ang1 && (  ang1 < 0 || ang2 > 0 ) ) ? Math.PI : 0 )
            ctx.save()
            ctx.translate(p1.x * ROAD_SCALE, p1.y * ROAD_SCALE)
            ctx.rotate(perpendicular)
            ctx.fillStyle = "white"
            ctx.fillRect(-140, -20, 280, 40)
            ctx.fillStyle = "black"
            ctx.fillRect(-140, 0, 20, 20)
            ctx.fillRect(-120, -20, 20, 20)
            ctx.fillRect(-100, 0, 20, 20)
            ctx.fillRect(-80, -20, 20, 20)
            ctx.fillRect(-60, 0, 20, 20)
            ctx.fillRect(-40, -20, 20, 20)
            ctx.fillRect(-20, 0, 20, 20)
            ctx.fillRect(0, -20, 20, 20)
            ctx.fillRect(20, 0, 20, 20)
            ctx.fillRect(40, -20, 20, 20)
            ctx.fillRect(60, 0, 20, 20)
            ctx.fillRect(80, -20, 20, 20)
            ctx.fillRect(100, 0, 20, 20)
            ctx.fillRect(120, -20, 20, 20)
            ctx.restore()
        }
    }
    car.trails.filter(trail => trail.age < 100).forEach(trail => {
        ctx.fillStyle = "rgba(20, 20, 10," + (1 - trail.age / 100) + ")"
        ctx.fillRect(trail.pos.x - 3, trail.pos.y - 3, 6, 6)
    });

    ctx.strokeStyle = "#589"
    ctx.lineWidth = 1
    ctx.setLineDash([]);
    vehicles.filter(vehicle => vehicle.pos.distEuclidean(cameraTarget.pos) < 1000 * 1000).forEach(v => v.render());
    // ctx.fillStyle = "black"
    // roadPoints.forEach(p => ctx.fillRect(p.x * ROAD_SCALE, p.y * ROAD_SCALE, 10, 10))
    car.render();
    ctx.restore();
    ctx.fillStyle = "white";
    const vehicleMarkers = vehicles.map(v => v.pos
            .scale(1 / ROAD_SCALE).sub(mapBorders.min)
            .divide(mapBorders.size).scale(MINIMAP_SCALE).mult(mapBorders.factor)
    )
    vehicleMarkers.forEach(vm => ctx.fillRect
        ( 10 + vm.x - 3 * MINIMAP_POINT_SIZE
        , 10 + vm.y - 3 * MINIMAP_POINT_SIZE
        , MINIMAP_POINT_SIZE * 6
        , MINIMAP_POINT_SIZE * 6
        )
    )
    vehicleMarkers.forEach((vm, i) => {
        ctx.fillStyle = vehicles[i].color;
        ctx.fillRect
            ( 10 + vm.x - 2 * MINIMAP_POINT_SIZE
            , 10 + vm.y - 2 * MINIMAP_POINT_SIZE
            , MINIMAP_POINT_SIZE * 4
            , MINIMAP_POINT_SIZE * 4
            )
        }
    )
    const carMarker = car.pos
        .scale(1 / ROAD_SCALE).sub(mapBorders.min)
        .divide(mapBorders.size).scale(MINIMAP_SCALE).mult(mapBorders.factor)
    ctx.fillStyle = "yellow";
    ctx.fillRect
        ( 10 + carMarker.x - 4 * MINIMAP_POINT_SIZE
        , 10 + carMarker.y - 4 * MINIMAP_POINT_SIZE
        , MINIMAP_POINT_SIZE * 8, MINIMAP_POINT_SIZE * 8
        );
    ctx.fillStyle = car.color;
    ctx.fillRect
        ( 10 + carMarker.x - 2 * MINIMAP_POINT_SIZE
        , 10 + carMarker.y - 2 * MINIMAP_POINT_SIZE
        , MINIMAP_POINT_SIZE * 4, MINIMAP_POINT_SIZE * 4
        );

    ctx.strokeStyle = "grey"
    const cameraBorders = camera
        .scale(-1 / ROAD_SCALE).sub(mapBorders.min)
        .divide(mapBorders.size).scale(MINIMAP_SCALE).mult(mapBorders.factor)
    const screenSize = cameraBorders.sub(camera.add(new Vector(width, height))
        .scale(-1 / ROAD_SCALE).sub(mapBorders.min)
        .divide(mapBorders.size).scale(MINIMAP_SCALE).mult(mapBorders.factor))
    ctx.strokeRect
        ( 10 + cameraBorders.x
        , 10 + cameraBorders.y
        , screenSize.x, screenSize.y
        )

    ctx.fillStyle = "#444"
    ctx.fillText((car.vel.length() * 10).toFixed(0), 20 + mapBorders.factor.x * MINIMAP_SCALE, 30)
    minimapPoints.forEach(p => ctx.fillRect( p.x, p.y, 2 * MINIMAP_POINT_SIZE, 2 * MINIMAP_POINT_SIZE))
    participants.sort((a, b) => b.closestRoadPointIndex - a.closestRoadPointIndex)
    participants.forEach((participant, i) => {
        ctx.fillStyle = participant.color
        ctx.fillRect(width - 30, 35 + i * 30, participant.player ? 30 : 20, 20)
        if (!participant.finished) {
            ctx.fillStyle = "grey"
            ctx.fillText(((participant.closestRoadPointIndex - 4) / (roadPoints.length - 4 - 5) * 100).toFixed(0), width - 30, 50 + i * 30)
        }
    })
    ctx.fillStyle = "black"
    ctx.lineWidth = 3
    ctx.textAlign = "right"
    ctx.fillText("Time  Sum Futu  Ext  Acc Turn View         Color", width - 10, 20)
    for (let i = 1; i < winners.length + 1; i++) {
        const winner = winners[i - 1]
        if (!winner.finished) return
        let placeText = (i === car.place ? `You -> ` : "") + String(i)
        placeText = Math.ceil(winner.goalSkipFactor * 100) + "% " + placeText.padStart(10, " ")
        placeText = Math.ceil(winner.turningSpeedFactor * 100) + "% " + placeText.padStart(15, " ")
        placeText = Math.ceil(winner.accFactor * 100) + "% " + placeText.padStart(20, " ")
        placeText = Math.ceil(winner.extrapolation) + "  " + placeText.padStart(25, " ")
        placeText = Math.ceil(winner.futureFactor * 100) + "  " + placeText.padStart(30, " ")
        placeText = Math.ceil((winner.goalSkipFactor + winner.turningSpeedFactor + winner.accFactor ) * 100) + "% " + placeText.padStart(35, " ")
        placeText = winner.time + "s " + placeText.padStart(35, " ")
        ctx.fillText(placeText, width - 40, 20 + i * 30)
    }
    ctx.textAlign = "start"
    if (Input.downState) {
        ctx.save()
        ctx.translate(Input.startPos.x, Input.startPos.y)
        ctx.lineWidth = 5
        const gesture = Input.pointer.sub(Input.startPos)
        ctx.rotate(-gesture.angle())
        if (gesture.length() > Input.gestureDeadZone) {
            ctx.strokeStyle = "black"
        } else {
            ctx.strokeStyle = "#942"
        }
        ctx.beginPath()
        ctx.arc(0, 10, 70, 0, Math.PI * 2)
        ctx.moveTo(0, 10)
        ctx.lineTo(0, -60)
        ctx.moveTo(0, 10)
        ctx.lineTo(-67, 20)
        ctx.moveTo(0, 10)
        ctx.lineTo(67, 20)
        ctx.stroke()
        // gesture.drawFrom(Input.startPos)
        ctx.restore()
    }
}

function frame(timestamp) {
    const dt = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    if (dt < SECOND) tick(dt * TARGET_FPS / SECOND);
    render();
    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
