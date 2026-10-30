---
title: "Turns, Tiles, and Tension"
date: 2026-03-23
summary: "A deep look at how space changes decision-making in turn-based combat."
thumbnail: /resources/images/articles/TurnsTilesTension/Tactics-Ogre-Reborn%20Combat.png
meta_description: "A deep look at how space changes decision-making in turn-based combat"
og_description: "A deep look at how space changes decision-making in turn-based combat"
og_image: /resources/images/articles/TurnsTilesTension/Tactics-Ogre-Reborn%20Combat.png
---

# Classic Turn-Based vs Tactical Turn-Based Combat
*Or: why "turn-based" doesn't actually tell you much*

Small confession first: I do this too.

Someone says a game is *turn-based*, and everyone nods like that explained something.

It didn't.

![Cool Slime Yay!](/resources/images/articles/TurnsTilesTension/Slime.jpg)

Put **Dragon Quest**, **Darkest Dungeon**, **Fire Emblem**, **Tactics Ogre**, **Final Fantasy Tactics**, **Into the Breach**, and **Triangle Strategy** in the same bucket and the bucket stops meaning anything. They all take turns. That's roughly where the similarities end.

So at some point I stopped asking "is it turn-based?" and started asking this instead:

> what is the game actually making me think about?

And that splits things pretty cleanly.

Classic turn-based combat makes you think about **actions, resources, and order**. What do I use, on who, and when.

Tactical turn-based combat makes you think about **position, exposure, terrain, and what the board looks like next turn**.

On paper those sound close. Play two of them back to back and they really aren't.

---

## Where The Split Comes From

Both families come from the same place. Early RPG combat borrowed a lot from tabletop: turns, stats, dice, parties, attack rolls. Then those ideas landed on computers and kind of went two different ways.

![Dragon Quest](/resources/images/articles/TurnsTilesTension/DragonQuestSlime.jpg)

One way went toward **menus and abstraction**.

That's the classic JRPG thing. *Dragon Quest* is the obvious example: Square Enix still treats the 1986 original as the start of the series, and it's still about the cleanest version of "pick a command, watch it happen" you'll find.[1] The battlefield is basically a backdrop. The game strips it down on purpose so you can focus on the choice.

![Fire Emblem Shadow](/resources/images/articles/TurnsTilesTension/FireEmblemShadow.jpg)

The other way went toward **the board**.

Nintendo still calls *Fire Emblem: Shadow Dragon and the Blade of Light* (1990) the first game in the series, and in that family terrain, unit placement, and losing units aren't side details. They're the game.[2] *Tactics Ogre* pushed it further in the mid-90s, and *Final Fantasy Tactics* and *Triangle Strategy* later took the same core idea in their own directions.[3][4]

So you end up with two very different design questions. One is:

> how do I make picking an action interesting?

The other is:

> how do I make the battlefield interesting?

Same turns. Different problem.

---

## The Big One: What Happens To Space

If I had to squash this whole article into one line:

> **Classic combat abstracts space. Tactical combat makes you play in it.**

In a classic system the game usually doesn't care where anyone is standing in the world. It might care about *relative* position, but it squashes that into something simple.

Rows. Ranks. Front line, back line. Target slots.

![My beloved darkest dungeon](/resources/images/articles/TurnsTilesTension/darkest-dungeon.jpg)

*Darkest Dungeon* is my favourite example of this (yes, I'm biased). Structurally it's classic: abilities, status effects, turn order, party loadouts, slowly bleeding out over a whole dungeon. But it adds **ranks**. Your party and the enemies each stand in a little four-slot line, and position matters a lot... just symbolically. Who can hit rank 3. Who gets wrecked by a shuffle. Who's useless unless they're up front. Who can lunge backwards. Who can drag someone forward.

That's not tactics on a map. It's classic combat with a positional layer folded in.

And that's the important bit. The difference isn't "position exists" vs "position doesn't exist". It's:

- classic: position gets **compressed into a small symbolic model**
- tactical: position gets **expanded into space you actually move around in**

That one change rewires how you think during a fight.

---

## What Classic Combat Is Good At

Classic combat at its best is fast, clear, and easy to read.

That sounds like faint praise. It isn't. It's a big advantage.

When you don't have to read a map, your whole brain goes to:

- what does this ability actually do
- who's the best target
- is now the moment to burn that resource
- what order gets the most out of my turn
- how much damage can I eat now vs later

The decisions are tighter, quicker to read, and they fit nicely in a menu.

Which is why classic systems are so good at carrying status effects, elemental weaknesses, party roles, combos, scripted bosses, and long attrition across a whole dungeon.

The map is light, so the numbers get to be heavy. Easy trade to underestimate.

![Paranoid](/resources/images/articles/TurnsTilesTension/DDParanoia.jpg)

Less space to read means more room for abilities with real personality, resource tension, a bit of RNG spice, and scripted encounters.

It's also why classic games can throw way more fights at you without it getting exhausting. Each one resolves faster because you're picking actions, not evaluating a whole board.

And that speed isn't just convenience. It's a pacing tool. Classic combat slots nicely into the bigger loop of exploring, levelling, money, gear, and surviving the dungeon. Not every fight has to be a handcrafted puzzle.

Some fights are just... Tuesday.

---

## What Tactical Combat Is Good At

Tactical combat moves the problem somewhere else.

Once units stand on real tiles, the question isn't only *what can this unit do?* It turns into:

- where can it do it from?
- what does moving there expose?
- what does it control just by standing there?
- what does this do to the next two turns, not just this one?

So now you're not just picking actions. You're picking **what the board turns into**.

That's why tactics games can feel deeper even with fewer abilities. Space multiplies everything.

![Tactics Ogre Combat](/resources/images/articles/TurnsTilesTension/Tactics-Ogre-Reborn-Review_05.png)

An attack in a tactics game is never just an attack. It comes bundled with the path you took, the angle you came from, who can hit you back now, whether you just opened a flank, what the terrain is doing, and where it leaves you in the turn order.

All that stuff stacking on top of each other is where the emergent, "oh no" moments come from.

Nintendo's own *Triangle Strategy* tips are pretty blunt about it: "Positioning is the key to victory." Then they list exactly what you'd expect: high ground for safety and damage, back attacks for crits, and free follow-up attacks when you sandwich an enemy.[4] The Steam page says basically the same thing in fewer words: terrain, elevation, flanking, follow-ups.[5]

That's not marketing fluff. It's a different economy.

In a tactics game, **space is a resource**.

- A choke point is a resource.
- Height is a resource.
- Getting to the bridge first is a resource.
- A safe angle to attack from is a resource.
- Blocking a tile can matter as much as hitting something.

Good tactics combat feels less like "using moves" and more like haggling with the map.

---

## Explicit Complexity vs Emergent Complexity

This is the comparison I find most useful.

Classic combat leans toward **explicit complexity**. The game hands you the pieces: here are the actions, here's what they cost, here are the numbers, here's roughly what will happen. If it's deep, it's deep because of how those pieces combine.

Tactical combat leans toward **emergent complexity**. The game says: here's a map, here's how moving and attacking work, good luck. The depth comes less from how many buttons you have and more from geometry, unit abilities, timing, and objectives all bumping into each other.

Neither one is better. They just put the design work in different places.

Classic: make the actions and the numbers interesting.

Tactical: make the maps, the movement rules, and the reasons to stand somewhere interesting.

And if you're actually building one of these, that difference decides where your time goes.

---

## Tactics Games Are Harder To Explain

I don't think tactics games are always harder to *design*.

I do think they're usually harder to *teach*.

Classic systems explain themselves through menus and numbers. Cause and effect fits in a tooltip.

Tactical systems need the player to read space. Movement range. Enemy reach. Danger zones. Line of sight. Cover or height. And the nasty one: a tile that's safe right now and terrible next turn.

![Tactics Ogre Combat](/resources/images/articles/TurnsTilesTension/Tactics-Ogre-Reborn%20Combat.png)

All of that has to be on screen somehow. That's a lot more UI work.

A tactics game that's hard to read can feel unfair even when the math is perfectly consistent.

That's part of why Nintendo kept adding accessibility options to *Fire Emblem*, like Newcomer/Casual mode and later Phoenix Mode. Mix "where you stand matters" with permadeath, and one misread can be bad enough to make people quit the genre entirely.[2]

So this is where tactics games get both their best moments and their worst ones.

Readable? It feels brilliant.

Not readable? It feels like the game punished you for missing a sentence in the rules that nobody ever showed you.

And that's not a polish problem. It's one of *the* problems of the genre.

---

## Losing Feels Different

In classic combat, losing usually comes down to one of these:

- you managed resources badly
- you did things in the wrong order
- you had no answer for one specific threat

In tactical combat, losing usually feels like **you overcommitted somewhere**.

A classic game tells you:

> you spent too much, healed too late, brought the wrong party, or picked the wrong plan.

A tactics game tells you:

> you stood in the wrong place, too early, for the wrong reason.

Those hurt in very different ways. The second one feels more personal, because moving *is* committing.

I kept coming back to that.

Position is commitment.

![Into the Breach](/resources/images/articles/TurnsTilesTension/IntoTheBreach.jpg)

In a good tactics game, moving stops being the setup before the action. Moving is the action. The attack is just the part you get to watch.

It's also why tactics games produce so many war stories. The unit that held the bridge. The rescue that almost didn't happen. The healer you sent way too far forward (we've all done it). The map writes the story through where people stood.

Game Developer's piece on *Into the Breach* comes at this from another angle. Justin Ma talks about how the game makes you unlearn "losing a mech is the worst thing that can happen", because the real loss condition is the civilian buildings and the power grid.[6] Which is cool on its own, but the bigger idea is:

> tactics games can move what you care about off the units and onto the board.

That's really hard to pull off on a classic battle screen.

---

## The Content Bill Is Different Too

Classic combat gets a lot of mileage out of enemy groups, stat tuning, skill interactions, boss phases, and dungeon pressure.

Tactical combat needs all of that *and* a map worth thinking about.

Obvious? Sure. But it has huge consequences.

If the map is boring, tactical combat falls apart fast.

Good tactics maps need some kind of asymmetry:

- narrow lanes vs open ground
- height changes
- a back line worth protecting
- something to escort or defend
- reinforcements that matter because of *where* they show up
- objectives that pull you away from the most efficient way to fight

So tactics encounters cost a lot more to make than they look like they do.

Put a perfectly good system on a flat rectangle and it turns into two lines trading hits until someone runs out of HP.

Classic games have their own content costs, obviously, but those mostly live in **ability design** and **encounter scripting**, not **level layout**.

If you're scoping a project, that's a big deal.

---

## Classic Isn't "Less Tactical", It's Tactical Somewhere Else

This is where a lot of these conversations go off the rails.

People talk about classic combat like it's the shallow option by default.

I don't buy that.

It's tactical in a different layer. Timing your actions, racing damage, deciding when to heal, rank manipulation, buff and debuff windows, cooldowns, building your party. All of that is tactical.

What it doesn't do is put those decisions on a literal board.

And that changes how the problem feels. In a classic game the question is usually:

> given where the fight is right now, what sequence gives me the biggest swing?

In a tactics game it's:

> how do I set up the next board before I commit to anything?

One is action-first. The other is state-first.

Way more useful than "simple" vs "deep".

---

## Pacing: Why Classic Handles Repetition Better

Something I'm more and more sure of: classic systems can handle **a lot more fights**.

Not because they're worse. Because they're cheaper to read.

If every fight asks you to read the geometry, predict threats, and commit to tiles, you can't throw fifty of them at the player before lunch. Tactics combat just burns more brain per fight.

So good tactics games usually do one of three things:

- fewer fights,
- more handcrafted maps,
- or every fight becomes a puzzle instead of a routine.

*Into the Breach* is the puzzle option. Game Developer described it as a game where you "out-maneuver and out-think" the enemy, and that's fair, because each turn is less about trading efficiently and more about putting the board back in order before everything goes wrong.[6]

Classic systems handle dungeon crawls, long stretches of fights, and grinding way more naturally, because the loop is quicker to read and quicker to play.

So if your game wants lots of fights as part of a bigger progression rhythm, classic probably fits.

If you want every fight to feel handmade and tied to its map, tactical is usually worth the extra load.

---

## Tactical Depth Isn't Strategic Depth

Small distinction, but it matters.

A lot of tactics games are great at **short-term decisions**. Urgent, local stuff:

- can I stop this threat this turn?
- can I hold this tile?
- can I survive the next wave?

![Tactics Ogre Inventory](/resources/images/articles/TurnsTilesTension/Tactics-Ogre-Reborn-Review_01.jpg)

Keith Burgun has a good way of framing this as short arcs and long arcs: tactics games nail the immediate stuff, but they still need something bigger on top to get real strategy over time.[7]

That bigger layer can be a campaign map, permadeath, roster management, an economy, upgrade paths, branching objectives.

Classic RPGs tend to get this almost for free, through attrition, money, and builds over a long game.

Tactics games sometimes have to work harder so the battle game and the campaign game don't end up as two separate things that never talk to each other.

When they get it right, it's amazing. But "deep tactical combat" doesn't automatically mean "good strategy game".

---

## Why Everyone Wants A Hybrid

Put the strengths side by side and it's easy to see why designers keep mixing them.

Classic gives you speed, clarity, rich ability sets, and UI that doesn't make you squint.

Tactical gives you drama on the map, emergent problem-solving, units that matter because of where they are, and consequences you can actually see.

So of course people try to steal from both. And sometimes it works really well.

*Triangle Strategy* has very distinct characters, clear ability roles, and a visible turn order, but the whole thing still sits on top of terrain, flanking, and placement.[4][5]

And the *Darkest Dungeon* games show how much tactical feel you can sneak into a classic setup with ranks and role pressure, without ever turning into a grid tactics game.

But hybrids have a cost.

Stack all of these into one system:

- heavy spatial reasoning
- dense ability interactions
- layered status effects
- complicated objectives

and the player ends up doing so much bookkeeping they stop enjoying any of it.

So, restraint.

A combat system doesn't need to max out every stat.

It needs to know which one is doing the heavy lifting.

---

## What Each One Is Best At Making You Feel

Probably the most practical way to look at all this.

### Classic turn-based is great at:

- tension from slowly running out of everything
- party roles playing off each other
- big momentum swings from getting the order right
- fights you can read at a glance
- that "do I have enough potions to make it back?" anxiety

### Tactical turn-based is great at:

- controlling the battlefield
- sacrifice and rescue
- flanking, trapping, blocking
- feeling clever about one very specific situation
- the weight of committing to a move

That last one surprised me the most.

Tactics games often feel more *dramatic*, not because they're more cinematic, but because a spot on the board can carry strategic and emotional weight at the same time.

A unit holding a bridge, baiting a pincer, or breaking formation to save someone isn't just doing a move. It's *in a situation*.

Classic games can absolutely do drama too, just differently: the slow drain, surviving bad odds, the clutch turn, the build finally paying off.

One gets its drama from **the board**.

The other gets it from **the system squeezing you**.

---

## So Which One Is Better?

Wrong question.

The one I'd ask instead:

> **what kind of thinking do I want the player to enjoy?**

If it's reading a system, managing pressure, getting the order right, building an efficient party, and surviving a long grind... classic is probably your pick.

If it's reading a battlefield, controlling space, taking positional risks, committing to a formation, and solving fights by moving as much as by attacking... go tactical.

Obvious once you say it out loud. But I think that's where these conversations should start.

Not with genre labels. With the kind of thinking you want to reward.

---

## Where I Ended Up

The more I dug into this, the less I cared about which one is more "sophisticated". That argument never goes anywhere.

What stuck with me was way simpler:

> classic games make me think about **what to do**.
>
> tactical games make me think about **where to become dangerous**.

Same turns. Completely different feeling.

And once I saw it that way, a lot of games I love suddenly made a lot more sense.

Anyway. Go play *Into the Breach*, then go play *Dragon Quest*, and pay attention to what your brain is doing in each one.

That's the whole article, really.

---

## References

[1] Square Enix, “Three classic DRAGON QUEST games out now on Nintendo Switch!” The article states that the series has existed since the release of *DRAGON QUEST* in 1986.  
https://www.square-enix-games.com/news/classic-dragon-quest-switch

[2] Nintendo, *Iwata Asks: Fire Emblem Fates*, section “It’s for beginners and for Fire Emblemers.” Nintendo notes that *Fire Emblem: Shadow Dragon and the Blade of Light* released in 1990 and discusses later accessibility modes such as Newcomer/Casual and Phoenix Mode.  
https://www.nintendo.com/en-gb/Iwata-Asks/Iwata-Asks-Fire-Emblem-Fates/Fire-Emblem-Fates/6-It-s-for-beginners-and-for-Fire-Emblemers/6-It-s-for-beginners-and-for-Fire-Emblemers-1032076.html

[3] Square Enix, *Tactics Ogre: Reborn* product page. Used here as an official series reference point for the *Tactics Ogre* lineage and its modern positioning.  
https://www.square-enix-games.com/en_US/games/tactics-ogre-reborn

[4] Nintendo, “Ten tactical tips for TRIANGLE STRATEGY!” Notes that positioning is key, and specifically calls out high ground, back attacks, and follow-up attacks.  
https://www.nintendo.com/en-gb/News/2022/March/Ten-tactical-tips-for-TRIANGLE-STRATEGY--2181496.html

[5] Steam store page for *TRIANGLE STRATEGY*. Describes terrain, elevation, flanking, and coordinated follow-up attacks as core parts of the battle system.  
https://store.steampowered.com/app/1850510/TRIANGLE_STRATEGY/

[6] Brendan Sinclair, “Reimagining failure in strategy game design in Into the Breach,” Game Developer, 2018. Useful for its discussion of alternative tactical failure states and how objectives shift player priorities away from simple unit survival.  
https://www.gamedeveloper.com/design/reimagining-failure-in-strategy-game-design-in-i-into-the-breach-i-

[7] Keith Burgun, “Adding Strategy to your Tactics,” Game Developer, 2021. Useful for the distinction between short tactical arcs and longer strategic arcs in turn-based design.  
https://www.gamedeveloper.com/design/adding-strategy-to-your-tactics
