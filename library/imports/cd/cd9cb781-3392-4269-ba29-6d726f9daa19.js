"use strict";
cc._RF.push(module, 'cd9cbeBM5JCabopbXJvnaoZ', 'Player');
// Scripts/Player.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        maxMoveSpeed: 500,
        accel: 100
    },

    setInputControl: function setInputControl() {
        var seft = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            switch (event.keyCode) {
                case cc.KEY.a:
                    seft.accLeft = true;
                    break;
                case cc.KEY.d:
                    seft.accRight = true;
                    break;
            }
        });

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
            switch (event.keyCode) {
                case cc.KEY.a:
                    seft.accLeft = false;
                    break;
                case cc.KEY.d:
                    seft.accRight = false;
                    break;
            }
        });
    },

    limitArea: function limitArea(dt) {
        var maxX = this.node.parent.width / 2; // maxX of canvas

        if (this.node.x > maxX) {
            this.node.x == maxX;
            this.xSpeed = 0;
            // this.xSpeed = this.xSpeed = this.xSpeed - (this.accel * dt);
        } else if (this.node.x < -maxX) {
            this.node.x == -maxX;
            this.xSpeed = 0;
            //this.xSpeed = this.xSpeed = this.xSpeed + (this.accel * dt);;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.accLeft = false;
        this.accRight = false;

        this.xSpeed = 0;
        this.setInputControl();
    },
    start: function start() {},
    update: function update(dt) {

        if (this.accLeft) {
            this.xSpeed = this.xSpeed - this.accel * dt;
            //this.xSpeed = this.xSpeed - 1;
        } else if (this.accRight) {
            this.xSpeed = this.xSpeed + this.accel * dt;
            //this.xSpeed = this.xSpeed + 1;
        }

        if (Math.abs(this.xSpeed > this.maxMoveSpeed)) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        this.node.x = this.node.x + this.xSpeed * dt;

        this.limitArea(dt);
        console.log("player: " + this.node.getPosition());
    }
});

cc._RF.pop();