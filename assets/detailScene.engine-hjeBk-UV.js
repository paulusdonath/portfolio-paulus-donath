import{n as e,t}from"./index-B5OKCXLn.js";import{c as n,d as r,f as i,l as a,m as o,o as s,p as c,r as l,s as u,t as d,u as f}from"./three.module-0mrRDaRL.js";var p=`
  varying vec2 vUv;
  uniform float uDelta;   // Scroll-Versatz in px (positiv = Bilder rutschen nach oben)
  uniform float uTrail;   // Anteil, mit dem die hintere Kante mitgeht (0–1)
  uniform vec2 uPlaneSize; // Bildgröße in px (die Fläche ist 1 × 1 und wird skaliert)
  const float PI = 3.141592653589793;

  void main() {
    vUv = uv;
    vec3 p = position;
    // vordere Kante in Zugrichtung (oben beim Hochrutschen, unten beim Runterrutschen)
    float front = uDelta > 0.0 ? uv.y : 1.0 - uv.y;
    float weight = mix(uTrail, 1.0, front);
    // Mitte jeder Kante am stärksten, Ecken bleiben fast fest
    // Versatz in px → in Flächen-Einheiten umrechnen
    p.y += sin(uv.x * PI) * uDelta * weight / uPlaneSize.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`,m=`
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uImageSize;
  uniform vec2 uPlaneSize;
  uniform float uVideo;

  // Videos liefert three.js unkonvertiert (sRGB) – erst in Linear umrechnen,
  // sonst wird am Ende doppelt aufgehellt und die Farben wirken blass
  vec3 srgbToLinear(vec3 c) {
    return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
  }

  void main() {
    // object-fit: cover
    float planeAspect = uPlaneSize.x / uPlaneSize.y;
    float imageAspect = uImageSize.x / uImageSize.y;
    vec2 s = vec2(1.0);
    if (planeAspect > imageAspect) s.y = imageAspect / planeAspect;
    else s.x = planeAspect / imageAspect;
    vec4 color = texture2D(uTexture, (vUv - 0.5) * s + 0.5);
    if (uVideo > 0.5) color.rgb = srgbToLinear(color.rgb);
    gl_FragColor = color;
    #include <colorspace_fragment>
  }
`,h={distortion:.32,maxDistortion:28,mobileDistortion:.16,mobileMaxDistortion:14,ease:.14,trail:.35,introDuration:1.2,introDelay:.3,introStagger:.08,introDistortion:.5};function g(g,{getScrollTop:_,onReady:v,config:y={}}={}){let b={...h,...y},x=new d({canvas:g,antialias:!0,alpha:!0});x.outputColorSpace=a,x.setPixelRatio(Math.min(window.devicePixelRatio||1,2));let S=new f,C=new u(-1,1,1,-1,-10,10),w=new n(1,1,32,32),T=0,E=0,D=!1;function O(){T=window.innerWidth,E=window.innerHeight,x.setSize(T,E,!1),C.left=-T/2,C.right=T/2,C.top=E/2,C.bottom=-E/2,C.updateProjectionMatrix()}let k=new Map;function A(n){let r=e(n.src);if(k.has(r))return k.get(r);let s={texture:null,video:null,size:new c(1,1),loaded:!1};if(n.type===`video`){let e=t(n.src);e.addEventListener(`loadeddata`,()=>{s.size.set(e.videoWidth,e.videoHeight),s.loaded=!0}),s.video=e,s.texture=new o(e),s.texture.colorSpace=a}else new i().load(n.src,e=>{e.colorSpace=a,e.minFilter=l,e.generateMipmaps=!1,s.texture=e,s.size.set(e.image.width,e.image.height),s.loaded=!0});return k.set(r,s),s}let j=new Set;function M(e,t,n){let i=A(t),a={uTexture:{value:null},uImageSize:{value:i.size},uPlaneSize:{value:new c(1,1)},uDelta:{value:0},uTrail:{value:b.trail},uVideo:{value:+(t.type===`video`)}},o=new r({vertexShader:p,fragmentShader:m,uniforms:a,transparent:!0,depthTest:!1}),l=new s(w,o);l.visible=!1,S.add(l);let u=t.type===`video`,d={element:e,entry:i,mesh:l,uniforms:a,order:n,isVideo:u,aspectSet:!u};return j.add(d),()=>{j.delete(d),S.remove(l),o.dispose()}}let N=_?.()??0,P=()=>window.innerWidth<768,F=e=>{let t=P()?b.mobileMaxDistortion:b.maxDistortion;return Math.max(-t,Math.min(t,e))},I=0,L=0,R=e=>1-(1-e)**4;function z(e){L||=e;let t=_?.()??0;N+=(t-N)*b.ease;let n=F((t-N)*(P()?b.mobileDistortion:b.distortion)),r=new Set;for(let t of j){let{element:i,entry:a,mesh:o,uniforms:s}=t;!t.aspectSet&&a.loaded&&(i.style.aspectRatio=`${a.size.x} / ${a.size.y}`,t.aspectSet=!0);let c=i.getBoundingClientRect(),l=c.bottom>-E*.5&&c.top<E*1.5&&c.width>0&&a.loaded;if(o.visible=l,!l)continue;a.video&&r.add(a.video);let u=0,d=0;if(t.order>0){!t.introAt&&a.loaded&&(t.introAt=Math.max(e,L+(b.introDelay+(t.order-1)*b.introStagger)*1e3));let n=t.introAt?Math.min(1,Math.max(0,(e-t.introAt)/1e3/b.introDuration)):0;u=(1-R(n))*E,d=t.lastOffset==null?0:(t.lastOffset-u)*b.introDistortion,t.lastOffset=u}s.uTexture.value=a.texture,s.uPlaneSize.value.set(c.width,c.height),s.uDelta.value=F(n+d),o.scale.set(c.width,c.height,1),o.position.set(c.left+c.width/2-T/2,E/2-(c.top+c.height/2)-u,0)}for(let e of k.values())e.video&&(r.has(e.video)?e.video.paused&&e.video.play().catch(()=>{}):e.video.paused||e.video.pause());x.render(S,C),!D&&[...j].some(e=>e.order===0&&e.mesh.visible)&&(D=!0,v?.()),I=requestAnimationFrame(z)}return O(),window.addEventListener(`resize`,O),I=requestAnimationFrame(z),{register:M,destroy(){cancelAnimationFrame(I),window.removeEventListener(`resize`,O);for(let e of k.values())e.video?.pause(),e.video&&(e.video.replaceChildren(),e.video.load()),e.texture?.dispose();w.dispose(),x.dispose()}}}export{h as DETAIL_SCENE_CONFIG,g as createDetailScene};