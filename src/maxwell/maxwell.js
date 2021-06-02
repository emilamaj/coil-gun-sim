import Vector from 

const pi = 3.1415926535;
const µ0 = 4 * pi * 0.0000001;
const sigma = 0.00000008; // 7~9*10^-8 ohm*m

//This solver is for axisymmetric problems
//the projectile goes from 0 to +X axis

//To avoid floating point rounding issues, space coordinates are integer numbers

const h = 0.001; //Internal integer coordinates to meters conversion factor



//B Field by dl
// Q is a point of the circuit geometry, T is the tangent displacement dL à Q
// geometryList contains [ {Q:{x,y,z}, Tangent:{x,y,z}}]
// reduction point P_Point{x,y,z}
function BiotSavart(geometryList, evaluationPoints, intensity) {
  let BList, B, dB;
  for (let P of evaluationPoints) {
    //Copy the array
    B = Vector.zero;

    for (let elem of geometryList) {
      let dist = Norm(Sub(P, elem.Q));
      // µ0/4pi = 10e-7 = 0.0000001
      //Sub(P,Q) has norm 'dist' so divide by dist**3
      dB = Mul(
        (0.0000001 * intensity) / dist ** 3,
        Cross(elem.T, Sub(P, elem.Q))
      );
      B = Add(B, dB);
    }
    BList.push({ ...B });
  }
  return BList;
}

//E in B Field

//Coil Resistance

//Coil B Field

//Coil L

//Coil A induced I in Coil B

export { BiotSavart };
