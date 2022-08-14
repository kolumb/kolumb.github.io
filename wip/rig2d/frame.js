"use strict";
const TARGET_FPS = 60;
const SECOND = 1000;

function tick(lag) {
    if (Input.downState) {
        if (firstClick === false) {
            firstClick = true
            bones.length = 0
        }
        Input.downState = false
        const lastBone = bones[bones.length - 1]
        if (lastBone) {
            bones.push(new Bone(Input.pointer.sub(lastBone.pos), lastBone))
        } else {
            bones.push(new Bone(Input.pointer.copy()))
        }
        if (bones.length > 1) rigMesh(bones, vertices)
        // if (lastPoint === undefined) {
        //     lastPoint = Input.pointer.copy()
        //     points.push(lastPoint)
        // } else {
        //     if (Input.pointer.dist(lastPoint) > MAX_SEGMENT_LENGTH) {
        //         lastPoint = lastPoint.add(Input.pointer.sub(lastPoint).clamp(MAX_SEGMENT_LENGTH))
        //         points.push(lastPoint)
        //     }
        // }
    }
    if (bones.length > 0) {
        const randBoneIndex = Math.floor(Math.random() * bones.length)
        const speed = 0.010
        bones[randBoneIndex].relativeAngle = normalizeAngle(bones[randBoneIndex].relativeAngle + Math.random() * speed * 2 - speed)
    }
    bones.forEach(bone => bone.update())
}
function render() {
    Ctx.fillStyle(pause ? "rgb(200,200,200)" : "rgb(240,240,240)");
    Ctx.fillRect(Vector.zero, Screen.size);
    Ctx.beginPath()
    if (vertices[0]) Ctx.moveTo(vertices[0])
    for (let i = 1; i < vertices.length; i++) {
        Ctx.lineTo(vertices[i].pos)
    }
    Ctx.strokeStyle = "black"
    Ctx.stroke();
    for (let i = 0; i < vertices.length; i++) {
        Ctx.fillStyle(vertices[i].color)
        Ctx.fillRect(vertices[i].pos.sub(Vertex.radius), Vertex.diameter)
    }
    bones.forEach(bone => bone.render())
    // Ctx.beginPath()
    // if (points[0]) Ctx.moveTo(points[0])
    // for (let i = 1; i < points.length; i++) {
    //     Ctx.lineTo(points[i])
    // }
    // Ctx.strokeStyle("blue")
    // Ctx.stroke();
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
