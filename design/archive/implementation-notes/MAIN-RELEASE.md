# Heart Tree source update

> Archived design/review note. Implementation and approval statements describe the stage when it was written. See the [current app notes](../../../docs/HEART-TREE.md) and [design index](../../README.md) for the present build.

The user requested continuation and a commit to GitHub on main.

Source commit: c11e5f7e73afcb476d18e5778812baf87d1b4379
Repository: https://github.com/MrTolchock/Drawing-App
App: https://mrtolchock.github.io/Drawing-App/

The commit includes the Three.js opening, bridge quest and new European Hedgehog
moss-grove/resting-place quest. The second quest reuses the flat Waldschatz board
and Swiss woodland content pack. Both exact supported sessions and stable world
contributions persist. Original A — Painted woodland remains the art direction.

Validation: 85 unit checks; full touch bridge and memory quest journeys; 20
ordinary memory rounds across all three stages; 60 existing learning touch
tasks; offline 3D reload; preserved old progress/drawing sentinel; 68 handwriting
model bounds and all 17 corrected model touch completions. Final grove and
portrait screenshots inspected after removing canopy obstruction and correcting
portrait rotation. Physical iPad/Safari, heard device speech and child observation
remain pending. The main branch is pushed and clean. GitHub Pages build passed, but its deploy
step stayed at `updating_pages` and timed out after ten minutes. The failed step
was retried with `gh run rerun 42051402311 --failed`; GitHub reports it queued.
The live URL still serves the preceding version at the last HTTP verification.
Workflow: https://github.com/MrTolchock/Drawing-App/actions/runs/42051402311
Pages deployment ID: c11e5f7e73afcb476d18e5778812baf87d1b4379
Artifact ID: 13426058763. Environment deployment ID: 7577166615.
No second source commit, force push, Pages setting or access change was made.
Next: check retry; once successful compare live critical-file hashes with this
commit and verify a fresh public-origin WebGL load. An HTTP hash check result is
saved outside the app in /workspace/scratch/heart-tree-live-verification.json.
The separate owner-private Sites preview still holds the earlier first slice.


## Push retry — 5 November 2026, 15:25 UTC

The user asked to try committing/pushing again. A direct push confirmed c11e5f7
was already on origin/main. Created and pushed an empty deployment retry commit:
`e99c752ad551e5b14a97fa46c6fd94773a18c772`. Remote HEAD verified; code tree and
all previously validated app files are unchanged.

New Pages run: https://github.com/MrTolchock/Drawing-App/actions/runs/42054751103
Its build passed, but deploy failed immediately: GitHub reports c11e5f7 still has
an in-progress deployment and requires it to be cancelled before another starts.
`POST /repos/MrTolchock/Drawing-App/pages/deployments/c11e5f7e73afcb476d18e5778812baf87d1b4379/cancel`
returns **403 Resource not accessible by integration**. The same deployment GET
reports `deployment_cancelled`, so GitHub's deployment state is inconsistent.
Normal cancellation of old workflow 42051402311 says completed; its API view
still reports queued. Force cancellation returns 409: workflow re-run not yet
queued. Do not keep creating more commits or bypass the missing Pages permission.

An owner with Pages write access needs to clear the stale deployment/lock. Then
rerun the failed deployment for 42054751103 and verify live assets and WebGL.
No force push, hosting settings change, workflow permission escalation or new
application change was made during this retry.


## Full story release

Source 25ad7a240c69205df1530c12254f9088817487b1 was pushed to main, clean.
The existing owner-private Site was updated without waiting for Pages:
project appgprj_6aec8e8bbc8881918b4e3816e2f298e8,
private-source c348dc758a736085726afc2d146e28abd3ac004d,
version appgprj_6aec8e8bbc8881918b4e3816e2f298e8~appgver_0dc8602481108191a6232f462d8e20f6,
deployment appgdep_6aecc753bb3081919ab056367ac8b960 succeeded.
URL https://farbtupf-herzbaum-preview-k7m4.andreas-itten.chatgpt.site

The current private copy contains 98 verified runtime files, version 6.0.0.
Source credentials were handled only in session memory/hidden stdin, with an
ephemeral Git auth header, and were not persisted or printed. The Site audience
remains one owner, no other users/groups/invites. The standard source helper was
not installed, so the existing ordinary-Git fallback opened/fetched/fast-forwarded
the same checkout, then committed, pushed, verified remote SHA and archived that
exact source state. No duplicate Site or public access change was created.

All planned story features are implemented; real child/iPad review was requested.
