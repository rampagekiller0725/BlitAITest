const stringMath = require("string-math");

export const parseToken = (token: string) => {
  if (token !== "") {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => {
          const base = `00${c.charCodeAt(0).toString(16)}`;
          return `%${base.slice(-2)}`;
        })
        .join("")
    );
    return JSON.parse(payload);
  }
  return "";
};

export const isExpiredToken = (tokenData: any) => {
  if (Math.floor(Date.now() / 1000) >= tokenData.exp) {
    return true;
  }
  return false;
};

interface Parameter {
  name: string;
  expression: string;
  value: string;
  description: string;
}
export const isParameter = (val: string, parameters: Array<Parameter>) => {
  let flag: boolean = false;
  parameters.map((parameter) => {
    if (parameter.name === val) flag = true;
  });

  if (flag) return true;
  flag = true;
  for (let i = 0; i < val.length; i++) {
    if (
      !(
        val[i] === "+" ||
        val[i] === "-" ||
        val[i] === "*" ||
        val[i] === "/" ||
        val[i] === "(" ||
        val[i] === ")" ||
        val[i] === "^" ||
        val[i] === "%" ||
        val[i] === "." ||
        (val[i] >= "0" && val[i] <= "9")
      )
    ) {
      return false;
    }
  }
  return flag;
};

export const calculate = (val: string, parameters: Array<Parameter>) => {
  const breakPoint = /\+|\-|\*|\/|\(|\)|\^|\%/;
  let mathmaticalSymbols: Array<string> = [];
  for (let i = 0; i < val.length; i++) {
    if (
      val[i] === "+" ||
      val[i] === "-" ||
      val[i] === "*" ||
      val[i] === "/" ||
      val[i] === "(" ||
      val[i] === ")" ||
      val[i] === "^" ||
      val[i] === "%"
    )
      mathmaticalSymbols.push(val[i]);
  }

  const words = val.toString().split(breakPoint);
  console.log(words);
  let resString: string = "";
  words.map((word: string, index: number) => {
    let cnt = 0;
    parameters.map((parameter) => {
      if (word === parameter.name) {
        resString += parameter.value;
        return;
      }
      cnt++;
    });
    if (cnt === parameters.length) resString += word;
    if (mathmaticalSymbols[index] != undefined)
      resString += mathmaticalSymbols[index];
  });

  return stringMath(resString);
};

export const getVertices = (mesh: any) => {
  if (!mesh) {
    return;
  }
  var piv = mesh.getPivotPoint();
  var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  if (!positions) {
    return;
  }
  var numberOfPoints = positions.length / 3;

  var level = false;
  var map = [];
  var poLoc = [];
  var poGlob = [];
  for (var i = 0; i < numberOfPoints; i++) {
    var p = new BABYLON.Vector3(
      positions[i * 3],
      positions[i * 3 + 1],
      positions[i * 3 + 2]
    );
    var found = false;
    for (var index = 0; index < map.length && !found; index++) {
      var array: any = map[index];
      var p0 = array[0];
      if (p0.equals(p) || p0.subtract(p).lengthSquared() < 0.00001) {
        found = true;
      }
    }
    if (!found) {
      var array: any = [];
      poLoc.push(p.subtract(piv));
      poGlob.push(
        BABYLON.Vector3.TransformCoordinates(p, mesh.getWorldMatrix())
      );
      array.push(p);
      map.push(array);
    }
  }
  return { local: poLoc, global: poGlob, pivot: piv };
};
