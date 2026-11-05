/* Original, editable colouring pages for the selected picture-book world.
   Every painted area has a closed boundary; no raster texture enters the fill mask. */
(function () {
  'use strict';
  const art = window.FK.art;
  function lake(g) {
    g.line('M-1200 418 Q-200 380 280 423 Q440 386 620 413 Q800 370 1200 415 L2200 415');
    g.shape('M-1200 460 Q-200 448 300 465 Q700 442 2200 460 L2200 750 L-1200 750Z');
    g.line('M710 505q72-12 137 0m-76 65q49-9 96 0m-155 45q82-10 151 0', g.lw * .7);
    // A distant pair of towers and a little sailing boat evoke the Zürich lakeside.
    [756, 814].forEach(x => {
      g.rect(x, 322, 25, 130, 3);
      g.shape('M' + x + ' 322l12-35 13 35Z');
      g.rect(x + 8, 343, 9, 22, 3);
      g.line('M' + (x + 12) + ' 287v-17', g.lw * .65);
    });
    g.shape('M729 424q67-14 134 0v33H729Z');
    g.shape('M825 576h96l-18 18h-62Z');
    g.shape('M867 494v74h-46Z');
    g.shape('M877 511l39 57h-39Z');
  }
  function leaf(g, x, y, size, rotation) {
    g.at(x, y, rotation, size, () => {
      g.shape('M0 0C-26-18-27-52 0-74C27-52 26-18 0 0Z');
      g.line('M0-8v-49', g.lw * .65);
    });
  }
  function flowers(g) {
    [[142,875,15],[791,846,16],[871,921,13]].forEach(([x,y,r]) => {
      g.line('M'+x+' '+(y+52)+'q-7-23 0-52',g.lw*.65); g.flower(x,y,r);
    });
    g.grass(265,915,12); g.grass(735,938,13); g.grass(915,830,10);
  }
  art.add({
    id:'waldatelier-fuchs', name:'Fuchs am See', cat:'waldatelier',
    colors:['orange','gruen','hellblau','gelb','braun','weiss'],
    spots:[
      {x:490,y:358,c:1},{x:590,y:710,c:1},{x:292,y:733,c:1},
      {x:490,y:550,c:2},{x:542,y:611,c:2},{x:725,y:778,c:2},
      {x:734,y:550,c:3},{x:780,y:210,c:3},{x:132,y:743,c:5},
      {x:234,y:596,c:6},{x:575,y:465,c:6},{x:488,y:620,c:6},
      {x:791,y:846,c:4},
    ],
    draw(g) {
      lake(g);
      g.shape('M-1200 770Q-100 716 255 783Q640 718 2200 748L2200 1400H-1200Z');
      // An old tree, with individually colourable leaves.
      g.shape('M52-300H172Q149 80 175 234Q199 148 289 122L309 149Q204 224 176 337Q165 572 220 812L69 829Q102 532 87 303Q51 191-43 143L-31 105Q43 139 83 193Z');
      g.line('M112 319q-20 195 2 374m31-634q-20 78 8 138M95 768q37-16 73-2',g.lw*.7);
      [[256,139,.9,.8],[305,137,.85,1.8],[207,87,.8,-.4],[170,28,.9,.8],[80,60,.85,-.5],[28,158,.9,-.7],[356,44,.8,1.1]].forEach(a=>leaf(g,...a));
      // Broad, curling tail behind the sitting fox.
      g.shape('M466 814C305 900 153 805 194 644Q213 577 265 550C243 632 301 670 361 682C432 701 490 737 466 814Z');
      g.shape('M194 644Q213 577 265 550C250 607 276 649 314 665L292 679L264 666L248 686L229 667L207 679Z');
      // Body, haunch, paws and pale chest.
      g.shape('M445 519C399 569 378 673 397 772L383 817Q444 848 506 823Q573 858 636 819L619 767C641 654 612 560 562 527Z');
      g.shape('M455 534Q419 613 458 686L473 671L486 697L502 678L517 695Q565 637 553 546Z');
      g.line('M443 709q-14 53 12 97m105-98q-8 61 7 100',g.lw*.75);
      g.ellipse(453,817,47,22); g.ellipse(571,818,48,23);
      g.line('M439 817v18m19-17v20m99-19v20m20-19v17',g.lw*.65);
      // The head outline includes both ears and the muzzle, rather than rigid circles.
      g.shape('M383 383L352 265Q350 247 368 257L448 304Q484 284 527 297L575 224Q586 207 590 229L608 345Q629 369 637 397L683 423Q697 434 683 446L640 473L656 488L632 492L646 507L610 509Q551 559 476 539Q416 526 388 491L368 487L380 470L363 462L380 449Q366 416 383 383Z');
      g.shape('M379 291L401 366L434 324Z');
      g.shape('M578 253L551 310L590 336Z');
      g.shape('M384 437Q415 397 468 453Q491 474 520 476Q550 431 594 426L683 423Q697 434 683 446L640 473L656 488L632 492L646 507L610 509Q551 559 476 539Q416 526 388 491L368 487L380 470L363 462Z');
      g.ellipse(459,404,21,31,-.22); g.ellipse(565,388,22,32,-.18);
      g.dot(465,405,13,true); g.dot(572,390,14,true);
      g.dot(682,431,12,true);
      g.line('M672 449Q653 465 629 455M440 361q16-12 30-5m79-21q16-11 29 0',g.lw*.75);
      // A familiar green neckerchief.
      g.shape('M414 526Q477 554 583 515L594 546Q491 584 412 555Z');
      g.shape('M541 554Q573 571 576 643L554 630L536 650Q529 596 519 571Z');
      g.line('M542 572q13 17 13 45',g.lw*.65);
      flowers(g);
    },
  });
  art.add({
    id:'waldatelier-tram', name:'Tram am Zürichsee', cat:'waldatelier',
    colors:['blau','gelb','hellblau','gruen','braun','grau'],
    spots:[{x:475,y:740,c:1},{x:245,y:690,c:1},{x:470,y:452,c:2},{x:415,y:355,c:3},{x:508,y:550,c:3},{x:731,y:551,c:3},{x:880,y:770,c:4},{x:114,y:382,c:5},{x:463,y:905,c:6}],
    draw(g) {
      lake(g);
      g.shape('M-1200 788Q300 720 2200 758L2200 1400H-1200Z');
      g.line('M-1200 885Q400 800 2200 850M-1200 947Q400 862 2200 912');
      g.line('M-1200 132Q300 155 2200 116');
      g.shape('M62-200H143L130 545L178 740L51 757Q89 363 62-200Z');
      [[70,64,1.1,-.6],[153,74,.9,.8],[232,49,.9,1.5],[284,88,.75,1.8],[31,195,.8,-1]].forEach(a=>leaf(g,...a));
      // Wheels, a gently rounded historic tram, windows and roof contact.
      [290,603].forEach(x=>{g.ellipse(x,784,47,57);g.ellipse(x,784,18,27);});
      g.shape('M231 431Q237 406 269 406H603Q676 406 698 466L713 735Q712 789 662 800H250Q213 800 211 756Z');
      g.shape('M229 452Q245 425 279 425H614Q656 425 676 460L688 625H222Z');
      g.shape('M213 625H704L710 672H212Z');
      g.shape('M610 452L656 455Q672 467 676 489L683 596H614Z');
      [257,335,413,491].forEach(x=>g.rect(x,467,56,128,12));
      g.rect(248,696,46,59,8); g.rect(339,690,236,17,5);
      g.circle(651,712,22); g.circle(651,712,10);
      g.line('M595 451v331M236 769h455M623 748h57',g.lw*.7);
      g.shape('M247 403L269 385H615L648 405Z');
      g.line('M451 384L501 292L438 189L529 145M459 152h98');
      g.rect(523,339,64,46,8); g.line('M564 351h-21v19h21v-9h-20',g.lw*.75);
      flowers(g);
    },
  });
})();
