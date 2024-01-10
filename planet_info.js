import planetsInfo from "./planets_data.js";

var infoContainer = document.getElementById("info_container");

var planetTitle = document.getElementById("planet_name");
var planetDescription = document.getElementById("planet_description");
var planetDiameter = document.getElementById("planet_diameter");
var planetOrbit = document.getElementById("planet_orbit");
var planetDay = document.getElementById("planet_day");

function showPlanetInfo(planeta) {
  var planetData = planetsInfo.filter((obj) => obj.id == planeta.name);

  planetTitle.textContent = planetData[0].id;
  planetDescription.textContent = planetData[0].description;
  planetDiameter.textContent = planetData[0].diameter;
  planetOrbit.textContent = planetData[0].orbit;
  planetDay.textContent = planetData[0].day;

  infoContainer.style.display = "block";
}

export default showPlanetInfo;
