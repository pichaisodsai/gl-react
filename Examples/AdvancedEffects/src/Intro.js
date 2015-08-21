const React = require("react");
const GL = require("gl-react");
const {Surface,Layer,Text,Group} = require("react-canvas");

const shaders = GL.Shaders.create({
  drunkEffect: {
    frag: `
precision highp float;
varying vec2 uv;

uniform float time;
uniform float amp;
uniform float freq;
uniform float colorSeparation;
uniform sampler2D texture;
uniform float moving;

vec2 lookup (vec2 offset) {
  return mod(
    uv + amp * vec2(cos(freq*(uv.x+offset.x)+time),sin(freq*(uv.y+offset.x)+time)) + vec2(moving * time/10.0, 0.0),
    vec2(1.0));
}

void main() {
  vec3 col = vec3(
  texture2D(texture, lookup(vec2(colorSeparation))).r,
  texture2D(texture, lookup(vec2(-colorSeparation))).g,
  texture2D(texture, lookup(vec2(0.0))).b);
  gl_FragColor = vec4(
    col,
    pow((col.x + col.y + col.z) / 3.0, 0.05));
}
`
  }
});

class Intro extends React.Component {
  render () {
    const { time, fps, width, height } = this.props;
    const w = (width-20)/3;
    return <GL.View
      shader={shaders.drunkEffect}
      width={width}
      height={height}
      opaque={false}
      uniforms={{
        time: time,
        freq: 20 - 14 * Math.sin(time / 7),
        amp: 0.05 - 0.03 * Math.cos(time / 4),
        colorSeparation: 0.02,
        moving: 1
      }}>
      <GL.Target uniform="texture">
        <Surface width={width} height={height} left={0} top={0} enableCSSLayout={true}>
          <Group style={{ width: width, height: height, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ width: width, height: height/2, color: "#00BDF3", fontSize: 32, letterSpacing: -1.0 }}>
              GL REACT
            </Text>
            <Group style={{ width: width, height: height/2, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <Layer style={{ backgroundColor: "#00FF66", marginRight: 8, width: 14, height: 14, borderRadius: 7, opacity: time%1 < 0.6 ? 1 : 0 }} />
              <Text style={{ width: w, height: 20, color: "#00FF66", fontSize: 14 }}>
                {time.toFixed(2)}s
              </Text>
              <Text style={{ width: w, height: 20, color: "#fff", fontSize: 14 }}>
                {(fps).toFixed(0)} fps
              </Text>
              <Text style={{ width: w, height: 20, color: "#999", fontSize: 14 }}>
                {"<Text />"}
              </Text>
            </Group>
          </Group>
        </Surface>
      </GL.Target>
    </GL.View>;
  }
  draw () {
    /*
    const {time, fps} = this.props;
    const ctx = this.ctx;
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    let x, y;

    x = width / 2;
    y = height / 2 - 20;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.font = "normal 80px Verdana";
    ctx.fillStyle = "#00BDF3";
    ctx.fillText("GL REACT", x, y);

    x = 20;
    y = height - 40;

    ctx.font = "normal 28px Verdana";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    if (time%1 < 0.6) {
      ctx.fillStyle = "#00FF66";
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2*Math.PI);
      ctx.fill();
    }

    x += 26;

    ctx.fillStyle = "#00FF66";
    ctx.fillText(time.toFixed(2)+"s", x, y);

    x += width/5;

    ctx.fillStyle = "#fff";
    ctx.fillText(fps.toFixed(0)+" fps", x, y);

    x += width/5;

    ctx.fillStyle = "#999";
    ctx.fillText("text drawn with <canvas/>", x, y);
    */
  }
}

module.exports = Intro;
