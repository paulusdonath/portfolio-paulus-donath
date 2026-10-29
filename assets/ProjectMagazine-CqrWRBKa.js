const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/detailScene.engine-hjeBk-UV.js","assets/index-B5OKCXLn.js","assets/index-Jzv80JSk.css","assets/three.module-0mrRDaRL.js"])))=>i.map(i=>d[i]);
import{_ as e,c as t,f as n,g as r,u as i,v as a,y as o}from"./index-B5OKCXLn.js";import{a as s,c,d as l,f as u,i as d,l as f,n as p,o as m,p as h,s as g,t as _,u as v}from"./three.module-0mrRDaRL.js";var y=o(a(),1),b={widthRatio:.18,mobileWidthRatio:.46,mobileOffsetY:.06,sectionRatio:.6,maxHeightRatio:.3,aspect:3/2,centerGap:1.45,visiblePerSide:5,edgeFit:1,minSlots:22,tiltX:.55,turnY:-.3,depth:110,depthFront:60,wheelSpeed:.0016,touchSpeed:.005,scrollEase:.085,bendStrength:1e3,bendEase:.12,maxBend:80,centerPush:.3,edgePull:.7,cornerPull:.6,flutter:.12,scrollBump:!1,scrollBumpStrength:.9,followDistance:18,followEase:.06,hoverStrength:1.1,maxHover:40,activeScale:.4,grayDistance:1.4,focal:650,hoverEase:.08,hoverDecay:.92,introStagger:.45,segments:40},x=`
  uniform float uBend;        // Scroll-Verformung in px (mit Vorzeichen)
  uniform vec2 uMouse;        // Mausposition auf dem Blatt (0–1)
  uniform float uHover;       // Wölbung zur Maus hin in px
  uniform vec2 uSize;         // Blattgröße in px
  uniform float uCenterPush;  // Mitte nach vorn
  uniform float uEdgePull;    // Ränder nach hinten
  uniform float uCornerPull;  // Ecken zusätzlich nach hinten
  uniform float uFlutter;     // Flattern
  uniform float uBump;        // 1 = Scroll-Verformung wie der Hover-Effekt
  uniform float uTime;
  uniform float uFocal;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;

    // Taschentuch im Wind: Mitte nur leicht vor, Ränder und Ecken deutlicher zurück
    float ex = pow(uv.x * 2.0 - 1.0, 2.0);
    float ey = pow(uv.y * 2.0 - 1.0, 2.0);
    float center = (1.0 - ex) * (1.0 - ey);
    float edge = max(ex, ey);
    float corner = ex * ey;
    float wind = uCenterPush * center - uEdgePull * edge - uCornerPull * corner;

    // leichtes Flattern, vor allem an den Rändern – nur solange gescrollt wird
    float flutter = sin(uv.x * 7.0 + uv.y * 3.0 + uTime * 9.0) * uFlutter * edge;

    if (uBump > 0.5) {
      // wie der Hover: weiche Wölbung nach vorn, leicht in Scrollrichtung verschoben
      vec2 bumpCenter = vec2(0.5, 0.5 - sign(uBend) * 0.18);
      vec2 bd = (uv - bumpCenter) * vec2(uSize.x / uSize.y, 1.0);
      p.z += abs(uBend) * uBump * exp(-dot(bd, bd) * 3.0);
    } else {
      p.z += uBend * (wind + flutter);
    }

    // Wölbung zur Maus hin
    vec2 d = (uv - uMouse) * vec2(uSize.x / uSize.y, 1.0);
    p.z += uHover * exp(-dot(d, d) * 5.0);

    // Wölbung sichtbar machen, auch wenn die Karte gerade von vorn steht
    p.xy *= 1.0 + p.z / uFocal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`,S=`
  uniform sampler2D uTexture;
  uniform vec2 uImageRes;
  uniform vec2 uSize;
  uniform float uOpacity;
  uniform float uGray;
  varying vec2 vUv;

  void main() {
    // object-fit: cover – reines Bild, ohne Licht oder Glanz
    float planeAspect = uSize.x / uSize.y;
    float imageAspect = uImageRes.x / uImageRes.y;
    vec2 scale = planeAspect > imageAspect
      ? vec2(1.0, imageAspect / planeAspect)
      : vec2(planeAspect / imageAspect, 1.0);
    vec4 color = texture2D(uTexture, (vUv - 0.5) * scale + 0.5);
    // nur die aktive Karte in voller Farbe
    float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    color.rgb = mix(color.rgb, vec3(luma), uGray);
    gl_FragColor = vec4(color.rgb, color.a * uOpacity);
    // richtige Farben (sRGB) – sonst wirken die Bilder zu dunkel
    #include <colorspace_fragment>
  }
`;function C(e,{images:t,onActiveChange:n,onSelect:r,getDetailRect:i,config:a={}}){let o={...b,...a},y=t.length,C=Math.max(y,Math.ceil(o.minSlots/y)*y),w=new _({canvas:e,antialias:!0,alpha:!0});w.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),w.outputColorSpace=f;let T=new v,E=new g(-1,1,1,-1,-5e3,5e3),D=new p;T.add(D);let O=0,k=0,A=0,j=0,ee=0,te=new u,M=new Map,N=Array.from({length:C},(e,n)=>t[n%y]).map(e=>{let t={uTexture:{value:null},uImageRes:{value:new h(3,2)},uSize:{value:new h(1,1)},uBend:{value:0},uMouse:{value:new h(.5,.5)},uHover:{value:0},uOpacity:{value:0},uCenterPush:{value:o.centerPush},uEdgePull:{value:o.edgePull},uCornerPull:{value:o.cornerPull},uFlutter:{value:o.flutter},uBump:{value:o.scrollBump?o.scrollBumpStrength:0},uTime:{value:0},uFocal:{value:o.focal},uGray:{value:1}},n=new l({uniforms:t,vertexShader:x,fragmentShader:S,transparent:!0,side:2});M.has(e)||M.set(e,new Promise(t=>te.load(e,e=>{e.colorSpace=f,e.minFilter=d,e.anisotropy=w.capabilities.getMaxAnisotropy(),t(e)}))),M.get(e).then(e=>{t.uTexture.value=e,t.uImageRes.value.set(e.image.width,e.image.height),t.uOpacity.value=1});let r=new m(new c(1,1,o.segments,o.segments),n);return D.add(r),{mesh:r,uniforms:t,follow:new h,hover:0}});function P(){let t=e.getBoundingClientRect();O=t.width,k=t.height,w.setSize(O,k,!1),E.left=-O/2,E.right=O/2,E.top=k/2,E.bottom=-k/2,E.position.z=1e3,E.updateProjectionMatrix(),F.set(O*o.sectionRatio,k).normalize(),A=Math.min(O*o.widthRatio,k*o.maxHeightRatio*o.aspect),ee=O<768?-k*o.mobileOffsetY:0,O<768&&(A=Math.min(O*o.mobileWidthRatio,k*o.maxHeightRatio*o.aspect)),j=A/o.aspect;for(let e of N)e.mesh.geometry.dispose(),e.mesh.geometry=new c(A,j,o.segments,o.segments),e.uniforms.uSize.value.set(A,j)}function ne(e){let t=Math.abs(e),n=A*o.centerGap,r=Math.min(O/2/F.x,k/2/F.y),i=Math.max(A*.12,(r*o.edgeFit-n)/Math.max(1,o.visiblePerSide-1)),a=t<=1?n*t:n+i*(t-1);return Math.sign(e)*a}let F=new h(1,1).normalize(),I=e=>e*e*(3-2*e),L={target:0,current:0,velocity:0},R=0,z=0,B=-1,V={p:0},H=0,U=()=>V.p===0&&Q.p>=1,W=e=>{e.preventDefault(),U()&&(L.target+=e.deltaY*o.wheelSpeed)},G=null,K=t=>{if(!U()||!G)return;let n=e.getBoundingClientRect(),i=t.clientX-n.left,a=t.clientY-n.top,o=G;i>=o.left&&i<=o.right&&a>=o.top&&a<=o.bottom&&r?.(B%y)},q=null,J=e=>{q=e.touches[0].clientY},Y=e=>{if(q===null||!U())return;let t=e.touches[0].clientY;L.target-=(q-t)*o.touchSpeed,q=t},re=()=>{q=null},X={x:O/2,y:k/2,speed:0,active:!1},Z=null,ie=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;Z&&(X.speed=Math.max(X.speed,Math.hypot(r-Z.x,i-Z.y))),Z={x:r,y:i},X.x=r,X.y=i,X.active=!0},ae=()=>{X.active=!1,Z=null},Q={p:1,mode:`enter`},oe=e=>1-(1-e)**3,se=e=>e*e*e,$=0,ce=1;function le(){let t=L.current;L.current+=(L.target-L.current)*o.scrollEase,L.velocity=L.current-t;let r=(Q.p-ce)*1.4,a=s.clamp((V.p-H)*1.2*o.bendStrength,-o.maxBend,o.maxBend);z+=(a-z)*o.bendEase,ce=Q.p,H=V.p;let c=s.clamp((L.velocity+r)*o.bendStrength,-o.maxBend,o.maxBend);R+=(c-R)*o.bendEase,X.speed*=o.hoverDecay;let l=0,u=1/0;N.forEach((t,n)=>{let r=n-L.current;r=((r+C/2)%C+C)%C-C/2;let a=Math.abs(r),{mesh:c,uniforms:d}=t,f=ne(r),p=I(Math.min(a,1));if(Q.p<1||Q.mode===`leave`){let e=s.clamp((r+4)/8,0,1),t=o.introStagger,n=s.clamp(Q.p*(1+t)-t*e,0,1),i=Math.hypot(O,k)*.75;if(Q.mode===`enter`){let e=oe(n);f=s.lerp(i+r*A*.05,f,e),p=s.lerp(1,p,e)}else{let e=se(n);f=s.lerp(f,-i+r*A*.05,e),p=s.lerp(p,1,e)}}let m=a<.5;V.p>0&&!m&&(f+=Math.sign(r)*se(V.p)*Math.hypot(O,k)*.8);let h=r>0?-r*o.depth:-r*o.depthFront;c.position.set(F.x*f,F.y*f+ee,h),c.rotation.set(o.tiltX*p,o.turnY*p,0);let g=1+o.activeScale*(1-I(Math.min(a,1)));if(c.scale.setScalar(g),d.uGray.value=I(Math.min(1,a/o.grayDistance)),V.p>0&&m&&i){let e=i(),t=V.p,n=e.left+e.width/2-O/2,r=k/2-(e.top+e.height/2);c.position.x=s.lerp(c.position.x,n,t),c.position.y=s.lerp(c.position.y,r,t),c.position.z=50,c.scale.setScalar(s.lerp(g,e.width/A,t)),d.uGray.value=0}c.renderOrder=Math.round(-r*10),d.uBend.value=R+(r>0?-z:z),d.uTime.value=performance.now()/1e3,a<u&&(u=a,l=n);let _=a<.5&&V.p===0,v=X.active?(X.x-O/2)/(O/2):0,y=X.active?-(X.y-k/2)/(k/2):0,b=_?v*o.followDistance:0,x=_?y*o.followDistance:0;t.follow.x+=(b-t.follow.x)*o.followEase,t.follow.y+=(x-t.follow.y)*o.followEase,c.position.x+=t.follow.x,c.position.y+=t.follow.y;let S=_&&X.active?Math.min(X.speed*o.hoverStrength,o.maxHover):0;if(t.hover+=(S-t.hover)*o.hoverEase,d.uHover.value=t.hover,a<.5){let t=A*c.scale.x/2,n=j*c.scale.y/2;G={left:O/2+c.position.x-t,right:O/2+c.position.x+t,top:k/2-c.position.y-n,bottom:k/2-c.position.y+n},e.style.cursor=U()&&X.active&&X.x>=G.left&&X.x<=G.right&&X.y>=G.top&&X.y<=G.bottom?`pointer`:``}if(_&&X.active){let e=s.clamp((X.x-O/2-c.position.x)/(A*c.scale.x)+.5,-.2,1.2),t=s.clamp(-(X.y-k/2+c.position.y)/(j*c.scale.y)+.5,-.2,1.2);d.uMouse.value.x+=(e-d.uMouse.value.x)*.15,d.uMouse.value.y+=(t-d.uMouse.value.y)*.15}}),l!==B&&(B=l,n?.(l%y)),w.render(T,E),$=requestAnimationFrame(le)}return P(),window.addEventListener(`resize`,P),e.addEventListener(`wheel`,W,{passive:!1}),e.addEventListener(`click`,K),e.addEventListener(`touchstart`,J,{passive:!0}),e.addEventListener(`touchmove`,Y,{passive:!0}),e.addEventListener(`touchend`,re),window.addEventListener(`pointermove`,ie,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,ae),$=requestAnimationFrame(le),{intro:Q,detail:V,get height(){return k},scrollTo(e){L.target=L.current=e},destroy(){cancelAnimationFrame($),window.removeEventListener(`resize`,P),e.removeEventListener(`wheel`,W),e.removeEventListener(`click`,K),e.removeEventListener(`touchstart`,J),e.removeEventListener(`touchmove`,Y),e.removeEventListener(`touchend`,re),window.removeEventListener(`pointermove`,ie),document.documentElement.removeEventListener(`pointerleave`,ae);for(let e of N)e.mesh.geometry.dispose(),e.mesh.material.dispose();M.forEach(e=>e.then(e=>e.dispose())),w.dispose()}}}var w=r(),T={key:``,gutter:20,gap:24,micro:10};function E(e,n=!1){let r=window.innerWidth,i=window.innerHeight,a=`${window.innerWidth}x${window.innerHeight}`;T.key!==a&&(T={key:a,gutter:t(e,`--gutter`,20),gap:t(e,`--gap`,24),micro:t(e,`--fs-micro`,10)});let{gutter:o,gap:s,micro:c}=T,l=r<=1e3,u=l?r-2*o:(r-2*o-4*s)*.6+2*s,d=u*2/3,f=c*1.7+c*.56+(n?c*3.4:0),p=l?i*.3+f:i/2+i*.06-d/2;return{left:(r-u)/2,top:p,width:u,height:d}}function D({projects:t,startIndex:r=0,leaving:a=!1,detailStatus:o=`closed`,hidden:s=!1,onActiveChange:c,onSelect:l,onDetailOpened:u,onDetailClosed:d,onLeft:f,onFailed:p}){let m=(0,y.useRef)(null),h=(0,y.useRef)(null),g=(0,y.useRef)(null),_=(0,y.useEffectEvent)(e=>c?.(e)),v=(0,y.useRef)(0),b=(0,y.useEffectEvent)(e=>{v.current=e,l?.(e)}),x=(0,y.useEffectEvent)(()=>f?.()),S=(0,y.useEffectEvent)(()=>u?.()),T=(0,y.useEffectEvent)(()=>d?.()),D=(0,y.useEffectEvent)(()=>p?.());return(0,y.useEffect)(()=>{let a=m.current,o;try{o=C(h.current,{images:t.map(e=>e.thumb??e.image),onActiveChange:_,onSelect:b,getDetailRect:()=>E(a,!!t[v.current]?.liveUrl)})}catch{D();return}return o.scrollTo(r),e(()=>import(`./detailScene.engine-hjeBk-UV.js`),__vite__mapDeps([0,1,2,3])),o.intro.mode=`enter`,o.intro.p=0,n.to(o.intro,{p:1,duration:i.enter,ease:`none`,delay:i.enterDelay}),g.current=o,()=>{n.killTweensOf(o.intro),n.killTweensOf(o.detail),o.destroy(),g.current=null}},[t]),(0,y.useEffect)(()=>{let e=g.current;if(!a||!e)return;n.killTweensOf(e.intro);let t=e.detail.p>0?i.detailClose:0,r=n.timeline({delay:t}).call(()=>{e.intro.mode=`leave`,e.intro.p=0}).to(e.intro,{p:1,duration:i.leave,ease:`none`}).call(x,null,`+=${i.afterLeave}`);return()=>r.kill()},[a]),(0,y.useEffect)(()=>{let e=g.current;if(e){if(o===`opening`){let t=n.to(e.detail,{p:1,duration:i.detailOpen,ease:`power3.inOut`,onComplete:S});return()=>t.kill()}if(o===`closing`){let t=n.to(e.detail,{p:0,duration:i.detailClose,ease:`power3.inOut`,onComplete:T});return()=>t.kill()}}},[o]),(0,w.jsx)(`section`,{ref:m,className:`project-magazine${s?` is-hidden`:``}`,"aria-label":`Projekte – Magazine`,children:(0,w.jsx)(`canvas`,{ref:h,className:`project-magazine__canvas`})})}export{D as default};