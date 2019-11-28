# GiantDiplomacy.js

A set of scripts for use in my particular implementation of DDAL-05-10, Giant Diplomacy.

# Pandi's Puzzle
Ability to drag out multiple copies of Pandi's Puzzle, each consisting of a single Pandi token and
all the pieces for the puzzle for players to work on.  Each puzzle has the following buttons,
which will act on any select piece or pieces, or, if the Pandi token is selected, will work on all pieces
of that token's associated puzzle.
1. A "Reset" button.  Will move the selected pieces back to their start position
1. A "Solve - Cat" button (GM only).  Will move the selected pieces to their solution position for the cat answer
1. A "Solve - house" button (GM only).  Will move the selected pieces into their solution position for the house answer
1. A "Solve - diamond" button (GM only).  Will moce the selecte dpieces into their solution position for the diamond answer

## Contest
Buttons to record the success/failure of a selected token or tokens.  Updates the "Scoreboard" handout dynamically.
1. One button for each drinking or contest round
1. Dogs contest has a button for each sub-round of eating

As my first script, this does *not* make proper use of state, so it will not
track puzzle or contest scores across restarts of the API sandbox.  Do not prep this module with started
puzzles or contests, as they will be broken if the API Sandbox goes to sleep and must be restarted. 
