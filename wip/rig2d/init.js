"use strict";
const canvas = document.querySelector("#Canvas");
const ctx = canvas.getContext("2d", { alpha: false });
Ctx.ctx = ctx;
let pause = false;
let lastFrameTime = 0;
let firstClick = false

Screen.updateSize();
// const points = []
// copy(points.map(p => `[${p.x.toFixed(0)}, ${p.y.toFixed(0)}]`).join(", "))
const data = [[49, 206], [69, 203], [88, 196], [103, 183], [117, 169], [131, 154], [150, 151], [170, 155], [187, 165], [195, 184], [199, 203], [202, 223], [206, 243], [214, 261], [228, 275], [247, 281], [266, 274], [272, 255], [271, 235], [260, 218], [246, 204], [233, 189], [222, 172], [213, 154], [207, 135], [208, 115], [211, 96], [221, 78], [232, 62], [248, 49], [266, 40], [285, 34], [305, 31], [325, 31], [344, 34], [363, 40], [381, 50], [396, 63], [409, 78], [418, 96], [424, 115], [425, 135], [424, 155], [419, 174], [416, 194], [410, 213], [404, 232], [397, 251], [392, 270], [391, 290], [404, 306], [423, 310], [443, 307], [460, 297], [465, 277], [465, 257], [460, 238], [453, 219], [447, 200], [441, 181], [440, 161], [441, 141], [449, 123], [458, 105], [473, 92], [490, 82], [509, 76], [529, 77], [548, 83], [565, 95], [576, 111], [580, 131], [580, 151], [577, 171], [587, 188], [606, 193], [626, 191], [642, 179], [662, 182], [686, 194], [705, 195], [720, 209], [740, 210], [759, 201], [743, 214], [759, 225], [741, 217], [721, 216], [706, 230], [687, 235], [669, 244], [649, 247], [630, 243], [613, 232], [593, 233], [574, 229], [555, 221], [541, 207], [531, 189], [529, 170], [531, 150], [530, 130], [511, 123], [496, 136], [493, 156], [492, 176], [498, 195], [509, 233], [513, 253], [513, 273], [511, 293], [506, 312], [496, 329], [484, 345], [468, 357], [449, 365], [430, 370], [410, 369], [391, 364], [373, 355], [357, 343], [346, 326], [338, 308], [332, 289], [335, 269], [339, 249], [347, 231], [352, 211], [369, 154], [370, 134], [366, 115], [355, 98], [338, 88], [318, 85], [298, 87], [281, 97], [268, 112], [265, 132], [273, 150], [286, 166], [298, 182], [307, 200], [313, 219], [315, 238], [315, 258], [309, 278], [298, 294], [282, 307], [264, 314], [244, 319], [225, 314], [206, 307], [192, 293], [181, 276], [175, 257], [173, 237], [171, 217], [169, 197], [163, 178], [146, 169], [128, 179], [113, 192], [97, 204], [77, 206], [57, 206]]
const vertices = data.map(pair => new Vertex(new Vector(pair[0], pair[1])))
// let lastPoint;
const MAX_SEGMENT_LENGTH = 20

const bones = []
const bonePoses = [[696, 213], [612, 210], [556, 177], [546, 103], [470, 114], [473, 216], [479, 307], [412, 337], [355, 275], [397, 131], [329, 51], [238, 92], [285, 213], [272, 296], [196, 270], [174, 170], [132, 166], [66, 209]].map(p => new Vector(p[0], p[1]))
const boneSizes = [bonePoses[0]]
for (let i = 1; i < bonePoses.length; i++) {
	boneSizes.push(bonePoses[i].sub(bonePoses[i - 1]))
}
boneSizes.forEach((size, i) => bones[i] = new Bone(size, bones[i - 1] ? bones[i - 1] : undefined))
rigMesh(bones, vertices)
function rigMesh(bones, mesh) {
	bones.forEach(bone => {
		bone.vertices.fill(0)
	})
	mesh.forEach((vertex, i) => {
		let minDist = Infinity
		let closestBone
		bones.forEach((bone, i) => {
			if (i === 0) return;
			const dist = bone.parent.pos.add(Vector.fromAngle(bone.angle).scale(bone.length / 2)).dist(vertex.pos)
			if (dist < minDist) {
				minDist = dist
				closestBone = bone
			}
		})
		vertex.color = closestBone.color
		closestBone.vertices[i] = 1
	})
}

frame();

window.addEventListener(EVENT.resize, Screen.resizeHandler);
canvas.addEventListener(EVENT.pointerdown, Input.pointerdownHandler);
canvas.addEventListener(EVENT.pointermove, Input.pointermoveHandler);
window.addEventListener(EVENT.pointerup, Input.pointerupHandler);
window.addEventListener(EVENT.keydown, Input.keydownHandler);
window.addEventListener(EVENT.keyup, Input.keyupHandler);
