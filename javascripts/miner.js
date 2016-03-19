"use strict";
var arr;
var bombsLeft = document.getElementById("bombs");
var timerID;
var gameover;
var difficult;
var rows, cols, bombs;


newgame("intermediate");

function restart() {
  document.getElementById("main_window").removeChild(document.getElementById('table'));
  newgame(difficult);
  clearInterval(timerID);
  timerID = undefined;
  document.getElementById("timer").innerHTML = "0";
}

document.getElementById("main_window").addEventListener("mousedown", function(e) {
  if(e.which == 3) {
    var i = Math.floor(e.target.id / cols);
    var j = e.target.id % cols;
    console.log(e.target.id+" "+i+" "+j+" "+arr[i][j].status);
    if(arr[i][j].status == 0) {
      if(!e.target.backgroundImage && e.target.innerHTML == "") {
        e.target.style.backgroundColor = "green";
        e.target.style.backgroundImage = "url('images/flag.png')";
        e.target.style.backgroundRepeat = "no-repeat";
        e.target.style.backgroundPosition = "center";
        e.target.innerHTML = " ";
        bombsLeft.innerHTML--;
      } else if(e.target.innerHTML != "?") {
        e.target.innerHTML = "?";
        e.target.style.backgroundImage = "none";
        bombsLeft.innerHTML++;
      } else {
        e.target.innerHTML = "";
      }
    }
  }
});

document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

function createTable(rows_, cols_, bombs_) {
  rows = rows_;
  cols = cols_;
  bombs = bombs_;
  gameover = false;
  var table = "<table id='table'>";
  for(let i = 0; i < rows; i++) {
    table+="<tr>";
    for(let j = 0; j < cols; j++) {
      table+="<td id='"+(j+cols*i)+"'></td>";
    }
    table+="</tr>";
  }
  table+= "</table>";
  document.getElementById("main_window").innerHTML = table;
  document.getElementById("table").style.width = cols*24+cols+6+"px";
  fillTable();
}

function fillTable() {
  arr = [];
  arr.length = rows;
  for(let i = 0; i < rows; i++) {
    arr[i] = new Array(cols);
    for(let j = 0; j < cols; j++) {
      //field: value, status: 0-hidden, 1-not
      arr[i][j] = {field: null, status: 0};
    }
  }
  bombsLeft.innerHTML = bombs;
  for(let i = 0; i < bombs; i++) {
    while(!placeBomb()){}
  }
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      document.getElementById(j+cols*i).style.background = 'green';
      if(arr[i][j].field != "bomb")
      {
        let bombsCount = 0;
        if(i != 0 && j !=0) {
          if(checkBomb(i-1,j-1)) bombsCount++;
        }
        if(i != rows-1 && j != cols-1) {
          if(checkBomb(i+1,j+1)) bombsCount++;
        }
        if(i != 0) {
          if(checkBomb(i-1,j)) bombsCount++;
        }
        if(i != 0 && j != cols-1) {
          if(checkBomb(i-1,j+1)) bombsCount++;
        }
        if(i != rows-1) {
          if(checkBomb(i+1,j)) bombsCount++;
        }
        if(i != rows-1 && j != 0) {
          if(checkBomb(i+1,j-1)) bombsCount++;
        }
        if(j != 0) {
          if(checkBomb(i,j-1)) bombsCount++;
        }
        if(j != cols-1) {
          if(checkBomb(i,j+1)) bombsCount++;
        }
        arr[i][j].field = bombsCount;
      }
    }
  }
  addListeners();
}

function addListeners() {
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      document.getElementById(j+cols*i).addEventListener("mouseover", function(e) {
        if(arr[i][j].status == 0) {
          e.target.style.backgroundColor = "darkgreen";
        } else if(!gameover) {
          e.target.style.backgroundColor = "grey";
        }
      });
      document.getElementById(j+cols*i).addEventListener("mouseout", function(e) {
        if(arr[i][j].status == 0) {
          e.target.style.backgroundColor = "green";
        } else if(!gameover) {
          e.target.style.backgroundColor = "white";
        }
      });
      document.getElementById(j+cols*i).addEventListener("click", function(e) {
        if(!timerID) {
          timerID = setInterval(function() {
            document.getElementById("timer").innerHTML++;
          }, 1000);
        }

        if(arr[i][j].status == 1 && arr[i][j].field > 0) {
          openNearest(i, j);
        } else if(arr[i][j].status == 0 && e.target.innerHTML != " ") {
          //e.target.style.backgroundColor = "white";
          if(arr[i][j].field == "bomb") {
            //document.getElementById(j+cols*i).innerHTML = "<img src='images/bomb.png' id='bomb'>";
            gameOver("lost");
            return;
          }
          if(arr[i][j].field == 0) {
            openEmpty(i, j);
          } else {
            openField(i, j);
          }
          arr[i][j].status = 1;
        }
        checkClearing();
      });
    }
  }
}

function checkClearing() {
  let counter = 0;
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      if(arr[i][j].status == 1) counter++;
    }
  }
  if(cols*rows - bombs == counter) gameOver("won");
}

function openNearest(i, j) {
  let flagsCount = 0;
  if(i != 0 && j !=0) {
    if(document.getElementById((j-1)+cols*(i-1)).innerHTML == " ") flagsCount++;
  }
  if(i != rows-1 && j != cols-1) {
    if(document.getElementById((j+1)+cols*(i+1)).innerHTML == " ") flagsCount++;
  }
  if(i != 0) {
    if(document.getElementById(j+cols*(i-1)).innerHTML == " ") flagsCount++;
  }
  if(i != 0 && j != cols-1) {
    if(document.getElementById((j+1)+cols*(i-1)).innerHTML == " ") flagsCount++;
  }
  if(i != rows-1) {
    if(document.getElementById(j+cols*(i+1)).innerHTML == " ") flagsCount++;
  }
  if(i != rows-1 && j != 0) {
    if(document.getElementById((j-1)+cols*(i+1)).innerHTML == " ") flagsCount++;
  }
  if(j != 0) {
    if(document.getElementById((j-1)+cols*i).innerHTML == " ") flagsCount++;
  }
  if(j != cols-1) {
    if(document.getElementById((j+1)+cols*i).innerHTML == " ") flagsCount++;
  }

  if(arr[i][j].field == flagsCount) {
    if(i != 0 && j !=0) {
      if(arr[i-1][j-1].field == 0) openEmpty(i-1, j-1);
      else openField(i-1, j-1);
    }
    if(gameover) return;
    if(i != rows-1 && j != cols-1) {
      if(arr[i+1][j+1].field == 0) openEmpty(i+1, j+1);
      else openField(i+1, j+1);
    }
    if(gameover) return;
    if(i != 0) {
      if(arr[i-1][j].field == 0) openEmpty(i-1, j);
      else openField(i-1, j);
    }
    if(gameover) return;
    if(i != 0 && j != cols-1) {
      if(arr[i-1][j+1].field == 0) openEmpty(i-1, j+1);
      else openField(i-1, j+1);
    }
    if(gameover) return;
    if(i != rows-1) {
      if(arr[i+1][j].field == 0) openEmpty(i+1, j);
      else openField(i+1, j);
    }
    if(gameover) return;
    if(i != (rows-1) && j != 0) {
      if(arr[i+1][j-1].field == 0) openEmpty(i+1, j-1);
      else openField(i+1, j-1);
    }
    if(gameover) return;
    if(j != 0) {
      if(arr[i][j-1].field == 0) openEmpty(i, j-1);
      else openField(i, j-1);
    }
    if(gameover) return;
    if(j != cols-1) {
      if(arr[i][j+1].field == 0) openEmpty(i, j+1);
      else openField(i, j+1);
    }
  }
}

function openEmpty(i, j) {
  if(arr[i][j].field == 0 && arr[i][j].status == 0)
  {
    document.getElementById(j+cols*i).style.backgroundImage = "none";
    document.getElementById(j+cols*i).style.backgroundColor = "white";
    document.getElementById(j+cols*i).innerHTML = "";
    arr[i][j].status = 1;
    if(i != 0 && j !=0) {
      document.getElementById(j+cols*i).style.backgroundImage = "none";
      openField(i-1,j-1, 1);
    }
    if(i != rows-1 && j != cols-1) {
      document.getElementById(j+cols*i).style.backgroundImage = "none";
      openField(i+1,j+1, 1);
    }
    if(i != 0) {
      document.getElementById(j+cols*i).style.backgroundImage = "none";
      openField(i-1, j, 1);
    }
    if(i != 0 && j != cols-1) {
      document.getElementById(j+cols*i).style.backgroundImage = "none";
      openField(i-1,j+1,1);
    }
    if(i != rows-1) {
      document.getElementById(j+cols*i).style.backgroundImage = "none";
      openField(i+1,j,1);
    }
    if(i != rows-1 && j != 0) {
      document.getElementById(j+cols*i).style.backgroundImage = "none";
      openField(i+1,j-1,1);
    }
    if(j != 0) {
      document.getElementById(j+cols*i).style.backgroundImage = "none";
      openField(i,j-1,1);
    }
    if(j != cols-1) {
      document.getElementById(j+cols*i).style.backgroundImage = "none";
      openField(i,j+1,1);
    }
  } else if(arr[i][j].status == 0) {
    openField(i, j);
  }
}

function openField(i, j, empty) {
  if(document.getElementById(j+cols*i).innerHTML != " " || empty) {
    document.getElementById(j+cols*i).style.backgroundImage = "none";
    if(arr[i][j].field == "bomb") {
      gameOver("lost");
      return;
    } else if(arr[i][j].field > 0) {
      arr[i][j].status = 1;
      document.getElementById(j+cols*i).innerHTML = arr[i][j].field;
    } else {
      document.getElementById(j+cols*i).innerHTML = "";
      openEmpty(i, j);
    }
    document.getElementById(j+cols*i).style.backgroundColor = "white";
  }
  if(arr[i][j].field == 0) {
    openEmpty(i, j);
  }
}

function gameOver(status) {
  gameover = true;
  clearInterval(timerID);
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      arr[i][j].status = 1;
      document.getElementById(j+cols*i).style.backgroundImage = "none";
      if(arr[i][j].field == "bomb") {
        document.getElementById(j+cols*i).innerHTML = "<img src='./images/bomb.png' id='bomb'>";
        document.getElementById(j+cols*i).style.backgroundColor = "red";
      } else if(arr[i][j].field > 0) {
        document.getElementById(j+cols*i).innerHTML = arr[i][j].field;
        document.getElementById(j+cols*i).style.backgroundColor = "grey";
      } else {
        document.getElementById(j+cols*i).innerHTML = "";
        document.getElementById(j+cols*i).style.backgroundColor = "white";
      }
    }
  }
  document.getElementById("fade").style.display = "block";
  document.getElementById("endgame_window").style.display = "block";
  if(status == "lost") {
    document.getElementById("endgame_message").innerHTML = "You lost!";
  } else {
    document.getElementById("endgame_message").innerHTML = "You won in "+document.getElementById("timer").innerHTML+" seconds!";
  }
}

function checkBomb(i, j) {
  if(arr[i][j].field == "bomb") return true;
  return false;
}

function placeBomb() {
  let x = getInt(0, rows - 1);
  let y = getInt(0, cols - 1);
  if(arr[x][y].field == "bomb") return false;
  else arr[x][y].field = "bomb";
  return true;
}

function getInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newgame(difficulty) {
  difficult = difficulty;
  if(difficulty == 'novice') {
    createTable(10,10,10);
  } else if(difficulty == "intermediate") {
    createTable(16,16,40);
  } else if(difficulty == "expert") {
    createTable(16,31,99);
  }
  closeNewgameWindow();
}

document.addEventListener("keydown", function(e) {
  if(e.keyCode === 27) {
    if (document.getElementById('endgame_window').style.display == 'block') {
      closeEndgameWindow();
    }
    if (document.getElementById('newgame_window').style.display == 'block') {
      closeNewgameWindow();
    }
  }
});
function closeEndgameWindow() {
  document.getElementById('endgame_window').style.display = "none";
  document.getElementById('fade').style.display = "none";
}

function open_newgame_window() {
  document.getElementById('newgame_window').style.display = "block";
  document.getElementById('fade').style.display = "block";
}
function closeNewgameWindow() {
  document.getElementById('newgame_window').style.display = "none";
  document.getElementById('fade').style.display = "none";
}