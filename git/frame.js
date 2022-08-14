"use strict";
function tick() {
    commits.map(commit => commit.update())
    for(let i = 0; i < commits.length; i++){
        const t1 = commits[i]
        for(let j = i+1; j < commits.length; j++){
            const t2 = commits[j]
            const dx = t1.pos.x - t2.pos.x
            const dy = t1.pos.y - t2.pos.y
            const d = dx*dx+dy*dy

            let fx = -repForce*dx/(d*d*d)
            let fy = -repForce*dy/(d*d*d)
            t1.vel.x-=fx
            t1.vel.y-=fy
            t2.vel.x+=fx
            t2.vel.y+=fy
            if(t1.vel.x>maxSpeed){t1.vel.x=maxSpeed}
            if(t1.vel.y>maxSpeed){t1.vel.y=maxSpeed}
            if(t1.vel.x<-maxSpeed){t1.vel.x=-maxSpeed}
            if(t1.vel.y<-maxSpeed){t1.vel.y=-maxSpeed}
            if(t2.vel.x>maxSpeed){t2.vel.x=maxSpeed}
            if(t2.vel.y>maxSpeed){t2.vel.y=maxSpeed}
            if(t2.vel.x<-maxSpeed){t2.vel.x=-maxSpeed}
            if(t2.vel.y<-maxSpeed){t2.vel.y=-maxSpeed}
            // let fx = attrForce*dx/(d)-repForce*dx/(d*d)
            // let fy = attrForce*dy/(d)-repForce*dy/(d*d)
            // clamp(fx, maxSpeed)
            // clamp(fx, maxSpeed)

            // this.vel.x += fx
            // this.vel.y += fy - antyGravity
            // this.vel = this.vel.scale(0.99)
            // this.pos.addMut(this.vel)
        }
    }
}
function render() {
    ctx.fillStyle = pause ? "rgb(80,80,80)" : "rgb(100,100,100)";
    ctx.fillRect(0, 0, width, height);
    commits.map(commit => commit.drawConnection())
    commits.map(commit => commit.draw())
}

function frame() {
    tick();
    render();
    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
