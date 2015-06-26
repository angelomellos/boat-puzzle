//false is east, true is west
var boat=false;
var startingPlaces = {chicken:false,fox:false,grain:false};
var instructions = "Do it like this:";
function explorePossibilities(pickup,currentPlaces,instructions,boat,previous,maxSteps){
  currentPlaces = JSON.parse(JSON.stringify(currentPlaces));

  //actions
  function everythingIsAcross(){
    if (currentPlaces['grain']&&currentPlaces['fox']&&currentPlaces['chicken'])
        return true;
      else
        return false;
  }
  function somethingGetsEaten(){
    if (currentPlaces['fox']==currentPlaces['chicken']||
      currentPlaces['chicken']==currentPlaces['grain']){
        return true;
      }else{
        return false;
      }
  }
  function describeFinalPositions(){
    instructions += "\n\nThe chicken is on the " + currentPlaces['chicken'] + " side" +
    " and the grain is on the " + currentPlaces['grain'] + " side" +
    " and the fox is on the " + currentPlaces['fox'] + " side" +
    " and the boat is on the " + boat + " side.";
  }
  function describeTripWithNothing(){
    instructions += "\n- Don't put anything on the boat, "
    + "and go to the " + !boat + " side.";
  }
  function describePickupandCross(){
    instructions += "\n- Put the " + pickup + " in the boat "
    + "and go to the " + boat + " side. ";
  }
  function describeOffloadingAction(){
    instructions += "\n- Take the " + thisFreight + " off the boat.";
  }
  function offload(offloadedFreight){
    currentPlaces[offloadedFreight] = boat;
  }
  function crossRiver(){
    boat = !boat;
  }
  function loadFreight(loadedFreight){
    currentPlaces[loadedFreight] = "boat";
  }


  //to try to solve in the least steps possible
  //each line of history records one step taken
  var steps=instructions.match(/[:-]/g).length-1;
  if (steps>maxSteps){return null;}
  //no sense undoing what we just did
  if (previous == pickup)
    return null;
  //Offload anything in the boat.
  for (var thisFreight in currentPlaces){
    if (currentPlaces[thisFreight] == 'boat'){
      offload(thisFreight);
      describeOffloadingAction();
    }
  }
  //Check for success
  if (everythingIsAcross()){
    describeFinalPositions();
    return instructions;
  }
  //Tried traversing with nothing in the boat.
  else if (!pickup){
    describeTripWithNothing();
    crossRiver();
  }
  //Then check if the new freight can't be loaded.
  else if (currentPlaces[pickup]!=boat)//Its on the other side.
    return null;
  //if it can be loaded
  else if (currentPlaces[pickup]==boat){
    loadFreight(pickup);
    crossRiver();
    describePickupandCross();
  }
  //check for failure
  if (somethingGetsEaten()){
      return null;
    }
  //then try all the possible currentPlaces again.
  var previous = pickup;
  return explorePossibilities('chicken',currentPlaces,instructions,boat,previous,maxSteps)
  || explorePossibilities('fox',currentPlaces,instructions,boat,previous,maxSteps)
  || explorePossibilities('grain',currentPlaces,instructions,boat,previous,maxSteps)
  || explorePossibilities(null,currentPlaces,instructions,boat,previous,maxSteps);
}


function tryAsMaxAttempts(max){
    return tryAsFirstFreight("chicken",max)||
    tryAsFirstFreight("grain",max)||
    tryAsFirstFreight("fox",max)||
    tryAsMaxAttempts(max+1);
}
function tryAsFirstFreight(freight,max){
    return explorePossibilities(freight,startingPlaces,instructions,false,'',max)
    || null;
}
window.onload = function(){
  document.getElementById('answer').innerHTML = tryAsMaxAttempts(3).
  replace(/true/g,"<span style='color:green'>East</span>")
  .replace(/false/g,"<span style='color:red'>West</span>")
  .replace(/\n/g,"<br>");
}
