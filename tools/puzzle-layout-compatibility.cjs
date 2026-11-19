/* Exact owner-requested UI migrations. These hashes contain no editorial decisions.
   Changed definitions, pictures, rules and interactions cannot use an unrecorded edge. */
'use strict';
const proof=require('./puzzle-layout-compatibility.json');
function sameReviewPresentation(kind,key,before,after){
 if(before.definition!==after.definition)return false;
 const edges=[proof,...(proof.migrations||[])].map(p=>p[kind]?.[key]).filter(p=>p?.definition===after.definition);
 const reached=new Set([before.reviewPresentation]);
 for(let changed=true;changed;){changed=false;for(const edge of edges)if(reached.has(edge.before)&&!reached.has(edge.after)){reached.add(edge.after);changed=true;}}
 return reached.has(after.reviewPresentation);
}
module.exports={sameReviewPresentation};
