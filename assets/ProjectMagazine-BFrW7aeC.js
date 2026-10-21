import{a as e,c as t,d as n,f as r,g as i,h as a,i as o,l as s,m as c,n as l,o as u,p as d,r as f,s as p,t as m,u as h,v as g,y as _}from"./index-DgG91I14.js";var v=_(g(),1),y={widthRatio:.18,sectionRatio:.6,maxHeightRatio:.3,aspect:3/2,centerGap:1.45,visiblePerSide:5,edgeFit:1,minSlots:22,tiltX:.55,turnY:-.3,depth:110,depthFront:60,wheelSpeed:.0016,touchSpeed:.005,scrollEase:.085,bendStrength:1e3,bendEase:.12,maxBend:80,centerPush:.3,edgePull:.7,cornerPull:.6,flutter:.12,followDistance:18,followEase:.06,hoverStrength:1.1,maxHover:40,activeScale:.4,grayDistance:1.4,focal:650,hoverEase:.08,hoverDecay:.92,introStagger:.45,segments:40},b=`
  uniform float uBend;        // Scroll-Verformung in px (mit Vorzeichen)
  uniform vec2 uMouse;        // Mausposition auf dem Blatt (0–1)
  uniform float uHover;       // Wölbung zur Maus hin in px
  uniform vec2 uSize;         // Blattgröße in px
  uniform float uCenterPush;  // Mitte nach vorn
  uniform float uEdgePull;    // Ränder nach hinten
  uniform float uCornerPull;  // Ecken zusätzlich nach hinten
  uniform float uFlutter;     // Flattern
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

    p.z += uBend * (wind + flutter);

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
`;function S(i,{images:a,onActiveChange:c,onSelect:d,getDetailRect:g,config:_={}}){let v={...y,..._},S=a.length,C=Math.max(S,Math.ceil(v.minSlots/S)*S),w=new m({canvas:i,antialias:!0,alpha:!0});w.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),w.outputColorSpace=t;let T=new s,E=new u(-1,1,1,-1,-5e3,5e3),D=new l;T.add(D);let O=0,k=0,A=0,j=0,ee=new n,M=new Map,N=Array.from({length:C},(e,t)=>a[t%S]).map(n=>{let i={uTexture:{value:null},uImageRes:{value:new r(3,2)},uSize:{value:new r(1,1)},uBend:{value:0},uMouse:{value:new r(.5,.5)},uHover:{value:0},uOpacity:{value:0},uCenterPush:{value:v.centerPush},uEdgePull:{value:v.edgePull},uCornerPull:{value:v.cornerPull},uFlutter:{value:v.flutter},uTime:{value:0},uFocal:{value:v.focal},uGray:{value:1}},a=new h({uniforms:i,vertexShader:b,fragmentShader:x,transparent:!0,side:2});M.has(n)||M.set(n,new Promise(e=>ee.load(n,n=>{n.colorSpace=t,n.minFilter=f,n.anisotropy=w.capabilities.getMaxAnisotropy(),e(n)}))),M.get(n).then(e=>{i.uTexture.value=e,i.uImageRes.value.set(e.image.width,e.image.height),i.uOpacity.value=1});let o=new e(new p(1,1,v.segments,v.segments),a);return D.add(o),{mesh:o,uniforms:i,follow:new r,hover:0}});function P(){let e=i.getBoundingClientRect();O=e.width,k=e.height,w.setSize(O,k,!1),E.left=-O/2,E.right=O/2,E.top=k/2,E.bottom=-k/2,E.position.z=1e3,E.updateProjectionMatrix(),F.set(O*v.sectionRatio,k).normalize(),A=Math.min(O*v.widthRatio,k*v.maxHeightRatio*v.aspect),O<500&&(A=O*.55),j=A/v.aspect;for(let e of N)e.mesh.geometry.dispose(),e.mesh.geometry=new p(A,j,v.segments,v.segments),e.uniforms.uSize.value.set(A,j)}function te(e){let t=Math.abs(e),n=A*v.centerGap,r=Math.min(O/2/F.x,k/2/F.y),i=Math.max(A*.12,(r*v.edgeFit-n)/Math.max(1,v.visiblePerSide-1)),a=t<=1?n*t:n+i*(t-1);return Math.sign(e)*a}let F=new r(1,1).normalize(),I=e=>e*e*(3-2*e),L={target:0,current:0,velocity:0},R=0,z=-1,B={p:0},V=0,H=()=>B.p===0&&Q.p>=1,U=e=>{e.preventDefault(),H()&&(L.target+=e.deltaY*v.wheelSpeed)},W=null,G=e=>{if(!H()||!W)return;let t=i.getBoundingClientRect(),n=e.clientX-t.left,r=e.clientY-t.top,a=W;n>=a.left&&n<=a.right&&r>=a.top&&r<=a.bottom&&d?.(z%S)},K=null,q=e=>{K=e.touches[0].clientY},J=e=>{if(K===null||!H())return;let t=e.touches[0].clientY;L.target+=(K-t)*v.touchSpeed,K=t},Y=()=>{K=null},X={x:O/2,y:k/2,speed:0,active:!1},Z=null,ne=e=>{let t=i.getBoundingClientRect(),n=e.clientX-t.left,r=e.clientY-t.top;Z&&(X.speed=Math.max(X.speed,Math.hypot(n-Z.x,r-Z.y))),Z={x:n,y:r},X.x=n,X.y=r,X.active=!0},re=()=>{X.active=!1,Z=null},Q={p:1,mode:`enter`},ie=e=>1-(1-e)**3,ae=e=>e*e*e,$=0,oe=1;function se(){let e=L.current;L.current+=(L.target-L.current)*v.scrollEase,L.velocity=L.current-e;let t=(Q.p-oe)*1.4+(B.p-V)*1.2;oe=Q.p,V=B.p;let n=o.clamp((L.velocity+t)*v.bendStrength,-v.maxBend,v.maxBend);R+=(n-R)*v.bendEase,X.speed*=v.hoverDecay;let r=0,a=1/0;N.forEach((e,t)=>{let n=t-L.current;n=((n+C/2)%C+C)%C-C/2;let s=Math.abs(n),{mesh:c,uniforms:l}=e,u=te(n),d=I(Math.min(s,1));if(Q.p<1||Q.mode===`leave`){let e=o.clamp((n+4)/8,0,1),t=v.introStagger,r=o.clamp(Q.p*(1+t)-t*e,0,1),i=Math.hypot(O,k)*.75;if(Q.mode===`enter`){let e=ie(r);u=o.lerp(i+n*A*.05,u,e),d=o.lerp(1,d,e)}else{let e=ae(r);u=o.lerp(u,-i+n*A*.05,e),d=o.lerp(d,1,e)}}let f=s<.5;B.p>0&&!f&&(u+=Math.sign(n)*ae(B.p)*Math.hypot(O,k)*.8);let p=n>0?-n*v.depth:-n*v.depthFront;c.position.set(F.x*u,F.y*u,p),c.rotation.set(v.tiltX*d,v.turnY*d,0);let m=1+v.activeScale*(1-I(Math.min(s,1)));if(c.scale.setScalar(m),l.uGray.value=I(Math.min(1,s/v.grayDistance)),B.p>0&&f&&g){let e=g(),t=B.p,n=e.left+e.width/2-O/2,r=k/2-(e.top+e.height/2);c.position.x=o.lerp(c.position.x,n,t),c.position.y=o.lerp(c.position.y,r,t),c.position.z=50,c.scale.setScalar(o.lerp(m,e.width/A,t)),l.uGray.value=0}c.renderOrder=Math.round(-n*10),l.uBend.value=R,l.uTime.value=performance.now()/1e3,s<a&&(a=s,r=t);let h=s<.5&&B.p===0,_=X.active?(X.x-O/2)/(O/2):0,y=X.active?-(X.y-k/2)/(k/2):0,b=h?_*v.followDistance:0,x=h?y*v.followDistance:0;e.follow.x+=(b-e.follow.x)*v.followEase,e.follow.y+=(x-e.follow.y)*v.followEase,c.position.x+=e.follow.x,c.position.y+=e.follow.y;let S=h&&X.active?Math.min(X.speed*v.hoverStrength,v.maxHover):0;if(e.hover+=(S-e.hover)*v.hoverEase,l.uHover.value=e.hover,s<.5){let e=A*c.scale.x/2,t=j*c.scale.y/2;W={left:O/2+c.position.x-e,right:O/2+c.position.x+e,top:k/2-c.position.y-t,bottom:k/2-c.position.y+t},i.style.cursor=H()&&X.active&&X.x>=W.left&&X.x<=W.right&&X.y>=W.top&&X.y<=W.bottom?`pointer`:``}if(h&&X.active){let e=o.clamp((X.x-O/2-c.position.x)/(A*c.scale.x)+.5,-.2,1.2),t=o.clamp(-(X.y-k/2+c.position.y)/(j*c.scale.y)+.5,-.2,1.2);l.uMouse.value.x+=(e-l.uMouse.value.x)*.15,l.uMouse.value.y+=(t-l.uMouse.value.y)*.15}}),r!==z&&(z=r,c?.(r%S)),w.render(T,E),$=requestAnimationFrame(se)}return P(),window.addEventListener(`resize`,P),i.addEventListener(`wheel`,U,{passive:!1}),i.addEventListener(`click`,G),i.addEventListener(`touchstart`,q,{passive:!0}),i.addEventListener(`touchmove`,J,{passive:!0}),i.addEventListener(`touchend`,Y),window.addEventListener(`pointermove`,ne,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,re),$=requestAnimationFrame(se),{intro:Q,detail:B,get height(){return k},scrollTo(e){L.target=L.current=e},destroy(){cancelAnimationFrame($),window.removeEventListener(`resize`,P),i.removeEventListener(`wheel`,U),i.removeEventListener(`click`,G),i.removeEventListener(`touchstart`,q),i.removeEventListener(`touchmove`,J),i.removeEventListener(`touchend`,Y),window.removeEventListener(`pointermove`,ne),document.documentElement.removeEventListener(`pointerleave`,re);for(let e of N)e.mesh.geometry.dispose(),e.mesh.material.dispose();M.forEach(e=>e.then(e=>e.dispose())),w.dispose()}}}var C=i();function w(e){let t=window.innerWidth,n=window.innerHeight,r=d(e,`--gutter`,20),i=d(e,`--gap`,32),a=t<=1e3,o=a?t-2*r:(t-2*r-4*i)*.6+2*i,s=o*2/3,c=a?n*.3:n/2+n*.06-s/2;return{left:(t-o)/2,top:c,width:o,height:s}}function T({projects:e,startIndex:t=0,leaving:n=!1,detailStatus:r=`closed`,hidden:i=!1,onActiveChange:o,onSelect:s,onDetailOpened:l,onDetailClosed:u,onLeft:d}){let f=(0,v.useRef)(null),p=(0,v.useRef)(null),m=(0,v.useRef)(null),h=(0,v.useEffectEvent)(e=>o?.(e)),g=(0,v.useEffectEvent)(e=>s?.(e)),_=(0,v.useEffectEvent)(()=>d?.()),y=(0,v.useEffectEvent)(()=>l?.()),b=(0,v.useEffectEvent)(()=>u?.());return(0,v.useEffect)(()=>{let n=f.current,r=S(p.current,{images:e.map(e=>e.thumb??e.image),onActiveChange:h,onSelect:g,getDetailRect:()=>w(n)});return r.scrollTo(t),r.intro.mode=`enter`,r.intro.p=0,a.to(r.intro,{p:1,duration:c.enter,ease:`none`,delay:c.enterDelay}),m.current=r,()=>{a.killTweensOf(r.intro),a.killTweensOf(r.detail),r.destroy(),m.current=null}},[e]),(0,v.useEffect)(()=>{let e=m.current;if(!n||!e)return;a.killTweensOf(e.intro);let t=e.detail.p>0?c.detailClose:0,r=a.timeline({delay:t}).call(()=>{e.intro.mode=`leave`,e.intro.p=0}).to(e.intro,{p:1,duration:c.leave,ease:`none`}).call(_,null,`+=${c.afterLeave}`);return()=>r.kill()},[n]),(0,v.useEffect)(()=>{let e=m.current;if(e){if(r===`opening`){let t=a.to(e.detail,{p:1,duration:c.detailOpen,ease:`power3.inOut`,onComplete:y});return()=>t.kill()}if(r===`closing`){let t=a.to(e.detail,{p:0,duration:c.detailClose,ease:`power3.inOut`,onComplete:b});return()=>t.kill()}}},[r]),(0,C.jsx)(`section`,{ref:f,className:`project-magazine${i?` is-hidden`:``}`,"aria-label":`Projekte – Magazine`,children:(0,C.jsx)(`canvas`,{ref:p,className:`project-magazine__canvas`})})}export{T as default};