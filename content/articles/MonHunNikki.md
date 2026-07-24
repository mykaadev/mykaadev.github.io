---
title: "Translating MonHun Nikki: Poka Poka"
date: 2026-07-24
summary: "Turning a Japanese PSP Game Into an English Build Without Setting the ISO on Fire"
thumbnail: /resources/images/articles/MonHunNikki/Lovely.png
meta_description: "Translating MonHun Nikki Poka Poka Ailu Mura G for PSP"
og_description: "Translating MonHun Nikki Poka Poka Ailu Mura G for PSP"
og_image: /resources/images/articles/MonHunNikki/Lovely.png
---
# Turning a Japanese PSP Game Into an English Build Without Setting the ISO on Fire

![MeButNpc](/resources/images/articles/MonHunNikki/Lovely.png)

## The Pitch

We had a PSP game: *Monster Hunter Diary: Poka Poka Ailu Mura G*. It never got an official English PSP release.
So the first question was simple:

> how many of you speak Japanese?

Yeah. Me neither.
The first idea was beautifully stupid:

> find Japanese text, ask AI to translate it, put it back, boot the game, profit.

I found a bunch of Japanese-looking strings, translated a ton of them, rebuilt the game... and it did not even load.
So that was lesson one:

> games do not care about your optimism.

Then we found something much better: a fan English translation for a related 3DS version.
So the new idea was simple:

> steal from our own homework, respectfully, and make the PSP game playable in English.

Easy, right? Just drag the 3DS files into the PSP game and the PSP says thank you. That's it. End of presentation. Thank you all for coming.

Except no.

![MeButNpc](/resources/images/articles/MonHunNikki/MeButNPC.png)

This became a small localization pipeline, a bit of reverse engineering, a lot of "why the fuck is this menu still Japanese?", and eventually a playable English test ISO.

## The Loop

The whole project became this:

> find a problem  
> understand why it happens  
> fix it  
> build again  
> find the next problem

That loop is basically the project. Not fancy. Very effective.

## Problem 1: How The Fuck Do We Even Find Text?

When you open a PSP ISO, it does not say:

> hello dear developer, here is `dialogue.csv`, have fun.

No.

It gives you files like `POKAPOKA.FAT`, `POKAPOKA.BHD`, `POKAPOKA.BND`, and then it looks at you like this is your problem now.

The caveman method was:

1. Search the extracted ISO for Japanese bytes.
2. Replace anything that looked like text.
3. Boot the game.
4. Watch it explode.

And yeah, it exploded.

Because text in old console games is usually not "just text." It is packed, indexed, compressed, referenced by IDs, and loaded by systems that expect the binary layout to stay exactly right.
Finding Japanese bytes is not enough. You need to know what owns the string, what points to it, how it is compressed, and whether changing it breaks the file around it.

Otherwise you are not localizing. You are vandalizing a binary and hoping it forgives you.

Spoiler: it does not.

![Barrel](/resources/images/articles/MonHunNikki/Barrel.png)

## Problem 2: The Archive

The breakthrough was realizing the useful text was packed inside the PSP archive.
Those three files each had a job:

- `FAT` maps file names to archive slots.
- `BHD` stores metadata like file IDs, sectors, raw sizes, and compressed sizes.
- `BND` stores the actual compressed file data.

So the project changed from:

> replace Japanese text

to:

> read the archive like the game does, extract the real files, edit them safely, then put them back.

That was the actual reverse-engineering work. Not sunglasses and `ENHANCE`.
More like:

> search bytes  
> find a pattern  
> write a parser  
> build something  
> crash  
> read the emulator log  
> patch less aggressively  
> boot again

Over and over.

## Problem 3: The FMG Files

Inside the archive we found `.fmg` files.
FMG files are basically text tables: text ID, string value, empty rows, control data, and tiny UI-specific bits of nonsense that show up once and ruin your evening.

So we wrote tools to parse them and export everything into:

> the glorious `psp_text.csv`

That CSV became the source of truth. Instead of editing binary blobs by hand like maniacs, we can edit rows, rebuild, and test.
Current scale:

- about 204k text rows,
- 201 PSP text files,
- most seeded from the 3DS translation,
- the rest handled by overrides, cleanup passes, and manual fixes.

That was the first real win. The text stopped being "somewhere in the ISO" and became a spreadsheet-shaped problem.
Still huge. But at least now it had handles.

## Problem 4: Reusing The 3DS Translation

The 3DS translation was a massive head start. But the PSP and 3DS versions are not identical.

Some files matched beautifully. Some had the same name but different row layouts. Some PSP screens had no clean 3DS equivalent. Some rows matched by ID. Some needed fuzzy matching. Some were technically translated but looked awful in the PSP UI because the screen had the horizontal space of a postage stamp.

So the rule became:

> reuse everything useful, but keep the PSP structure sacred.

We are not turning the PSP game into the 3DS game. We are borrowing the translation while respecting the PSP binary layout.

## Problem 5: The First Builds Broke

The first ISO builds were not graceful.
One crashed because the ISO was missing a required module:

`MHi2_Master.prx`

That was not a translation bug. That was packaging.
Another build booted to a black screen. Again, not a bad string. The ISO structure was wrong enough that the game gave us the silent treatment.

The fix was to stop rebuilding the whole ISO like we were moving house with a shovel.
The safer approach became:

1. Start from the original ISO.
2. Modify only the archive files we need.
3. Patch those files back into the ISO.
4. Leave everything else alone.

That worked.

Big lesson:

> when a game is picky about disc layout, touch less stuff.

## Problem 6: English Is Fat

Japanese is compact. English is not.

That matters because each compressed text file has to fit back into its original archive slot. If the translated file is too big, it does not fit.
Early on, the pipeline had an ugly fallback:

- if a file got too large,
- disable some translated rows,
- let those rows fall back to Japanese.

It worked, but it caused random Japanese menus and dialogue.
So we added better compression with Zopfli. Same decompression format. Smaller files. Slower builds. Who cares.

Builds can be slow. Games cannot crash.

The current working build patches 201 text files and skips 0. That is the good kind of boring.

![Expedition](/resources/images/articles/MonHunNikki/Hunt.png)

## Problem 7: The Game Booted, But The UI Was Still Weird

Once the ISO worked, the real testing started.
The game booted. Menus appeared. Some were English. Some were Japanese. Some were "English" because technically `O`, `M`, `S`, and `F` are letters.

That is not localization. That is a hostage note.
Screenshots became critical. At first, this was very manual:

> screenshot  
> find row  
> fix row  
> rebuild  
> test

But we do not want to fix a whole game one screenshot at a time. That way lies madness and a CSV open at 2 AM.
So the tools started scanning for patterns:

- enabled rows still containing Japanese,
- disabled rows that would fall back to Japanese,
- suspicious one-letter labels,
- files with weak 3DS coverage,
- and text that was probably too long for the UI.

Screenshots became evidence, not the whole investigation.

![alt text](/resources/images/articles/MonHunNikki/TranslationShowcase.png)


## Problem 8: Translation Is Not The Same As Fitting

A lot of the remaining work is not just:

> translate this Japanese

It is:

> make English fit inside UI designed for Japanese.

That is a different problem.

Table headers have tiny slots. Menu titles have fixed plaques. Item names sit beside icons. Help bars usually get one line. Speech bubbles can wrap, but not forever.

So the next phase is layout-aware editing:

- short labels stay short,
- table headers shut up and be useful,
- dialogue keeps personality but fits the bubble,
- item names stay readable beside icons,
- help text says enough without becoming a novel.

That is not bad writing. That is UI writing.

![Menu Translation](/resources/images/articles/MonHunNikki/ActualTranslation.png)


## What Happens When Something Goes Wrong?

If the game crashes, it is probably packaging, compression, archive layout, or file placement. Do not blame the comma. Check the container.

If the game boots but text is Japanese, it usually means:

- the row was never translated,
- the row was disabled,
- the text comes from another file,
- or the tester loaded old memory from a save state.

If the text is English but looks awful, it is a layout problem. Shorter wording. Better terminology. Context-specific rewrite.

Sometimes `Friendship` is better than `Overall Friendship Level`. Sometimes `Rep.` is fine. Sometimes `O` can get in the bin.

## The Current Result

Right now we have a real pipeline.
It can:

- read PSP archive text,
- compare it with the 3DS translation,
- export editable CSV rows,
- rebuild FMG files,
- compress them safely,
- patch the archive,
- build a ready-to-test ISO,
- and run on PPSSPP or a real PSP.

The current build patches 201 text files, skips 0 files, has a large amount of English UI and dialogue, and still has missing dialogue and layout polish left.

That is a strong foundation. Playable enough to enjoy. Incomplete enough to keep us humble.
Perfect balance.

![Expedition](/resources/images/articles/MonHunNikki/Hunt.png)

## The Beauty

The real work of game localization is not just writing nice English.
It is getting nice English through hostile file formats, old hardware assumptions, strict archive layouts, compression limits, tiny UI boxes, weird platform differences, and a build process that can betray you before lunch.

That is the job.

And when the ISO finally boots, the text appears, and the player says:

> yo, it worked

Yeah.

That part rules.

![The Game](/resources/images/articles/MonHunNikki/Banner.png)