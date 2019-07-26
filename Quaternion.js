//クォータニオンクラス
class Quaternion {
  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  get ToString() {
      return "("+ this.x +")I+" + "("+ this.y +")J+" + "("+ this.z +")K+" + "("+ this.w +")";
    }

    //vec is Vector
    static AngleAxis(radian, vec) {
      const a = vec.x;
      const b = vec.y;
      const c = vec.z;
      const magnitude = Math.sqrt(a*a + b*b + c*c);
    const t2 = radian*0.5;
    return new Quaternion(
      a*Math.sin(t2) / magnitude,
      b*Math.sin(t2) / magnitude,
      c*Math.sin(t2) / magnitude,
      cos(t2)
    );
  }
}

function QuaternionNormalize(q) {
  const magnitude = Math.sqrt(q.x*q.x + q.y*q.y + q.z*q.z + q.w*q.w);
  return new Quaternion(q.x/magnitude, q.y/magnitude, q.z/magnitude, q.w/magnitude);
}

//p is Quaternion, q is Quaternion
function QuaternionSum(p, q) {
  return new Quaternion (p.x+q.x, p.y+q.y, p.z+q.z, p.w+q.w);
}

//p is Quaternion, q is Quaternion
function QuaternionPlus(p, q) {
  return new Quaternion (p.x-q.x, p.y-q.y, p.z-q.z, p.w-q.w);
}

//p is Quaternion, q is Quaternion
function QuaternionProduct(p, q) {
  return new Quaternion (
    p.x*q.w + p.y*q.z - p.z*q.y + p.w*q.x,
    - p.x*q.z + p.y*q.w + p.z*q.x + p.w*q.y,
    p.x*q.y - p.y*q.x + p.z*q.w + p.w*q.z,
    - p.x*q.x - p.y*q.y - p.z*q.z + p.w*q.w
  );
}

//p is Quaternion
function QuaternionInverse(q) {
  denom =  q.x*q.x + q.y*q.y + q.z*q.z + q.w*q.w;
  return new Quaternion(-q.x/denom, -q.y/denom, -q.z/denom, q.w/denom);
}

//p is Quaternion, v is Vector
function Dot(q, v){
  q1 = QuaternionInverse(q);
  p = new Quaternion(v.x,v.y,v.z,0);
  h1 = QuaternionProduct(q,p);
  h2 = QuaternionProduct(h1,q1);
  return new Vector(h2.x, h2.y, h2.z);
}
