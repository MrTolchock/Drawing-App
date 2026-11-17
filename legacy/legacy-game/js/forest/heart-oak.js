/* The central landmark is actual geometry: an old oak with nine waking boughs. */
import {THREE,paint,solid,ellipsoid,limb,curveTube,seeded} from './materials.js';

export function buildHeartOak(root,canopy){
  root.name='heart-tree';canopy.clear();
  const bark=paint('#a28a68','bark'),roots=paint('#a29675','bark'),random=seeded(7481);
  ellipsoid(root,bark,[0,1.1,0],[.93,1.65,.76]);
  const trunk=limb(root,bark,[0,.65,0],[.18,7.9,-.08],.72,.36),trunkAngle=trunk.rotation.z;
  const upperTrunk=curveTube(root,bark,[[.2,3.3,0],[-.25,5.6,.08],[.35,8.6,0],[.1,10.5,-.3]],.34,24),windBoughs=[];
  for(let i=0;i<7;i++){
    const a=i*Math.PI*2/7;
    curveTube(root,roots,[[0,.45,0],[Math.sin(a)*1.1,.16,Math.cos(a)*1.1],[Math.sin(a)*2.8,.07,Math.cos(a)*2.6]],.16,12);
  }
  const tips=[[-2.9,6.5,.7],[-4,8.3,-.2],[-2.9,10.1,-.4],[-.8,11.4,-.2],[1.6,11.1,-.6],[3.7,9.5,0],[3.4,7.2,.8],[.8,8.1,1.5],[-.8,8.4,-1.7]];
  const foliage=new THREE.SphereGeometry(1,14,10),matrix=new THREE.Matrix4(),rotation=new THREE.Quaternion();
  const crowns=[],buds=[];
  tips.forEach((tip,index)=>{
    const start=[.1,3.3+index%3*.9,0];
    const branch=curveTube(root,bark,[start,[tip[0]*.4,tip[1]*.65,tip[2]*.3],[tip[0]*.84,tip[1]-.7,tip[2]],tip],.16+(index%2)*.025,18);
    windBoughs.push({mesh:branch,base:branch.rotation.z,index});
    for(const side of [-1,1]){const twig=limb(root,bark,[tip[0],tip[1]-.45,tip[2]],[tip[0]+side*.47,tip[1]+.55,tip[2]+side*.2],.08,.018);windBoughs.push({mesh:twig,base:twig.rotation.z,index});}
    const material=paint('#91ad61','leaf').clone();material.transparent=true;
    const crown=new THREE.InstancedMesh(foliage,material,18);crown.position.set(...tip);crown.name='heart-tree-bough-'+(index+1);
    crown.userData.growth=index+1;crown.userData.size=1;
    for(let i=0;i<18;i++){
      const large=i<6,a=i*2.4,r=large?.65:1.2;
      const p=new THREE.Vector3(Math.sin(a)*r,(random()-.5)*1.35,Math.cos(a)*r*.8);
      const s=large?new THREE.Vector3(.9+random()*.3,.8+random()*.3,.8+random()*.3):new THREE.Vector3(.22,.1,.43);
      rotation.setFromEuler(new THREE.Euler(random(),a,random()*.5));matrix.compose(p,rotation,s);crown.setMatrixAt(i,matrix);
      crown.setColorAt(i,new THREE.Color().setHSL(.20+random()*.025,.12+random()*.08,.79+random()*.12));
    }
    crown.instanceMatrix.needsUpdate=true;crown.castShadow=false;canopy.add(crown);crowns.push(crown);
    const bud=ellipsoid(root,new THREE.MeshStandardMaterial({color:'#c5af6b',roughness:1,emissive:'#edc66e',emissiveIntensity:0}),tip,[.16,.24,.16]);buds.push(bud);
  });
  const shape=new THREE.Shape();shape.moveTo(0,.18);shape.bezierCurveTo(-.5,.78,-.98,.02,0,-.69);shape.bezierCurveTo(.98,.02,.5,.78,0,.18);
  const heartGeometry=new THREE.ExtrudeGeometry(shape,{depth:.07,bevelEnabled:true,bevelSize:.045,bevelThickness:.035,bevelSegments:3,curveSegments:18});
  const hollow=new THREE.Mesh(heartGeometry,solid('#65543e'));hollow.position.set(.03,2.6,.7);hollow.scale.setScalar(1.05);root.add(hollow);
  const heartMaterial=new THREE.MeshStandardMaterial({color:'#b9ae8d',roughness:.65,emissive:'#efbc5d',emissiveIntensity:0});
  const heart=new THREE.Mesh(heartGeometry,heartMaterial);heart.name='heart-tree-heart';heart.position.set(.03,2.6,.83);heart.scale.setScalar(.72);root.add(heart);
  const glow=new THREE.PointLight('#f5cf79',0,8,2);glow.position.set(.05,2.7,1.2);root.add(glow);
  // A broad meeting circle makes this place recognisable from every approach.
  const clearing=new THREE.Mesh(new THREE.CircleGeometry(6.2,64),new THREE.MeshBasicMaterial({color:'#d1d4a3',transparent:true,opacity:.36,depthWrite:false}));
  clearing.rotation.x=-Math.PI/2;clearing.position.set(0,.035,3.6);root.add(clearing);
  const lanterns=[];
  for(let i=0;i<9;i++){
    const a=(i/9)*Math.PI*2,position=[Math.sin(a)*4.4,.12,3.6+Math.cos(a)*3.9];
    ellipsoid(root,paint('#c2ba99','stone'),position,[.47,.16,.4]);
    const material=new THREE.MeshStandardMaterial({color:'#b8b28d',emissive:'#efd27c',emissiveIntensity:0,roughness:1});
    const seed=ellipsoid(root,material,[position[0],.29,position[2]],[.12,.13,.22]);seed.rotation.y=a;lanterns.push(seed);
  }
  const motesGeometry=new THREE.BufferGeometry(),positions=new Float32Array(24*3);
  motesGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const motes=new THREE.Points(motesGeometry,new THREE.PointsMaterial({color:'#f8df91',size:.09,transparent:true,opacity:.75,depthWrite:false}));motes.name='heart-tree-fireflies';root.add(motes);
  let actual=0,displayed=0,initial=true,pulse=0;
  function setGrowth(count,visible=count){
    actual=Math.max(0,Math.min(9,count));displayed=Math.max(0,Math.min(9,visible));
    root.userData.growth=actual;root.userData.displayedGrowth=displayed;
    crowns.forEach((c,i)=>{
      const show=i<displayed;
      if(show&&!c.visible&&!initial&&!window.FK.reduced){c.scale.setScalar(.025);pulse=1;}
      c.visible=show;
      buds[i].material.emissiveIntensity=show?.45:0;
      lanterns[i].material.color.set(show?'#e4c47a':'#aaa68b');lanterns[i].material.emissiveIntensity=show?.8:0;
    });
    bark.color.set(displayed?'#fff0d0':'#dbd8ce');roots.color.set(displayed?'#e9deac':'#d5d2c5');
    heartMaterial.color.set(displayed?'#edc36e':'#b4ad99');
    initial=false;
  }
  function update(time){
    const motion=window.FK.reduced?0:time;
    const breeze=motion?Math.sin(motion*.65)*.012+Math.sin(motion*.27)*.007:0;
    trunk.rotation.z=trunkAngle+breeze*.18;upperTrunk.rotation.z=breeze*.65;
    windBoughs.forEach(({mesh,base,index})=>mesh.rotation.z=base+breeze*(.7+index%3*.1));
    crowns.forEach((c,i)=>{if(c.visible){c.scale.setScalar(THREE.MathUtils.lerp(c.scale.x,1,.08));c.rotation.z=breeze+ (motion?Math.sin(motion*1.15+i)*.012:0);c.position.x=tips[i][0]-breeze*tips[i][1];c.position.z=tips[i][2]+(motion?Math.sin(motion*.6+i)*.07:0);}});
    const beat=window.FK.reduced?0:Math.pow(Math.max(0,Math.sin(time*2.5)),5);
    heartMaterial.emissiveIntensity=displayed? .25+displayed/9*.45+beat*.25+pulse*.4:0;
    heart.scale.setScalar(.72+(displayed?beat*.025:0));glow.intensity=displayed?.55+beat*.2:0;
    motes.visible=displayed>0;
    for(let i=0;i<24;i++){const a=i*2.4+motion*.05,r=1.5+i%5*.7;positions[i*3]=Math.sin(a)*r;positions[i*3+1]=.55+(i%7)*.5+Math.sin(motion*.5+i)*.16;positions[i*3+2]=2.7+Math.cos(a)*r;}
    motesGeometry.attributes.position.needsUpdate=true;pulse*=.97;
  }
  return {setGrowth,update,heart,tips};
}
