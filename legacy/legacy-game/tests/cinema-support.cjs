/* Legacy world/puzzle suites represent a returning child who saw the short films.
   The dedicated cinema browser suite exercises the actual new scenes. */
exports.seedSeenStoryScenes=function(){
  const key='farbtupf.cinema.v1';let seen={};
  try{const saved=JSON.parse(localStorage.getItem(key));if(saved?.version===1)seen=saved.seen||{};}catch(_){}
  const quests=['bridge-neighbours-v1','moss-rest-v1','owl-trail-sign-v1','kingfisher-view-v1','garden-path-v1','waterside-stories-v1','meeting-clearing-v1','shared-seating-v1','forest-invitation-v1'];
  for(const id of ['opening','reunion','chapter:reconnect','chapter:gather',...quests.flatMap(id=>['request:'+id,'return:'+id])])seen[id]=true;
  localStorage.setItem(key,JSON.stringify({version:1,seen}));
};
