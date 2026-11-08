/* Small, self-contained paper illustrations: no network, platform emoji or answer text in picture cards. */
const ink='#624a34', cream='#fff0d2';
export function picture(name, label='') {
  let drawing='';
  const ellipse=(x,y,rx,ry,fill)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
  const path=(d,fill='none')=>`<path d="${d}" fill="${fill}"/>`;
  const rect=(x,y,w,h,fill,r=6)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
  const circle=(x,y,r,fill)=>ellipse(x,y,r,r,fill);
  const [animal,action]=name.split('-');
  const animals=['fox','squirrel','mouse','owl','bird','beaver','hare','cat','dog','duck','fish','cow','whale'];
  if(animals.includes(animal)){
    const colours={fox:'#d88943',squirrel:'#b8773e',mouse:'#b89b77',owl:'#ae8550',bird:'#619cb6',beaver:'#97704c',hare:'#b69a74',cat:'#b5a08a',dog:'#a77d50',duck:'#d3b85d',fish:'#72a8b5',cow:'#eee2c6',whale:'#7ba8b7'};
    const c=colours[animal],running=action==='run',sleeping=action==='sleep',flying=action==='fly',swimming=action==='swim';
    if(animal==='duck'&&(swimming||flying)){
      drawing=ellipse(50,68,30,17,c)+circle(32,40,17,c)+path('M17 40 L4 46 L18 51 Z','#d39e53')+circle(28,37,3,ink)+(swimming?path('M10 91 Q25 82 40 91 T72 91 T98 91'):path('M43 65 Q46 20 69 18 Q87 36 61 67 Z',c));
    }else if(animal==='fish'||animal==='whale'){
      drawing=ellipse(48,55,29,17,c)+path('M73 54 L92 39 L92 70 Z',c)+circle(30,51,3,ink)+path('M10 79 Q25 70 40 79 T72 79 T98 79');
      if(animal==='whale')drawing+=path('M37 33 Q32 10 43 18 M37 30 Q51 12 54 23');
    }else{
      if(animal==='squirrel')drawing+=path('M66 70 Q102 76 88 31 Q76 14 67 30 Q58 43 78 48 Q85 63 65 58',c);
      if(animal==='beaver')drawing+=ellipse(78,77,15,10,'#705640');
      if(animal==='mouse')drawing+=path('M69 79 Q96 90 91 67');
      if(animal==='fox')drawing+=path('M65 80 Q97 90 94 59 Q86 73 71 61 Z',c)+path('M94 59 Q89 66 85 67 L91 74 Z',cream);
      if(sleeping){drawing+=ellipse(52,76,31,14,c)+ellipse(29,68,18,16,c)+path('M18 67 Q22 72 27 67 M32 67 Q36 72 41 67')+path('M70 25 h13 l-13 14 h13 M84 10 h10 l-10 10 h10');
        if(['cat','fox'].includes(animal))drawing+=path('M15 58 L15 44 L27 53 M33 53 L44 44 L44 61',c);
        if(animal==='mouse')drawing+=circle(17,54,7,c)+circle(39,52,7,c);
        if(animal==='dog')drawing+=ellipse(14,68,6,13,'#96734f')+ellipse(44,68,6,13,'#96734f');
        drawing+=ellipse(29,75,9,5,cream)+circle(29,73,2,ink);
      }
      else{
        drawing+=ellipse(52,running?64:68,21,running?15:23,c);
        if(running)drawing+=path('M42 73 L26 88 L15 85 M60 74 L76 85 L86 79')+path('M9 54 H22 M5 66 H18');
        else drawing+=ellipse(38,87,12,5,c)+ellipse(65,87,12,5,c);
        if(animal==='hare')drawing+=ellipse(36,24,7,20,c)+ellipse(59,24,7,20,c);
        else if(['fox','cat'].includes(animal))drawing+=path('M28 39 L30 14 L45 32 M55 32 L72 14 L74 41',c);
        else if(animal==='dog')drawing+=ellipse(26,43,10,22,'#96734f')+ellipse(72,43,10,22,'#96734f');
        else if(!['bird','owl','duck'].includes(animal))drawing+=circle(31,34,12,c)+circle(66,34,12,c)+circle(31,34,6,'#d5ad97')+circle(66,34,6,'#d5ad97');
        drawing+=ellipse(49,48,27,23,c);
        if(['bird','owl','duck'].includes(animal)){
          drawing+=(animal==='owl'?ellipse(38,48,11,13,cream)+ellipse(60,48,11,13,cream):ellipse(35,54,10,7,cream)+ellipse(65,54,10,7,cream)+ellipse(52,77,13,13,'#e2cb72'))+path('M45 55 L55 55 L50 64 Z','#d9ac5a');
          drawing+=flying?path('M31 65 Q6 36 9 57 Q9 72 32 76 M70 65 Q96 36 94 57 Q93 74 70 77',c):path('M32 67 Q26 82 38 83 M67 67 Q73 82 61 83');
          if(!flying)drawing+=path('M20 94 H84');
        }else drawing+=ellipse(49,58,17,10,cream)+ellipse(49,54,4,3,ink);
        drawing+=circle(38,46,3,ink)+circle(60,46,3,ink)+circle(37,45,1,'white')+circle(59,45,1,'white');
        if(animal==='cow')drawing+=path('M27 29 L22 15 L35 23 M65 24 L78 15 L73 31',cream)+ellipse(56,78,9,7,'#806b52')+ellipse(28,55,6,8,'#806b52');
        if(animal==='fox')drawing+=path('M34 70 Q49 78 65 70 L53 88 Z','#6d8f4f');
      }
    }
  } else {
    const drawings={
      nut:ellipse(50,57,25,28,'#b67e43')+path('M23 45 Q25 27 51 28 Q75 29 78 45 Z','#91663c')+path('M50 28 L56 17'),
      nuts:ellipse(50,57,25,28,'#b67e43')+path('M23 45 Q25 27 51 28 Q75 29 78 45 Z','#91663c')+path('M50 28 L56 17'),
      seeds:ellipse(42,51,12,22,'#d9b35f')+ellipse(65,66,11,20,'#baa066')+path('M43 34 L43 67 M65 50 L65 81'),
      feathers:path('M27 83 Q15 35 66 15 Q95 49 29 83 Z','#a4bbc2')+path('M24 91 L66 25 M39 62 L63 58 M48 45 L69 42'),
      logs:path('M17 68 L65 23 L86 42 L38 87 Z','#ac8050')+ellipse(28,77,15,12,'#e5bf86')+ellipse(28,77,8,6,'#d8ad77'),
      berries:circle(34,60,16,'#b46962')+circle(64,60,16,'#c47b70')+circle(50,79,16,'#a95d60')+path('M49 50 L52 22 Q73 17 73 32 Q60 42 52 33','#789852'),
      house:rect(22,43,57,44,'#e8bc7e')+path('M14 44 L51 12 L88 44 Z','#bd7954')+rect(45,61,17,26,'#9e7750')+rect(28,54,12,12,'#fff2cf'),
      hat:ellipse(50,76,39,9,'#ba9464')+path('M27 73 L32 29 Q50 17 68 29 L75 73 Z','#e3bd7e')+path('M29 62 Q50 70 72 62'),
      rose:path('M48 92 L51 48 M49 74 Q21 56 22 75 Q29 85 49 80','#729555')+circle(50,34,24,'#d58b8d')+path('M35 30 Q61 12 66 37 Q44 56 35 30 Q58 22 59 38'),
      nose:path('M50 18 Q39 36 29 65 Q44 79 62 67 Q77 64 66 55 L60 47','#e9c1a2'),
      table:rect(14,34,73,14,'#d4a66b')+path('M23 48 V87 M77 48 V87 M22 70 H78'),
      ball:circle(50,51,34,'#dba45e')+path('M19 37 Q54 46 78 23 M32 22 Q30 60 74 75 M19 71 Q48 52 81 62'),
      tree:path('M43 93 L44 49 H58 L63 93 Z','#ad8155')+circle(33,43,24,'#7d9959')+circle(64,42,26,'#88a65f')+circle(48,24,23,'#8fac69'),
      boat:path('M13 63 H89 L72 85 H30 Z','#c59764')+path('M50 61 V12 L81 56 H52 Z','#eee2b6')+path('M8 92 Q23 84 39 92 T70 92 T98 92'),
      shoe:path('M17 65 L28 29 L52 34 L57 58 Q82 53 88 76 Q55 89 15 77 Z','#b58b65')+path('M31 44 L50 49 M28 52 L51 57 M16 77 H88'),
      leg:path('M37 12 H66 L58 70 L81 80 V90 H29 L31 73 Z','#dcb294'),
      stone:ellipse(50,64,34,22,'#a7aea0')+path('M27 58 Q48 40 67 55'),
      book:path('M50 27 Q30 16 12 27 V83 Q32 74 50 85 Q69 73 88 83 V27 Q66 17 50 27 Z','#dfcf9f')+path('M50 27 V85 M23 40 L40 43 M23 52 L40 55 M61 43 L77 40'),
      cloth:path('M18 23 Q50 37 82 23 L86 80 Q48 66 13 83 Z','#b4beca')+path('M23 36 L76 69 M27 68 L72 37'),
      tin:rect(25,25,50,61,'#b1beb6')+ellipse(50,25,25,8,'#d9dcc6')+path('M27 47 H73 M27 70 H73'),
      bus:rect(10,30,80,47,'#d9b25b')+rect(18,38,17,20,cream)+rect(40,38,17,20,cream)+rect(62,38,17,20,cream)+circle(29,79,10,'#766654')+circle(73,79,10,'#766654'),
      star:path('M50 12 L62 37 L89 41 L69 61 L74 89 L50 76 L26 89 L31 61 L11 41 L38 37 Z','#e8c265'),
      tower:rect(28,30,44,61,'#bba781')+path('M27 30 V14 H39 V25 H49 V14 H60 V25 H73 V14 L74 31 Z','#bba781')+rect(43,65,15,26,'#786e52'),
      worm:path('M13 73 Q25 41 43 66 T76 60 Q86 43 91 59', '#d2ab87')+circle(82,54,9,'#d2ab87')+circle(83,51,2,ink),
      pot:rect(22,34,56,45,'#b3bcb4')+path('M19 30 H81 M11 43 H21 M79 43 H91 M38 18 H62'),
      head:circle(50,49,28,'#e7c29d')+circle(39,43,3,ink)+circle(61,43,3,ink)+path('M39 60 Q50 70 62 60 M25 32 Q45 3 73 29','#b68753'),
      hand:path('M29 87 L14 55 Q12 43 22 48 L32 58 V22 Q37 9 43 22 V50 V15 Q50 6 54 18 V50 V23 Q62 12 65 25 V55 L72 35 Q83 28 82 41 L74 76 L65 89 Z','#e3bc99'),
      sand:path('M11 82 Q22 50 50 66 Q64 39 91 82 Z','#ddc18c')+circle(33,70,2,ink)+circle(66,76,2,ink)+circle(50,80,2,ink),
      scarf:path('M22 23 Q52 37 77 21 L80 44 L61 49 L69 86 L46 91 L40 49 L21 43 Z','#8aa16d')+path('M49 81 L68 76'),
      rope:path('M25 80 Q93 65 71 29 Q48 2 25 32 Q5 67 62 58 Q92 56 85 88'),
      arrow:path('M14 80 L77 22 M51 24 L83 16 L77 49'),
      cup:path('M19 27 H70 L64 79 Q43 89 24 78 Z','#d2ab79')+path('M70 36 Q98 32 86 63 L68 65'),
      till:rect(16,52,70,33,'#b5bd9f')+rect(27,25,47,27,'#d3d5bb')+rect(35,31,30,12,cream)+path('M25 66 H77 M50 72 H60'),
      bench:rect(9,54,82,12,'#bf9764')+rect(15,25,70,22,'#d4ac75')+path('M22 66 V88 M77 66 V88 M22 47 V54 M77 47 V54'),
      wardrobe:rect(20,12,61,78,'#c69e69')+path('M50 16 V88')+circle(44,54,2,ink)+circle(57,54,2,ink),
      branch:path('M12 79 L83 25 M44 56 L39 20 M59 44 L87 49'),
      leaf:path('M18 86 Q5 18 85 11 Q98 72 18 86 Z','#93ab6c')+path('M14 92 L77 21 M30 72 L28 45 M47 55 L70 55'),
      apple:circle(37,57,23,'#ce7d56')+circle(63,57,23,'#d88a5c')+path('M50 40 L52 17 Q75 13 69 27 Q61 34 51 27','#87a161'),
      bath:path('M10 49 H90 L79 83 H24 Z','#e4cba3')+circle(27,41,14,'#edf0e1')+circle(52,35,20,'#f8f7e8')+circle(76,42,13,'#edf0e1')+path('M29 84 L25 92 M74 84 L78 92'),
      pencils:[['#b06c58',25],['#dfbb60',42],['#7c9c68',59],['#729cac',76]].map(([c,x])=>path(`M${x-5} 78 V29 L${x} 13 L${x+5} 29 V78 Z`,c)).join(''),
      door:path('M22 90 V42 Q22 10 50 10 Q78 10 78 42 V90 Z','#ae865b')+path('M33 90 V43 Q33 24 50 24 Q67 24 67 43 V90 Z','#e9cf95')+circle(59,59,3,ink),
      bed:rect(13,49,75,28,'#c7a275')+rect(18,41,26,17,cream)+path('M46 45 H86 V73 H46 Z','#97a984')+path('M14 32 V89 M88 54 V89'),
      bag:path('M21 32 H79 L88 88 Q50 98 12 88 Z','#caa16c')+path('M34 34 Q31 9 50 12 Q70 10 67 34')+circle(50,60,14,'#e8cc94'),
      map:path('M9 25 L35 14 L65 25 L91 14 V78 L65 90 L35 79 L9 90 Z','#dce1ba')+path('M35 14 V79 M65 25 V90 M20 59 Q44 25 78 62')+circle(76,59,6,'#c58b5d'),
      speaker:path('M19 40 H33 L55 20 V82 L33 62 H19 Z','#b4c5b1')+path('M67 35 Q83 50 67 67 M78 24 Q103 50 78 78'),
      demo:rect(12,19,76,62,'#dfd8b8')+path('M41 32 L68 50 L41 69 Z','#829a62'),
      help:circle(50,50,38,'#e7ce92')+path('M36 37 Q38 18 57 25 Q77 36 55 51 L49 62')+circle(49,77,3,ink),
      check:path('M19 53 L42 76 L83 24'),back:path('M58 19 L26 50 L58 81 M27 50 H86'),close:path('M24 24 L77 77 M77 24 L24 77'),skip:path('M18 24 L57 50 L18 77 Z','#a9b88c')+path('M69 21 V80'),gear:circle(50,50,31,'#bac4aa')+circle(50,50,12,cream)+path('M50 8 V18 M50 82 V92 M8 50 H18 M82 50 H92 M20 20 L28 28 M72 72 L80 80 M20 80 L28 72 M72 28 L80 20'),undo:path('M26 23 L11 42 L32 53 M13 42 Q82 6 83 65 Q84 88 47 87'),
    };
    drawing=drawings[name]||circle(50,50,25,'#c7ba90');
    const shapes={circle:circle(50,50,32,'#d8b987'),square:rect(20,20,60,60,'#d8b987',1),rectangle:rect(29,10,42,80,'#d8b987',1),triangle:path('M50 12 L89 82 H11 Z','#d8b987')};
    if(shapes[name])drawing=shapes[name];
  }
  return `<svg viewBox="0 0 100 100" role="img" ${label?`aria-label="${label}"`:'aria-hidden="true"'} xmlns="http://www.w3.org/2000/svg"><g stroke="${ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${drawing}</g></svg>`;
}
export const resourceNames={nuts:'Nüsse',seeds:'Samen',feathers:'Federn',logs:'Holz',berries:'Beeren'};
export const shapeNames={circle:'Kreis',triangle:'Dreieck',square:'Quadrat',rectangle:'Rechteck'};
export function shapeScene(task,filled=false){
  const part=(shape,x,y)=>({circle:`<circle cx="${x}" cy="${y}" r="22"/>`,triangle:`<path d="M${x} ${y-27} L${x+42} ${y+22} H${x-42} Z"/>`,square:`<rect x="${x-22}" y="${y-22}" width="44" height="44"/>`,rectangle:`<rect x="${x-18}" y="${y-34}" width="36" height="68"/>`}[shape]);
  const layouts={
    house:{base:'<rect x="44" y="73" width="112" height="86"/>',parts:{triangle:[100,47],circle:[72,108],square:[72,108],rectangle:[128,124]}},
    cart:{base:'<path d="M23 86 H178 V129 H23 Z M176 91 L194 71"/>',parts:{circle:[53,147],triangle:[143,50],square:[58,63],rectangle:[115,96]}},
    train:{base:'<rect x="24" y="77" width="151" height="57"/>',parts:{circle:[58,151],triangle:[62,49],square:[135,104],rectangle:[85,99]}},
    boat:{base:'<path d="M12 126 H190 L156 165 H43 Z"/>',parts:{circle:[62,140],triangle:[112,47],square:[154,101],rectangle:[51,90]}},
    tent:{base:'<path d="M19 159 L100 12 L181 159 Z"/>',parts:{triangle:[100,104]}},
  };
  const layout=layouts[task.object],gap=layout.parts[task.answer];
  // The selected part is removed from the object; the other defining parts stay visible.
  const colours={circle:'#aec8d1',triangle:'#cb8b70',square:'#e8c579',rectangle:'#a9bb86'};
  let parts='';for(const [shape,[x,y]]of Object.entries(layout.parts)){if(shape!==task.answer&&!(task.object==='house'&&['circle','square'].includes(shape)&&((task.answer==='circle'&&shape==='square')||(task.answer!=='circle'&&shape==='circle'))))parts+='<g fill="'+colours[shape]+'">'+part(shape,x,y)+'</g>'; }
  return `<svg class="ff-shape-scene" viewBox="0 0 200 185" aria-label="${task.object==='house'?'Haus':task.object==='cart'?'Wagen':task.object==='train'?'Zug':task.object==='boat'?'Boot':'Zelt'} mit einer fehlenden Form" role="img"><defs><filter id="paper-grain"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" seed="8" result="noise"/><feComposite in="noise" in2="SourceGraphic" operator="in" result="grain"/><feBlend in="SourceGraphic" in2="grain" mode="soft-light"/></filter></defs><path d="M3 173 Q45 160 95 174 T197 171" fill="none" stroke="${task.object==='boat'?'#a6c8d3':'#b8c99a'}" stroke-width="12" stroke-linecap="round"/><g filter="url(#paper-grain)"><g fill="#dfbc86" stroke="${ink}" stroke-width="3" stroke-linejoin="round">${layout.base}</g><g fill="#bc9968" stroke="${ink}" stroke-width="2">${parts}</g><g fill="${filled?'#98ac78':'#fff8e7'}" stroke="${ink}" stroke-width="3" stroke-dasharray="${filled?'0':'5 5'}">${part(task.answer,...gap)}</g></g></svg>`;
}
