// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Player = require("Player");
var newBeerBottles = [];
var brokenBottle = 0;

cc.Class({
    extends: cc.Component,

    properties: {

        player: {
            default: null,
            type: Player
        },

        beerBottlePrefab: {
            default: null,
            type: cc.Prefab
        },

        canvas: {
            default: null,
            type: cc.Canvas
        },

        btnPlay: {
            default: null,
            type: cc.Button
        },

        btnRetry: {
            default: null,
            type: cc.Button
        },

        btnMenu: {
            default: null,
            type: cc.Button
        },

        scoreLabel: {
            default: null,
            type: cc.Label
        },

        isPlaying: false,
        isOver: false,
        brokenBottle: 0,
        score: 0

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //de-active chaibia node
        this.canvas.node.getChildByName("chaibia").active = false;
        //de-active game over panel
        cc.find("GUI/GameOver", this.node).active = false;
    },

    spawnNewBeerBottle: function ()
    {
        //generate new beer bottle
        var newBeerBottle = cc.instantiate(this.beerBottlePrefab);

        //add beer bottle to canvas
        this.canvas.node.addChild(newBeerBottle);
        newBeerBottle.setPosition(this.getNewBeerPosition());
        newBeerBottles.push(newBeerBottle);

    },

    clickPlayButton: function ()
    {
        if (this.isOver == true) {
            this.resetStatus();
            this.isPlaying = true;
        }
        else {
            cc.find("GUI/MainMenu", this.node).active = false;
            cc.find("GUI/GameOver", this.node).active = false;
            this.isPlaying = true;
        }

    },

    clickRetryButton: function ()
    {
        cc.find("GUI/GameOver", this.node).active = false;
        this.resetStatus();
        this.isPlaying = true;
    },

    clickMenuButton: function ()
    {
        cc.find("GUI/GameOver", this.node).active = false;
        cc.find("GUI/MainMenu", this.node).active = true;
        this.resetStatus();
    },

    resetStatus: function ()
    {
        brokenBottle = 0;
        this.isOver = false;
        this.score = 0;
    },

    getNewBeerPosition: function ()
    {
       var maxX = this.canvas.node.width / 2;
       var randX = (Math.random() - 0.5) * 2 * maxX;
       var randY = this.canvas.node.height / 2 - 100;
        return cc.v2(randX, randY);
    },

    getDistance: function (node1, node2)
    {
        var newX = node2.x - node1.x;
        var newY = node2.y - node1.y;

        return Math.sqrt(Math.abs(Math.pow(newX, 2) + Math.pow(newY, 2)));
    },

    gainScore: function () {
        this.score += 1;
        this.scoreLabel.string = 'Score: ' + this.score;
    },

    start() {
        this.timer = 0;
    },

    update(dt) {
        if (this.isPlaying)
        {
            // time to respawn bottle
            if (this.timer <= 4.5) {
                this.timer += dt;
            }
            else {

                this.spawnNewBeerBottle();
                this.timer = 0;
                console.log(this.getNewBeerPosition());
                console.log("player: " + this.player.node.getPosition());
            }
            //update score
            this.scoreLabel.string = "Score: " + this.score;

            //collide with each beer prefab
            newBeerBottles.forEach(element => {
                ///colected beerbottle
                if (this.getDistance(this.player.node, element) <= 60)
                {
                    this.gainScore();
                    newBeerBottles.shift();
                    element.destroy();
                } // broken bottle
                else if (element.y < -270) {
                    newBeerBottles.shift();
                    element.destroy();
                    brokenBottle += 1;

                    if (brokenBottle >= 3) {
                        this.isPlaying = false;
                        this.isOver = true;
                    }
                }
            });

            //if player out of box => lose
            var widthLimit = this.canvas.width / 2 + 20;

            if (this.player.node.x > widthLimit || this.player.x < -widthLimit) {
                this.isPlaying = false;
                this.isOver = true;
                console.log("cc");
            }

            console.log("broken bottle : " + brokenBottle);
            console.log("number of children in canvas: " + this.canvas.node.childrenCount);
            newBeerBottles.forEach(element => {
                console.log("dis: " + this.getDistance(this.player.node, element));
                console.log();
            });

        }
        else if (this.isOver)
        {
            cc.find("GUI/GameOver", this.node).active = true;

        }
    },

});
