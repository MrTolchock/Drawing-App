/* Exact, owner-requested navigation/spacing migration. No editorial decisions live here.
   Changed task definitions or any later code/art/layout fingerprint cannot use this bridge. */
'use strict';
const proof=require('./puzzle-layout-compatibility.json');
function sameReviewPresentation(kind,key,before,after){
 if(before.definition!==after.definition)return false;
 if(before.reviewPresentation===after.reviewPresentation)return true;
 const p=proof[kind]?.[key];
 return !!p&&p.definition===after.definition&&p.before===before.reviewPresentation&&p.after===after.reviewPresentation;
}
module.exports={sameReviewPresentation};
