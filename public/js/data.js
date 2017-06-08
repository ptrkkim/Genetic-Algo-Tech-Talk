// this is all transformed/scaled later, don't worry about numbers too much

export const smallSquare = [
{x: 50, y: 50},
{x: 50, y: 100},
{x: 50, y: 150},
{x: 100, y: 150},
{x: 150, y: 150},
{x: 150, y: 100},
{x: 150, y: 50},
{x: 125, y: 50},
{x: 100, y: 50},
{x: 75, y: 50},
];

export const random30 = [{"x":864,"y":125},{"x":847,"y":523},{"x":742,"y":170},{"x":204,"y":601},{"x":421,"y":377},{"x":808,"y":49},{"x":860,"y":466},{"x":844,"y":294},{"x":147,"y":213},{"x":550,"y":124},{"x":238,"y":313},{"x":57,"y":572},{"x":664,"y":190},{"x":612,"y":644},{"x":456,"y":154},{"x":120,"y":477},{"x":542,"y":313},{"x":620,"y":29},{"x":245,"y":246},{"x":611,"y":578},{"x":627,"y":373},{"x":534,"y":286},{"x":577,"y":545},{"x":539,"y":340},{"x":794,"y":328},{"x":855,"y":139},{"x":700,"y":47},{"x":275,"y":593},{"x":130,"y":196},{"x":863,"y":35}];

export const tenSided = createCircularPolygon(20);

export function createCircularPolygon(sides) {
  if (sides < 3) return;
  const radius = 65;
  const angle = Math.PI * 2 / sides;

  const points = Array(sides).fill(null).map((point, i) => {
    const xVal = radius * Math.cos(angle * i + 1);
    const yVal = radius * Math.sin(angle * i + 1);
    return { x: xVal, y: yVal };
  });

  const lowestX = findLowest(points, 'x');
  const lowestY = findLowest(points, 'y');

  const offsetX = 10 - lowestX;
  const offsetY = 10 - lowestY;

  return points.map(point => ({ x: point.x + offsetX, y: point.y + offsetY }));
}

function findLowest(pointArr, key) {
  return pointArr.reduce((lowest, point) => {
    return lowest < point[key]
      ? lowest
      : point[key];
  }, 100000000000000);
}

// var data2 = [ { x: 16, y: 97 },
//   { x: 57, y: 572   },
//   { x: 114, y: 544 },
//   { x: 116, y: 404 },
//   { x: 120, y: 477 },
//   { x: 127, y: 118 },
//   { x: 130, y: 196 },
//   { x: 147, y: 213 },
//   { x: 161, y: 617 },
//   { x: 163, y: 357 },
//   { x: 204, y: 601 },
//   { x: 238, y: 313 },
//   { x: 245, y: 246 },
//   { x: 275, y: 593 },
//   { x: 421, y: 377 },
//   { x: 425, y: 461 },
//   { x: 430, y: 536 },
//   { x: 456, y: 154 },
//   { x: 534, y: 286 },
//   { x: 539, y: 340 },
//   { x: 542, y: 313 },
//   { x: 550, y: 124 },
//   { x: 577, y: 545 },
//   { x: 601, y: 504 },
//   { x: 611, y: 578 },
//   { x: 612, y: 644 },
//   { x: 620, y: 29 },
//   { x: 627, y: 373 },
//   { x: 664, y: 190 },
//   { x: 700, y: 47 },
//   { x: 704, y: 104 },
//   { x: 742, y: 170 },
//   { x: 794, y: 328 },
//   { x: 808, y: 49 },
//   { x: 844, y: 294 },
//   { x: 847, y: 523 },
//   { x: 855, y: 139 },
//   { x: 860, y: 466 },
//   { x: 863, y: 35 },
//   { x: 864, y: 125 } ]

// var data3 = [ { x: 620, y: 29 },
//   { x: 863, y: 35 },
//   { x: 700, y: 47 },
//   { x: 808, y: 49 },
//   { x: 16, y: 97 },
//   { x: 704, y: 104 },
//   { x: 127, y: 118 },
//   { x: 550, y: 124 },
//   { x: 864, y: 125 },
//   { x: 855, y: 139 },
//   { x: 456, y: 154 },
//   { x: 742, y: 170 },
//   { x: 664, y: 190 },
//   { x: 130, y: 196 },
//   { x: 147, y: 213 },
//   { x: 245, y: 246 },
//   { x: 534, y: 286 },
//   { x: 844, y: 294 },
//   { x: 238, y: 313 },
//   { x: 542, y: 313 },
//   { x: 794, y: 328 },
//   { x: 539, y: 340 },
//   { x: 163, y: 357 },
//   { x: 627, y: 373 },
//   { x: 421, y: 377 },
//   { x: 116, y: 404 },
//   { x: 425, y: 461 },
//   { x: 860, y: 466 },
//   { x: 120, y: 477 },
//   { x: 601, y: 504 },
//   { x: 847, y: 523 },
//   { x: 430, y: 536 },
//   { x: 114, y: 544 },
//   { x: 577, y: 545 },
//   { x: 57, y: 572 },
//   { x: 611, y: 578 },
//   { x: 275, y: 593 },
//   { x: 204, y: 601 },
//   { x: 161, y: 617 },
//   { x: 612, y: 644 } ]

