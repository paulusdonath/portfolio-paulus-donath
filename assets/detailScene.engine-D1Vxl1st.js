import{c as e,d as t,f as n,l as r,m as i,o as a,p as o,r as s,s as c,t as l,u}from"./three.module-0mrRDaRL.js";var d=`
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
`,f=`
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
`,p={distortion:.2,maxDistortion:18,ease:.14,trail:.35,introDuration:1.2,introStagger:.08,introDistortion:.5};function m(m,{getScrollTop:h,onReady:g,config:_={}}={}){let v={...p,..._},y=new l({canvas:m,antialias:!0,alpha:!0});y.outputColorSpace=r,y.setPixelRatio(Math.min(window.devicePixelRatio||1,2));let b=new u,x=new c(-1,1,1,-1,-10,10),S=new e(1,1,32,32),C=0,w=0,T=!1;function E(){C=window.innerWidth,w=window.innerHeight,y.setSize(C,w,!1),x.left=-C/2,x.right=C/2,x.top=w/2,x.bottom=-w/2,x.updateProjectionMatrix()}let D=new Map;function O(e){if(D.has(e.src))return D.get(e.src);let t={texture:null,video:null,size:new o(1,1),loaded:!1};if(e.type===`video`){let n=document.createElement(`video`);Object.assign(n,{src:e.src,muted:!0,loop:!0,playsInline:!0,preload:`metadata`}),n.addEventListener(`loadeddata`,()=>{t.size.set(n.videoWidth,n.videoHeight),t.loaded=!0}),t.video=n,t.texture=new i(n),t.texture.colorSpace=r}else new n().load(e.src,e=>{e.colorSpace=r,e.minFilter=s,e.generateMipmaps=!1,t.texture=e,t.size.set(e.image.width,e.image.height),t.loaded=!0});return D.set(e.src,t),t}let k=new Set;function A(e,n,r){let i=O(n),s={uTexture:{value:null},uImageSize:{value:i.size},uPlaneSize:{value:new o(1,1)},uDelta:{value:0},uTrail:{value:v.trail},uVideo:{value:+(n.type===`video`)}},c=new t({vertexShader:d,fragmentShader:f,uniforms:s,transparent:!0,depthTest:!1}),l=new a(S,c);l.visible=!1,b.add(l);let u={element:e,entry:i,mesh:l,uniforms:s,order:r};return k.add(u),()=>{k.delete(u),b.remove(l),c.dispose()}}let j=h?.()??0,M=e=>Math.max(-v.maxDistortion,Math.min(v.maxDistortion,e)),N=0,P=0,F=e=>1-(1-e)**4;function I(e){P||=e;let t=h?.()??0;j+=(t-j)*v.ease;let n=M((t-j)*v.distortion),r=new Set;for(let t of k){let{element:i,entry:a,mesh:o,uniforms:s}=t,c=i.getBoundingClientRect(),l=c.bottom>-w*.5&&c.top<w*1.5&&c.width>0&&a.loaded;if(o.visible=l,!l)continue;a.video&&r.add(a.video);let u=0,d=0;if(t.order>0){let n=Math.min(1,Math.max(0,((e-P)/1e3-(t.order-1)*v.introStagger)/v.introDuration));u=(1-F(n))*w,d=t.lastOffset==null?0:(t.lastOffset-u)*v.introDistortion,t.lastOffset=u}s.uTexture.value=a.texture,s.uPlaneSize.value.set(c.width,c.height),s.uDelta.value=M(n+d),o.scale.set(c.width,c.height,1),o.position.set(c.left+c.width/2-C/2,w/2-(c.top+c.height/2)-u,0)}for(let e of D.values())e.video&&(r.has(e.video)?e.video.paused&&e.video.play().catch(()=>{}):e.video.paused||e.video.pause());y.render(b,x),!T&&[...k].some(e=>e.order===0&&e.mesh.visible)&&(T=!0,g?.()),N=requestAnimationFrame(I)}return E(),window.addEventListener(`resize`,E),N=requestAnimationFrame(I),{register:A,destroy(){cancelAnimationFrame(N),window.removeEventListener(`resize`,E);for(let e of D.values())e.video?.pause(),e.video&&e.video.removeAttribute(`src`),e.texture?.dispose();S.dispose(),y.dispose()}}}export{m as createDetailScene};