var board = [];
var total = 0;
var timer = false;

function draw_board(horizontal,vertical) {
   for ( var y = 0; y < vertical ; y++ ) {
      board[y] = [];
      for ( var x = 0; x < horizontal; x++ ) {
         var block = `
<div id="x${x}y${y}" data-x="${x}" data-y="${y}" class="block"></div>
         `;
         $('#page').append(block);
         board[y][x] = false;
         total++;
      }
      var clear = `
<div style="clear:left;"></div>
      `;
      $('#page').append(clear);
   }
}

function is_occupied(x,y) {
   return board[y][x];
}

function start() {
   var width = parseInt($('#page').width() / 30);
   var height = parseInt($('#page').height() / 30);

   draw_board(width,height);

   var cats = [];

   var density = 0;
   do {
      density = Math.floor(Math.random() * total) + 1
   } while ( density > total/.75 || density < total/5 );

   for ( var i = 0; i < parseInt(density) ; i++ ) {
      var gender = Math.floor(Math.random() * 2);
      cats.push(new life('name', gender === 0 ? 'male' : 'female', 0, 0, width, height));
   }

   cats.forEach(function(cat){
      cat.birth();
   });

   timer = setInterval(function() {
      for( var cat = 0; cat < cats.length ; cat++ ) {
         cats[cat].move();
      }
   }, 50);
}

function reset_board() {
   clearTimeout(timer);
   $('#page').html('');
   timer = false;
   board = [];
   total = 0;
   start();
}

$( window ).resize(function() {
   reset_board();
});

$( document ).ready(function() {
   start();
});

function life(name, gender, x, y, horizontal, vertical) {

   this.name   = name;
   this.x      = x;
   this.y      = y;
   this.gender = gender;
   this.age    = 0;
   this.horizontal = horizontal;
   this.vertical   = vertical;
   this.direction  = false;
   //^ 1 - 8 ( 1 is up )

   this.birth = function() {
      // Is my square occupied?
      while ( is_occupied( this.x, this.y ) ) {
         this.x++;
         if ( this.x > this.horizontal-1 ) {
            this.x = 0;
            this.y++;
         }
         if ( this.y > this.vertical-1 ) {
            this.x = 0;
            this.y = 0;
         }
      }

      board[this.y][this.x] = true;
      $('#x'+this.x+'y'+this.y).addClass(this.gender);

   };

   this.random_direction = function() {
      return Math.floor(Math.random() * 8) + 1; // 1 - 8
   };

   this.move = function() {
      // Do we have a direction?
      if ( !this.direction ) {
         this.direction = this.random_direction();
      }

      var moved = false;
      var attempt_count = 0; // Limit the number of attempts to move

      while ( !moved ) {
         var new_x = this.x;
         var new_y = this.y;

         if ( attempt_count > 16 ) {
            break;
         }

         switch ( this.direction ) {
            case 1:
               new_y--;
               break;
            case 2:
               new_y--;
               new_x++;
               break;
            case 3:
               new_x++;
               break;
            case 4:
               new_x++;
               new_y++;
               break;
            case 5:
               new_y++;
               break;
            case 6:
               new_x--;
               new_y++;
               break;
            case 7:
               new_x--;
               break;
            case 8:
               new_x--;
               new_y--;
         }

         if ( new_x > this.horizontal-1 || new_x < 0 || new_y > this.vertical-1 || new_y < 0 ) {
            // We're off the grid
            if ( new_x > this.horizontal-1 ) {
               new_x = this.horizontal-1;
            }
            if ( new_y > this.vertical-1 ) {
               new_y = this.vertical-1;
            }
            if ( new_x < 0 ) {
               new_x = 0;
            }
            if ( new_y < 0 ) {
               new_y = 0;
            }
            this.direction = this.random_direction();
         } else {
            // We can move here, but we should probably have a random
            // chance of just changing direction on a whim
            if ( Math.floor(Math.random() * 20) === 15 || is_occupied( new_x, new_y) ) {
               // 1 in 20
               this.direction = this.random_direction();
            } else {
               // Move from old block
               board[this.y][this.x] = false;
               $('#x'+this.x+'y'+this.y).removeClass(this.gender);

               this.x = new_x;
               this.y = new_y;
               board[this.y][this.x] = true;
               $('#x'+this.x+'y'+this.y).addClass(this.gender);

               moved = true;
            }
         }
         attempt_count++;
      }


   };




}
