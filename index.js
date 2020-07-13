var config = {
    game: document.getElementById('game'),
    size:10,
    maxX:49,
    maxY:49
}

function SnakeItem(x,y){
    this.x = x;
    this.y = y;
    this.dom = document.createElement('div');
    this.dom.classList.add('item')
    game.appendChild(this.dom);
    this.prev = null;
    this.next = null;
    this.show();
}

SnakeItem.prototype.setPrevItem = function(prevItem){
    this.prev = prevItem;
    prevItem.next = this;
}

SnakeItem.prototype.setNextItem = function(nextItem){
    this.next = nextItem;
    nextItem.prev = this;
}

SnakeItem.prototype.moveForward = function(){
    if(this.next){
        this.next.moveForward();
    }
    if(this.prev){
        this.setPosition(this.prev.x,this.prev.y)
    }
}

SnakeItem.prototype.show = function(){
    this.dom.style.left = this.x * config.size + 'px';
    this.dom.style.top = this.y * config.size + 'px';
}

SnakeItem.prototype.setPosition = function(x,y){
    this.x = x;
    this.y = y;
    this.show();
}

function Snake(length){
    this.length = length;
    this.direction = 'right';
    this.timer = null;
    var curItem = null;
    for(var i = 0; i < this.length; i++){
        var item = new SnakeItem(i,0)
        if(curItem != null){
            curItem.setPrevItem(item)
        }
        curItem = item;
        if(i == this.length - 1){
            this.head = item;
            this.head.dom.classList.add('head');
        }
    }
}
Snake.prototype.move = function(){
    var pos = this.getNextPos();
    if(!this.isCanMove(pos)){
        gameOver()
        return
    }
    this.head.moveForward();
    this.head.setPosition(pos.x,pos.y);
}
Snake.prototype.isCanMove = function(pos){
    if(pos.x < 0 || pos.x > config.maxX || pos.y < 0 || pos.y > config.maxY){
        return false
    }
    var item = this.head;
    while(item = item.next){
        if(item.x === pos.x && item.y === pos.y){
            return false;
        }
    }
    return true
}
Snake.prototype.changeDirection = function(newDirection){
    var allows;
    if(this.direction == 'left' || this.direction == 'right'){
        allows = ['up','down'];
    }
    else{
        allows = ['left','right']
    }
    if(allows.includes(newDirection)){
        this.direction = newDirection
    }
}
Snake.prototype.getNextPos = function(){
    var pos = {
        x: this.head.x,
        y: this.head.y
    }
    if(this.direction == 'right'){
        pos.x++;
    }else if(this.direction == 'left'){
        pos.x--;
    }else if(this.direction == 'up'){
        pos.y--;
    }else if(this.direction == 'down'){
        pos.y++;
    }
    return pos;
}
Snake.prototype.autoMove = function(){
    clearInterval(this.timer);
    this.timer = setInterval(()=>{
        this.move();
    },300)
}
Snake.prototype.stop = function(){
    clearInterval(this.timer)
}

var s = new Snake(10);
s.autoMove()
window.onkeydown = function(e){
    if(e.key === 'ArrowUp'){
        s.changeDirection('up');
        s.move();
    }else if(e.key === 'ArrowDown'){
        s.changeDirection('down');
        s.move();
    }else if(e.key === 'ArrowLeft'){
        s.changeDirection('left');
        s.move();
    }else if(e.key === 'ArrowRight'){
        s.changeDirection('right');
        s.move();
    }
}
function gameOver(){
    alert('gameOver');
    window.onkeydown = null;
    s.stop();
}