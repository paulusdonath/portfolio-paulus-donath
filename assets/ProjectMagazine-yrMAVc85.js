import{a as e,g as t,h as n,l as r,p as i,s as a}from"./index-CLwrb2ki.js";import{a as o,c as s,d as c,f as l,i as u,l as d,n as f,o as p,p as m,s as h,t as g,u as _}from"./three.module-0mrRDaRL.js";var v=t(n(),1),y={widthRatio:.18,mobileWidthRatio:.46,mobileOffsetY:.06,sectionRatio:.6,maxHeightRatio:.3,aspect:3/2,centerGap:1.45,visiblePerSide:5,edgeFit:1,minSlots:22,tiltX:.55,turnY:-.3,depth:110,depthFront:60,wheelSpeed:.0016,touchSpeed:.005,scrollEase:.085,bendStrength:1e3,bendEase:.12,maxBend:80,centerPush:.3,edgePull:.7,cornerPull:.6,flutter:.12,scrollBump:!0,scrollBumpStrength:.9,followDistance:18,followEase:.06,hoverStrength:1.1,maxHover:40,activeScale:.4,grayDistance:1.4,focal:650,hoverEase:.08,hoverDecay:.92,introStagger:.45,segments:40},b=`
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
`,x=`
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
`;function S(e,{images:t,onActiveChange:n,onSelect:r,getDetailRect:i,config:a={}}){let v={...y,...a},S=t.length,C=Math.max(S,Math.ceil(v.minSlots/S)*S),w=new g({canvas:e,antialias:!0,alpha:!0});w.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),w.outputColorSpace=d;let T=new _,E=new h(-1,1,1,-1,-5e3,5e3),D=new f;T.add(D);let O=0,k=0,A=0,j=0,ee=0,te=new l,M=new Map,N=Array.from({length:C},(e,n)=>t[n%S]).map(e=>{let t={uTexture:{value:null},uImageRes:{value:new m(3,2)},uSize:{value:new m(1,1)},uBend:{value:0},uMouse:{value:new m(.5,.5)},uHover:{value:0},uOpacity:{value:0},uCenterPush:{value:v.centerPush},uEdgePull:{value:v.edgePull},uCornerPull:{value:v.cornerPull},uFlutter:{value:v.flutter},uBump:{value:v.scrollBump?v.scrollBumpStrength:0},uTime:{value:0},uFocal:{value:v.focal},uGray:{value:1}},n=new c({uniforms:t,vertexShader:b,fragmentShader:x,transparent:!0,side:2});M.has(e)||M.set(e,new Promise(t=>te.load(e,e=>{e.colorSpace=d,e.minFilter=u,e.anisotropy=w.capabilities.getMaxAnisotropy(),t(e)}))),M.get(e).then(e=>{t.uTexture.value=e,t.uImageRes.value.set(e.image.width,e.image.height),t.uOpacity.value=1});let r=new p(new s(1,1,v.segments,v.segments),n);return D.add(r),{mesh:r,uniforms:t,follow:new m,hover:0}});function P(){let t=e.getBoundingClientRect();O=t.width,k=t.height,w.setSize(O,k,!1),E.left=-O/2,E.right=O/2,E.top=k/2,E.bottom=-k/2,E.position.z=1e3,E.updateProjectionMatrix(),F.set(O*v.sectionRatio,k).normalize(),A=Math.min(O*v.widthRatio,k*v.maxHeightRatio*v.aspect),ee=O<768?-k*v.mobileOffsetY:0,O<768&&(A=Math.min(O*v.mobileWidthRatio,k*v.maxHeightRatio*v.aspect)),j=A/v.aspect;for(let e of N)e.mesh.geometry.dispose(),e.mesh.geometry=new s(A,j,v.segments,v.segments),e.uniforms.uSize.value.set(A,j)}function ne(e){let t=Math.abs(e),n=A*v.centerGap,r=Math.min(O/2/F.x,k/2/F.y),i=Math.max(A*.12,(r*v.edgeFit-n)/Math.max(1,v.visiblePerSide-1)),a=t<=1?n*t:n+i*(t-1);return Math.sign(e)*a}let F=new m(1,1).normalize(),I=e=>e*e*(3-2*e),L={target:0,current:0,velocity:0},R=0,z=-1,B={p:0},V=0,H=()=>B.p===0&&Q.p>=1,U=e=>{e.preventDefault(),H()&&(L.target+=e.deltaY*v.wheelSpeed)},W=null,G=t=>{if(!H()||!W)return;let n=e.getBoundingClientRect(),i=t.clientX-n.left,a=t.clientY-n.top,o=W;i>=o.left&&i<=o.right&&a>=o.top&&a<=o.bottom&&r?.(z%S)},K=null,q=e=>{K=e.touches[0].clientY},J=e=>{if(K===null||!H())return;let t=e.touches[0].clientY;L.target+=(K-t)*v.touchSpeed,K=t},Y=()=>{K=null},X={x:O/2,y:k/2,speed:0,active:!1},Z=null,re=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;Z&&(X.speed=Math.max(X.speed,Math.hypot(r-Z.x,i-Z.y))),Z={x:r,y:i},X.x=r,X.y=i,X.active=!0},ie=()=>{X.active=!1,Z=null},Q={p:1,mode:`enter`},ae=e=>1-(1-e)**3,oe=e=>e*e*e,$=0,se=1;function ce(){let t=L.current;L.current+=(L.target-L.current)*v.scrollEase,L.velocity=L.current-t;let r=(Q.p-se)*1.4+(B.p-V)*1.2;se=Q.p,V=B.p;let a=o.clamp((L.velocity+r)*v.bendStrength,-v.maxBend,v.maxBend);R+=(a-R)*v.bendEase,X.speed*=v.hoverDecay;let s=0,c=1/0;N.forEach((t,n)=>{let r=n-L.current;r=((r+C/2)%C+C)%C-C/2;let a=Math.abs(r),{mesh:l,uniforms:u}=t,d=ne(r),f=I(Math.min(a,1));if(Q.p<1||Q.mode===`leave`){let e=o.clamp((r+4)/8,0,1),t=v.introStagger,n=o.clamp(Q.p*(1+t)-t*e,0,1),i=Math.hypot(O,k)*.75;if(Q.mode===`enter`){let e=ae(n);d=o.lerp(i+r*A*.05,d,e),f=o.lerp(1,f,e)}else{let e=oe(n);d=o.lerp(d,-i+r*A*.05,e),f=o.lerp(f,1,e)}}let p=a<.5;B.p>0&&!p&&(d+=Math.sign(r)*oe(B.p)*Math.hypot(O,k)*.8);let m=r>0?-r*v.depth:-r*v.depthFront;l.position.set(F.x*d,F.y*d+ee,m),l.rotation.set(v.tiltX*f,v.turnY*f,0);let h=1+v.activeScale*(1-I(Math.min(a,1)));if(l.scale.setScalar(h),u.uGray.value=I(Math.min(1,a/v.grayDistance)),B.p>0&&p&&i){let e=i(),t=B.p,n=e.left+e.width/2-O/2,r=k/2-(e.top+e.height/2);l.position.x=o.lerp(l.position.x,n,t),l.position.y=o.lerp(l.position.y,r,t),l.position.z=50,l.scale.setScalar(o.lerp(h,e.width/A,t)),u.uGray.value=0}l.renderOrder=Math.round(-r*10),u.uBend.value=R,u.uTime.value=performance.now()/1e3,a<c&&(c=a,s=n);let g=a<.5&&B.p===0,_=X.active?(X.x-O/2)/(O/2):0,y=X.active?-(X.y-k/2)/(k/2):0,b=g?_*v.followDistance:0,x=g?y*v.followDistance:0;t.follow.x+=(b-t.follow.x)*v.followEase,t.follow.y+=(x-t.follow.y)*v.followEase,l.position.x+=t.follow.x,l.position.y+=t.follow.y;let S=g&&X.active?Math.min(X.speed*v.hoverStrength,v.maxHover):0;if(t.hover+=(S-t.hover)*v.hoverEase,u.uHover.value=t.hover,a<.5){let t=A*l.scale.x/2,n=j*l.scale.y/2;W={left:O/2+l.position.x-t,right:O/2+l.position.x+t,top:k/2-l.position.y-n,bottom:k/2-l.position.y+n},e.style.cursor=H()&&X.active&&X.x>=W.left&&X.x<=W.right&&X.y>=W.top&&X.y<=W.bottom?`pointer`:``}if(g&&X.active){let e=o.clamp((X.x-O/2-l.position.x)/(A*l.scale.x)+.5,-.2,1.2),t=o.clamp(-(X.y-k/2+l.position.y)/(j*l.scale.y)+.5,-.2,1.2);u.uMouse.value.x+=(e-u.uMouse.value.x)*.15,u.uMouse.value.y+=(t-u.uMouse.value.y)*.15}}),s!==z&&(z=s,n?.(s%S)),w.render(T,E),$=requestAnimationFrame(ce)}return P(),window.addEventListener(`resize`,P),e.addEventListener(`wheel`,U,{passive:!1}),e.addEventListener(`click`,G),e.addEventListener(`touchstart`,q,{passive:!0}),e.addEventListener(`touchmove`,J,{passive:!0}),e.addEventListener(`touchend`,Y),window.addEventListener(`pointermove`,re,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,ie),$=requestAnimationFrame(ce),{intro:Q,detail:B,get height(){return k},scrollTo(e){L.target=L.current=e},destroy(){cancelAnimationFrame($),window.removeEventListener(`resize`,P),e.removeEventListener(`wheel`,U),e.removeEventListener(`click`,G),e.removeEventListener(`touchstart`,q),e.removeEventListener(`touchmove`,J),e.removeEventListener(`touchend`,Y),window.removeEventListener(`pointermove`,re),document.documentElement.removeEventListener(`pointerleave`,ie);for(let e of N)e.mesh.geometry.dispose(),e.mesh.material.dispose();M.forEach(e=>e.then(e=>e.dispose())),w.dispose()}}}var C=i();function w(t){let n=window.innerWidth,r=window.innerHeight,i=e(t,`--gutter`,20),a=e(t,`--gap`,32),o=n<=1e3,s=o?n-2*i:(n-2*i-4*a)*.6+2*a,c=s*2/3,l=o?r*.3+20:r/2+r*.06-c/2;return{left:(n-s)/2,top:l,width:s,height:c}}function T({projects:e,startIndex:t=0,leaving:n=!1,detailStatus:i=`closed`,hidden:o=!1,onActiveChange:s,onSelect:c,onDetailOpened:l,onDetailClosed:u,onLeft:d,onFailed:f}){let p=(0,v.useRef)(null),m=(0,v.useRef)(null),h=(0,v.useRef)(null),g=(0,v.useEffectEvent)(e=>s?.(e)),_=(0,v.useEffectEvent)(e=>c?.(e)),y=(0,v.useEffectEvent)(()=>d?.()),b=(0,v.useEffectEvent)(()=>l?.()),x=(0,v.useEffectEvent)(()=>u?.()),T=(0,v.useEffectEvent)(()=>f?.());return(0,v.useEffect)(()=>{let n=p.current,i;try{i=S(m.current,{images:e.map(e=>e.thumb??e.image),onActiveChange:g,onSelect:_,getDetailRect:()=>w(n)})}catch{T();return}return i.scrollTo(t),i.intro.mode=`enter`,i.intro.p=0,r.to(i.intro,{p:1,duration:a.enter,ease:`none`,delay:a.enterDelay}),h.current=i,()=>{r.killTweensOf(i.intro),r.killTweensOf(i.detail),i.destroy(),h.current=null}},[e]),(0,v.useEffect)(()=>{let e=h.current;if(!n||!e)return;r.killTweensOf(e.intro);let t=e.detail.p>0?a.detailClose:0,i=r.timeline({delay:t}).call(()=>{e.intro.mode=`leave`,e.intro.p=0}).to(e.intro,{p:1,duration:a.leave,ease:`none`}).call(y,null,`+=${a.afterLeave}`);return()=>i.kill()},[n]),(0,v.useEffect)(()=>{let e=h.current;if(e){if(i===`opening`){let t=r.to(e.detail,{p:1,duration:a.detailOpen,ease:`power3.inOut`,onComplete:b});return()=>t.kill()}if(i===`closing`){let t=r.to(e.detail,{p:0,duration:a.detailClose,ease:`power3.inOut`,onComplete:x});return()=>t.kill()}}},[i]),(0,C.jsx)(`section`,{ref:p,className:`project-magazine${o?` is-hidden`:``}`,"aria-label":`Projekte – Magazine`,children:(0,C.jsx)(`canvas`,{ref:m,className:`project-magazine__canvas`})})}export{T as default};