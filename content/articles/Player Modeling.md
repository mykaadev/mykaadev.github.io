---
title: "Player Modeling"
date: 2021-06-14
summary: "Adapt the game, not the player. A tour of player modeling, drama managers, and player types in RPGs."
thumbnail: /resources/images/articles/PlayerModeling/PlayerModeling.png
meta_description: "Adapt the game, not the player. A tour of player modeling, drama managers, and player types in RPGs."
og_description: "Adapt the game, not the player. A tour of player modeling, drama managers, and player types in RPGs."
og_image: /resources/images/articles/PlayerModeling/PlayerModeling.png
showcases: [playermodeling]
---

# Player Modeling
*Or: adapt the game, not the player*

This article started life as a paper. I rewrote it here because a PDF is a strange place for an idea that is all about games reacting to you. Most of the original figures are now things you can poke at, so please do.

The short version of the pitch:

> RPGs already watch everything you do. Most of them do surprisingly little with it.

Every RPG knows which quests you finished, who you talked to, what you stole, how often you died, and how long you spent in that one cave. That is a lot of information about **who you are as a player**. Player modeling is the field that asks what happens if the game actually uses it.

In the AAA space this tends to be underused. Plenty of games have systems that look like they react to you, but very few go deep enough to really change the experience. That gap is what this article is about.

---

## The Basic Idea

When a game watches how you interact with its world, it can build a **player model**: a profile that reflects your preferences and behaviour. A system usually called a **Drama Manager** (DM) can then read that profile and adapt parts of the game: the story, the content, how characters behave, and what you are asked to do.

Player profiles are the core of player modeling,[1] and they get used for a lot more than story. Adjusting difficulty, generating personalized content, building believable characters, analysing playtest data, and yes, monetization in free-to-play games.[2]

The payoff is pretty simple. If the game fits itself to you, two people can play the same game and walk away with genuinely different experiences. That means more personal stories and much more replay value.

You can already see some of this in commercial games. The clearest example for me is **Skyrim** (Bethesda, 2011). Its Radiant AI and Radiant Story systems track your actions, decisions, and character, and the world reacts to them. It is not perfect, but it is enough to make the world feel less like a script and more like a place.

---

## Interactive Storytelling

In **Interactive Storytelling** the narrative is not fixed. It evolves based on what the player does and decides.[3] You are not reading the story, you are steering it.

The classic way to build this in an RPG is a **branching story graph**. Each node is a key moment that needs a decision, and each arc is a possible path the story can take from there.

Here is a small one. Start at the square, pick a node, and find your way to one of the three endings.

<div class="ns-showcase">
<figure class="pm-story">
<figcaption>A branching story graph. Nodes are decisions, arcs are the paths between them, and the triangles are endings.</figcaption>
<div class="pm-fallback">
<p>The start leads to a stranger who asks for help. You can follow the stranger or report them to the guard. Those paths split into the ruins, an ambush on the road, or the guard captain, then into a hidden archive or a bandit camp, and finally into three endings: the scholar, the mercenary, and the warden.</p>
</div>
</figure>
</div>

Even this toy graph hides more stories than it seems to, because branches fold back into each other. That is both the strength and the problem of hand-authored branching: every new branch is more content to write, test, and keep coherent.

More advanced systems try to make the graph smarter instead of just bigger:

- building **player profiles** to tailor the narrative to individual preferences,[4]
- using **feedback from previous players** to design stories that appeal to a broader audience,[5]
- using **prediction** to work out which paths a player is most likely to choose, and preparing for that.[6]

All three share the same goal: a story that fits the person playing it.

---

## Drama Managers

A story that bends to the player still needs to make sense. That is the job of the **Drama Manager**. It watches what the player does, adjusts the narrative to reflect those choices, and still protects the goals of the author.

Drama managers differ mostly in one thing: how much freedom they give to the computer-controlled characters, the **agents**. There are three broad families.

<div class="ns-showcase">
<figure class="pm-dm" data-start="central">
<figcaption>Three ways to manage drama. Switch between them and watch who gets to make decisions.</figcaption>
<ul>
<li data-mode="central"><b>Centralized</b> One drama manager has full control over the characters and the direction of the story. It watches the player and adapts the plot so it stays coherent. Good for building player profiles, maximising the quality of the experience, or keeping the player on a specific emotional path.</li>
<li data-mode="distributed"><b>Distributed</b> No director. Every agent decides for itself and reacts to the player and the world. The story emerges from those interactions, without a predefined plot.</li>
<li data-mode="mixed"><b>Mixed</b> Agents are autonomous, but a drama manager oversees the plot and steps in when needed. It can suggest actions to the player or nudge agents so key events still happen, and the player never gets stuck in a contradiction.</li>
</ul>
</figure>
</div>

### Centralized

A single DM has complete control. It is the most "authored" option, and it is the one you reach for when you want a precise result. One nice example is research on keeping the player on a planned **emotional trajectory** through the story.[7]

### Distributed

Here the story is not written at all, it **emerges**. Marc LeBlanc popularised the term *emergent narrative* at GDC 2000: a story that nobody wrote into the game, which comes out of the player bumping into the game's systems. Great for surprise. Not so great when you need the plot to actually go somewhere.

### Mixed

The middle ground, and honestly the most practical one. Agents live their own lives, but the DM keeps an eye on the big picture and quietly pushes when the story drifts too far.

### Skyrim as a mixed example

Skyrim is a good example of mixed drama management. Most NPCs follow their own routines: work, eat, sleep, repeat. But when you trigger certain events, they change their goals to match the new state of the world. Steal from the wrong person or attack a village, and you might get a letter about hired thugs coming for you.

The structure of the story stays in place, and the NPCs still feel like they have a life of their own. That balance is the whole point.

---

## Player Modeling

For a game to adapt to you, it first has to **know** something about you. Player modeling is the process of observing and interpreting your **cognitive, affective, and behavioural patterns** to build a model of your personality, motivations, and traits.[8]

It breaks down into three steps.

### 1. Data collection

The game gathers data from what you do:

- **Behavioural data**: your choices, the time you spend on tasks, how you explore.
- **Cognitive data**: how you approach problems and strategies, usually inferred from play.
- **Affective data**: emotional responses like frustration or excitement. These can be implicit (reaction times) or explicit (a survey).

### 2. Pattern detection

Algorithms then look for patterns in that data. Do you prefer exploring or finishing tasks? Do you take risks in combat or with resources? Do you seek out NPCs and other players, or avoid them?

### 3. Model creation

Finally the patterns become a **statistical model** of you. That can include:

- **Personality traits**, like boldness, curiosity, or caution.
- **Playstyles**, like explorer, achiever, socializer, or competitor.
- **Emotional states**, and how they influence your decisions.

Put it all together and you get a loop. The player acts, the engine records a trace, the modeling step turns that trace into a player model, and the drama manager uses the model and the game state to decide what happens next.

Try it. Do a few things in the world and see how the model and the drama manager respond.

<div class="ns-showcase">
<figure class="pm-loop">
<figcaption>The player modeling loop. Each action goes into the trace, updates the model, and the drama manager picks what to offer next. Older actions fade, so the model can follow you if you change your mind.</figcaption>
<div class="pm-fallback">
<p>The player interacts with the game engine. The engine sends a player trace to the player modeling step, which builds a player model. The drama manager reads the model and the game state (physical state, story state, and history) and sends DM actions back to the game engine.</p>
</div>
</figure>
</div>

This is obviously a toy, but the shape is real. The interesting design questions are all hidden in the small details: how fast should old behaviour fade, how confident should the model be before the game commits, and what should the DM offer when it is not sure yet?

---

## What You Can Do With A Player Model

Once you have a model, there are a lot of places to plug it in.

### Adapting the game experience

This is the most direct use: the game changes itself to fit your preferences, abilities, and playstyle.

- **Narrative personalization**: the story picks paths that fit your choices, traits, or emotional state.
- **Game content**: missions and puzzles get chosen or modified to match your interests or skill. Explorers get discovery quests, fighters get action.
- **Mechanics adjustment**: speed, difficulty, or resource availability change in real time. Stuck on a puzzle? Here is a hint.
- **Real-time hints and tutorials**: if you look lost, the game gives you context, without touching the difficulty at all.
- **Dynamic Difficulty Adjustment (DDA)**: completion time, death count, and response patterns tell the game how to tune the challenge, so you stay in the *flow* state between frustration and boredom.

DDA is the easiest one to show. A fixed difficulty curve is tuned for one imaginary average player. Everyone else drifts out of the sweet spot.

<div class="ns-showcase">
<figure class="pm-flow">
<figcaption>Skill against challenge over one playthrough. The pink band is flow. Above it is anxiety, below it is boredom.</figcaption>
<div class="pm-fallback">
<p>A fixed difficulty curve keeps the average player in flow, but a slow learner ends up anxious and a fast learner ends up bored. With dynamic difficulty adjustment, the challenge follows the skill of each player and all three stay close to the flow channel.</p>
</div>
</figure>
</div>

That is the title of this article in one chart. The fixed curve asks the player to fit the game. DDA makes the game fit the player.

### Personalized content creation

Player models also feed content generation, which helps a lot with replayability.

**Procedural Content Generation (PCG)** builds content with algorithms and player data:

- **Level design** that leans into exploration for curious players, or into linear paths for action-focused ones.
- **Story generation** that reflects your choices, personality, or mood. Versu is a good example of a character-driven system in this space.
- **Dynamic NPCs** whose looks, behaviour, and dialogue fit how you have treated them.

**Search-based** generation goes one step further. It generates several options, scores them against the player model, and keeps the best one. A combat encounter can pick its enemy composition to match your preferred difficulty. A story-driven game can predict your likely choices and prepare content for those paths.

### Believable agents

Player models make NPCs feel a lot more human.

- **Social interactions**: an NPC changes its tone and dialogue depending on whether you tend to be aggressive, passive, or cooperative.
- **Emotional reactions**: gratitude, anger, or distrust, based on the history between you.
- **Emergent behaviour**: in a game with political intrigue, NPCs can form alliances or rivalries with you that evolve over time and shape the larger story.

### Playtesting and analytics

Not all uses are in-game:

- **Playstyle analytics** show how different kinds of players engage with the game, and where it is too hard, unclear, or boring.
- **Heatmaps and behaviour patterns** help designers fix level layouts or find mechanics nobody uses.
- **Monetization feedback** in free-to-play games identifies the players likely to spend, ideally without becoming intrusive about it.

### Multiplayer

- **Dynamic matchmaking** groups players with complementary playstyles or skill levels.
- **Team dynamics** in co-op games adjust objectives or roles based on what each player is good at.

---

## Player Types

You cannot model players without some idea of what kinds of players exist. Over the years a few classifications have become the standard references.

### Glenn Blacow: four aspects of adventure gaming

One of the earliest documented classifications of RPG players comes from Glenn Blacow.[9] He describes four aspects of play, arranged on two axes:

- **Power gaming**: getting power, resources, and abilities as efficiently as possible.
- **Role-playing**: becoming your character and living in the fiction.
- **Wargaming**: strategy, tactics, and mastery of the rules.
- **Storytelling**: the narrative and the emotional experience.

The important part is that nobody is just one of these. The full experience comes from how they mix.

<div class="ns-showcase">
<figure class="pm-plane" data-y-high="Personal goals" data-y-low="Campaign goals" data-x-low="Pure fantasy" data-x-high="Simulation" data-center="Realism" data-start="-0.25,0.35">
<figcaption>Blacow's four aspects. Drag the dot to see how a player mixes them.</figcaption>
<ul>
<li data-x="0" data-y="0.82"><b>Power gaming</b> You chase personal goals: power, resources, and abilities, gained as efficiently as possible. Optimization and grinding feel good to you.</li>
<li data-x="0.82" data-y="0"><b>Wargaming</b> You lean toward simulation: strategy and tactics, careful planning, and real mastery of the mechanics.</li>
<li data-x="0" data-y="-0.82"><b>Storytelling</b> You care about the campaign: the world, the characters, and where the plot goes next, more than the mechanics.</li>
<li data-x="-0.82" data-y="0"><b>Role-playing</b> You lean toward pure fantasy: you become your character and explore the fiction from the inside.</li>
</ul>
</figure>
</div>

### Richard Bartle: the four archetypes

Richard Bartle's work on Multi-User Dungeons (MUDs) is probably the most famous one.[10] It was built for multiplayer, but it maps nicely onto single-player RPGs too. It sorts players on two axes: do they prefer **acting on** or **interacting with**, and do they care more about **players** or the **world**?

- **Explorers** want to discover new areas, content, and mechanics.
- **Killers** want to compete and dominate other players or NPCs.
- **Achievers** want goals, rewards, levels, and collections.
- **Socializers** want to interact with others: cooperation, trade, conversation.

<div class="ns-showcase">
<figure class="pm-plane" data-y-high="Acting" data-y-low="Interacting" data-x-low="Players" data-x-high="World" data-start="0.35,-0.2">
<figcaption>Bartle's archetypes. Drag the dot around the plane.</figcaption>
<ul>
<li data-x="-0.62" data-y="0.62"><b>Killers</b> You act on other players. Competition, combat, and proving you are better are the fun part.</li>
<li data-x="0.62" data-y="0.62"><b>Achievers</b> You act on the world. Objectives, rewards, levels, and full collections keep you going.</li>
<li data-x="-0.62" data-y="-0.62"><b>Socializers</b> You interact with other players. Cooperation, trade, and conversation are the main reason you play.</li>
<li data-x="0.62" data-y="-0.62"><b>Explorers</b> You interact with the world. New areas, hidden details, and how the systems work are what pull you in.</li>
</ul>
</figure>
</div>

### Robin D. Laws: seven archetypes

Robin D. Laws came at this from tabletop game mastering, and proposed seven types:[11]

- **Power Gamer**: wants more power, stats, and abilities.
- **Butt-Kicker**: wants to fight things.
- **Tactician**: wants complex problems and good strategies.
- **Specialist**: wants to master one skill or one aspect of the game.
- **Method Actor**: wants to live inside their character, morals and all.
- **Storyteller**: wants to shape and experience the narrative.
- **Casual Gamer**: wants a relaxed time without heavy investment.

What I like about this one is that it covers the *why*, not just the *what*.

### BrainHex

BrainHex is more recent and takes a psychological approach, grounded in neurobiology and how players respond to games.[12] Its seven types:

- **Seeker**: discovery, curiosity, novelty.
- **Survivor**: overcoming adversity, often in stressful situations.
- **Daredevil**: thrills and risk.
- **Mastermind**: strategy, logic, and outsmarting opponents.
- **Conqueror**: mastery and dominance over hard challenges.
- **Socializer**: interaction and cooperation.
- **Achiever**: progression, completion, and collecting.

Because it is rooted in psychology, BrainHex is especially useful for the *why* behind a preference, which is exactly what a player model wants to know.

---

## Quest Types

If the drama manager is going to offer you something, it needs a vocabulary of things to offer. In RPGs that vocabulary is mostly **quests**, and there are a few useful ways to classify them.

### Time, place, and objective

Espen Aarseth proposed a simple split into three kinds:[13]

- **Time-oriented**: beat the clock. Stop the catastrophe, or finish the tasks within a set number of in-game hours.
- **Place-oriented**: get somewhere. Find the hidden cave, reach the remote village, uncover what is there.
- **Objective-oriented**: do the thing. Retrieve the artifact, defeat the monster, rescue the NPC. By far the most common.

Each one leans on a different part of play: urgency, exploration, or achievement.

### NPC motivations

Why does the NPC need *you*? Doran and Parberry analysed RPG quests and grouped NPC motivations into categories.[14] A few examples:

- **Knowledge**: gather information or uncover a secret.
- **Spirit**: help someone through a personal or spiritual struggle.
- **Comfort**: resolve a fear or make someone safe.
- **Reputation**: improve someone's status or standing.
- **Protection**: guard something or someone important.
- **Conquest**: push for aggression or expansion.
- **Wealth**, **potential**, and **equipment**: riches, new abilities, or better gear.

### Quest structures

Dickey looked at quests from the side of what the player actually has to do:[15]

- **Bounty**: track down and eliminate a target for a reward. Pure action.
- **FedEx**: deliver an item or a message. Not exciting, but it connects the world and encourages exploration.
- **Messenger**: like FedEx, but with more NPCs and threats along the way.
- **Collection**: gather specific items, from enemies or the world.
- **Escort**: keep an NPC alive through dangerous areas. Strategy and resource management.
- **Goodwill**: improve your relation with an NPC or faction, and unlock new opportunities.

Mix motivations with structures and you get a big, varied space of quests that a drama manager can pick from for each kind of player. That is exactly what the loop demo above does: an Explorer gets a place-oriented quest about knowledge, and a Killer gets a bounty about protection.

---

## Machine Learning In Games

Early game AI was mostly about **pathfinding** and simple **decision-making**: get the NPC from A to B and make it react in basic ways. Over time the industry moved to more complex AI and machine learning to improve the player experience.

Machine learning in games tends to aim at three things:

- **Challenging adversaries** that learn from your tactics and adapt, instead of following a script no matter what you do.
- **Believable NPCs** that remember past interactions and change because of them.
- **Personalized experiences**, where the game notices that you prefer combat over exploration and adjusts quest objectives or dialogue to match.

That last one is player modeling again. Here are two research examples that I find especially useful.

### Classifying players in MMORPGs

Anagnostou and Maragoudakis used the **CURE clustering algorithm**[17] to classify MMORPG players by playstyle from behaviour data.[16] They split players into two groups: **action players**, who like fast, combat-heavy play, and **tactical players**, who prefer slower, strategy-driven challenges.

Once you know which group someone falls into, you can give hardcore action players tougher encounters and give tactical or casual players something more accessible. It is a simple split, but it shows the whole pipeline working end to end.

### Persistent agents

Merrick and Maher introduced **Motivated Reinforcement Learning (MRL)** agents for persistent game worlds.[18] These NPCs explore and learn from their environment, and develop new skills based on their motivations and the rewards they receive.

The core of it is **Q-learning**: the agent tries to maximise its expected reward over time and adjusts its behaviour from experience. They tested this in **Second Life**, where NPCs could adapt to what players did and keep evolving as play went on.

The result is NPCs that are not static. They grow and change in response to the world and to the players in it, so they feel less like programmed characters and more like entities living there.

---

## Where This Goes Next

All of the pieces are on the table now. Drama managers that can steer a story. Player types that describe what people enjoy. Quest vocabularies to build offers from. And machine learning techniques that can turn raw behaviour into a profile.

The next step, and the one I am working on, is to put them together into one architecture: **machine learning that reads what a player does, matches that behaviour to a player profile, and lets a drama manager tailor the game to that profile**. A decision tree is a good first candidate for the classification step, because it is fast and, more importantly, you can actually read why it decided what it decided.

The goal is the same one that has run through this whole article:

> **More replayability, deeper immersion, and more of the story in the hands of the player.**

Or, shorter: adapt the game, not the player.

---

## References

[1] Beal, C., Beck, J., Westbrook, D., Atkin, M., & Cohen, P. (2002). Intelligent modeling of the user in interactive entertainment. *AAAI Stanford Spring Symposium*, Stanford, CA.

[2] Yannakakis, G. N., Spronck, P., Loiacono, D., & André, E. (2013). Player Modeling. In S. M. Lucas, M. Mateas, M. Preuss, P. Spronck, & J. Togelius (Eds.), *Artificial and Computational Intelligence in Games* (Dagstuhl Follow-Ups, Vol. 6, pp. 45–59). Schloss Dagstuhl–Leibniz-Zentrum fuer Informatik.  
https://doi.org/10.4230/DFU.Vol6.12191.45

[3] Kelso, M. T., Weyhrauch, P., & Bates, J. (1993). Dramatic presence. *Presence: Teleoperators & Virtual Environments*, 2(1), 1–15.

[4] Nelson, M. J., & Mateas, M. (2008). Another look at search-based drama management. *Proceedings of the 7th International Joint Conference on Autonomous Agents and Multiagent Systems*, 1293–1298.

[5] Sharma, M., Ontañón, S., Strong, C. R., Mehta, M., & Ram, A. (2007). Towards player preference modeling for drama management in interactive stories. *FLAIRS Conference*, 571–576.

[6] Yu, H., & Riedl, M. (2015). Optimizing players' expected enjoyment in interactive stories. *Proceedings of the 11th AAAI Conference on Artificial Intelligence and Interactive Digital Entertainment*.

[7] Hernandez, S. P., Bulitko, V., & Spetch, M. (2015). Keeping the player on an emotional trajectory in interactive storytelling. *Eleventh Artificial Intelligence and Interactive Digital Entertainment Conference*.

[8] Drachen, A., Canossa, A., & Yannakakis, G. N. (2009). Player modeling using self-organization in Tomb Raider: Underworld. *IEEE Symposium on Computational Intelligence and Games*, 1–8.

[9] Blacow, G. (1980). Aspects of adventure gaming. *Different Worlds*, 10, 36–39.

[10] Bartle, R. (1996). Hearts, clubs, diamonds, spades: Players who suit MUDs. *Journal of MUD Research*, 1(1), 19.

[11] Laws, R. D. (2002). *Robin's Laws of Good Game Mastering*. Steve Jackson Games.

[12] Nacke, L. E., Bateman, C., & Mandryk, R. L. (2014). BrainHex: A neurobiological gamer typology survey. *Entertainment Computing*, 5(1), 55–62.

[13] Aarseth, E. (2003). Playing Research: Methodological approaches to game analysis. *Proceedings of the Digital Arts and Culture Conference*, 28–29.

[14] Doran, J., & Parberry, I. (2010). Towards procedural quest generation: A structural analysis of RPG quests. *Dept. Comput. Sci. Eng., Univ. North Texas, Tech. Rep. LARC-2010-02*.

[15] Dickey, M. D. (2007). Game design and learning: A conjectural analysis of how massively multiple online role-playing games (MMORPGs) foster intrinsic motivation. *Educational Technology Research and Development*, 55(3), 253–273.

[16] Anagnostou, K., & Maragoudakis, M. (2009). Data mining for player modeling in videogames. *13th Panhellenic Conference on Informatics*, IEEE, 30–34.

[17] Guha, S., Rastogi, R., & Shim, K. (1998). CURE: An efficient clustering algorithm for large databases. *ACM SIGMOD Record*, 27, 73–84.

[18] Merrick, K., & Maher, M. L. (2006). Motivated reinforcement learning for non-player characters in persistent computer game worlds. *Proceedings of the 2006 ACM SIGCHI International Conference on Advances in Computer Entertainment Technology*, ACM, 3.
