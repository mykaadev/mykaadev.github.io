---
title: "Patching MonHun: Poka Poka"
date: 2026-07-24
summary: "Turning a Japanese PSP Game Into an English Build Without Setting the ISO on Fire"
thumbnail: /resources/images/articles/MonHunNikki/Lovely.png
meta_description: "Translating MonHun Nikki Poka Poka Ailu Mura G for PSP"
og_description: "Translating MonHun Nikki Poka Poka Ailu Mura G for PSP"
og_image: /resources/images/articles/MonHunNikki/Lovely.png
project: /projects/poka-poka-translation/
---
# Turning a Japanese PSP Game Into an English Build Without Setting the ISO on Fire

![MeButNpc](/resources/images/articles/MonHunNikki/Lovely.png)

## The Pitch

We had a PSP game: *Monster Hunter Diary: Poka Poka Ailu Mura G*. It never got an official English release.
So the first question was simple:

> how many of you speak Japanese?

Yeah. Me neither.
The first idea was beautifully stupid:

> find Japanese text, ask AI to translate it, put it back, boot the game, profit.

I found a bunch of Japanese-looking strings, translated a ton of them, rebuilt the game... and it did not even load.
So that was lesson one:

> games do not care about your optimism.

Then we found something much better: a fan English translation of the 3DS version, *Poka Poka Airou Village DX*, made by **L-StarJP** and the people helping them. Huge respect. Most of the English in this patch exists because they did the hard part first.

So the new idea was simple:

> steal from our own homework, respectfully, and make the PSP game playable in English.

Easy, right? Just drag the 3DS files into the PSP game and the PSP says thank you. That's it. End of presentation. Thank you all for coming.

Except no.

![MeButNpc](/resources/images/articles/MonHunNikki/MeButNPC.png)

This became a small localization pipeline, a bit of reverse engineering, a lot of "why the fuck is this menu still Japanese?", and eventually a playable English build.

## The Loop

The whole project became this:

> find a problem  
> understand why it happens  
> fix it  
> build again  
> find the next problem

That loop is basically the project. Not fancy. Very effective.

The one thing I'd add now, after getting burned a few times:

> check the thing the player actually sees, not the thing you think you changed

More on that later. It matters.

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

The breakthrough was realizing almost everything lives inside one big archive, split across three files:

- `FAT` is the phone book: file names and which slot each one is in.
- `BHD` has one small record per slot: file ID, where the file starts, its real size and its compressed size.
- `BND` is the actual data, about 176 MB of it. Most files inside are zlib-compressed one by one.

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
FMG is a FromSoftware text-table format (yes, the Souls people; the font and archive formats turned out to be theirs too). Each table is basically: text ID, string, and a lot of empty IDs that are still important because the game asks for them by number.

So we wrote tools to parse them and export everything into:

> the glorious `psp_text.csv`

Every row has the Japanese original, the 3DS English if there is one, and the English we actually ship. That CSV became the source of truth. Instead of editing binary blobs by hand like maniacs, we edit rows, rebuild, and test.

Current scale:

- about 204k rows (empty IDs included),
- 201 text tables,
- around 180k rows seeded from the 3DS translation,
- the rest handled by PSP-only rows, cleanup passes, and fixes.

That was the first real win. The text stopped being "somewhere in the ISO" and became a spreadsheet-shaped problem.
Still huge. But at least now it had handles.

## Problem 4: Reusing The 3DS Translation

The 3DS translation was a massive head start. But the PSP and 3DS versions are not identical.

Most files share names and IDs, so the port matched rows by file and ID. Lines with the exact same Japanese got the same English everywhere. And for a while that looked great.

Then someone opened an issue on GitHub: the Informant asks "do you want an explanation?", and instead of Yes/No you get to pick... two lines of the Informant's own dialogue.

What happened: in that conversation the 3DS script has one extra line that the PSP doesn't. Matching by ID meant everything after it slid down two slots. The question went blank, and the choices became dialogue. It hit every one of those explanation talks.

So the rule became:

> reuse everything useful, but keep the PSP structure sacred.

And the tools learned to look for the fingerprint of a shift: a blank row and text sitting in an ID the PSP never uses, in the same conversation. If that shows up, the build complains before the player does.

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
3. Write them back into the ISO at the exact same spot.
4. Leave everything else alone.

That worked.

Big lesson:

> when a game is picky about disc layout, touch less stuff.

## Problem 6: English Is Fat

Japanese is compact. English is not.

That matters because each compressed text file has to fit back into its original slot in the archive. If the translated file is too big, it does not fit.
Early on, the pipeline had an ugly fallback:

- if a file got too large,
- disable some translated rows,
- let those rows fall back to Japanese.

It worked, but it caused random Japanese menus and dialogue.
So we switched to Zopfli: same zlib format the game already reads, just squeezed harder. Smaller files. Slower builds. Who cares.

Builds can be slow. Games cannot crash.
(Later the build learned to cache compressed files, so a rebuild went from over a minute to a few seconds. Turns out you can have both.)

![Expedition](/resources/images/articles/MonHunNikki/Hunt.png)

## Problem 7: Every Conversation Exists Twice

This one is my favourite, because it is so dumb.

People kept reporting "filler" lines that were still Japanese. The Elder says something like "By the way, you..." and it's Japanese. But the CSV had it translated. The archive we built had it translated. And the game still showed Japanese.

Turns out every talk script in the game ships **twice**: once as `tc702.fmg`, and once as `tc702.zipfmg`. Same text, packaged differently. Some parts of the game read one, some read the other. We only ever patched the first.

151 conversations. **44,065 lines** that were translated and never reached the screen.

The fix is boring: write both copies from the same rows. The lesson is not:

> stop trusting your input, check your output

So now every build opens the finished ISO, decodes every text table in it, and counts what is still Japanese. If a line is translated in the CSV but not in the ISO, the build fails. After the fix: 352 text tables patched, and 99.8% of the Japanese lines in them are English. The rest is the name filter list, which stays Japanese on purpose.

## Problem 8: It Was The Font All Along

Once the ISO worked, the real testing started.
The game booted. Menus appeared. Some were English. Some were "English" because technically `O`, `M`, `S`, and `F` are letters.

That is not localization. That is a hostage note.

For a long time we blamed the text. Labels were too long, so we shortened them. Then shortened them more. Then they were one letter.

Then we looked at the font.

The font data says how far to move after each character. And for English letters it said: basically as far as a kanji. A space was as wide as a whole Japanese character. A period too. So every English line was spaced like this, and a speech bubble built for 14 Japanese characters fit about 17 English letters.

The fix was to patch the font itself: measure every English letter in the font image and give it its real width. Lines got 30 to 40% shorter overnight, without changing a single word.

It took two more tries to get right, which is very on brand:

- First try: letters squashed into each other. Turns out the game stretches each letter's image to the width you give it, so you have to cut the image down to the letter, not just move it closer.
- Second try: little boxes and stray lines around title letters. The title letters are packed edge to edge in the font image, so cutting with a margin grabbed a slice of the neighbour. Now the cut never leaves the letter's own cell.

The title font got squeezed to 80% width on top of that, because Japanese screen titles are four kanji wide and "VILLAGE STATUS" is not.

![alt text](/resources/images/articles/MonHunNikki/TranslationShowcase.png)

## Problem 9: Translation Is Not The Same As Fitting

With a sane font, the question finally became the right one:

> make English fit inside UI designed for Japanese.

How big is a box? Nobody tells you. But the Japanese text fits its box by design. So the tools measure every line in pixels with the real font, and the Japanese in the same file tells you the limit. A label gets a bit more room than its Japanese. A speech bubble gets what the Japanese dialogue uses. A screen title gets what the Japanese title had.

Then:

1. Re-break lines for the new font. That alone fixed about 6,700 rows without touching a word.
2. Re-word what still doesn't fit. About 1,700 lines (labels, help bars, item text, profiles, quest text, titles) were re-translated from the Japanese to fit their box.

Honesty corner, since the first version of this article wasn't great about it: AI helped a lot here, both writing the tools and drafting the re-worded lines. But nothing goes in on vibes. Every proposed line gets checked by a script: it has to fit the box in pixels, keep every name/number placeholder exactly, and only use characters the PSP font can draw. Anything that fails doesn't go in. And the screenshots are still the final judge.

That is not bad writing. That is UI writing.

![Menu Translation](/resources/images/articles/MonHunNikki/ActualTranslation.png)

## What Happens When Something Goes Wrong?

If the game crashes, it is probably packaging, compression, archive layout, or file placement. Do not blame the comma. Check the container.

If the game boots but text is Japanese, it usually means:

- the row was never translated,
- the row was disabled,
- the text comes from another file (or another copy of the same file, hi `.zipfmg`),
- or the tester loaded a save state.

That last one deserves its own line. Save states restore the game's memory, including the old text. The CSV says it's fixed, the ISO says it's fixed, the screen says it isn't. For translation testing: boot fresh, load a normal save. Save states are great for gameplay. Terrible witnesses.

If the text is English but the choices or lines feel off, check the rows around it. It might be shifted.

If the text is English but looks awful, it is a layout problem. Shorter wording. Better terminology. Context-specific rewrite.

Sometimes `Friendship` is better than `Overall Friendship Level`. Sometimes `Affinity` is better than `Friendshi`. Sometimes `O` can get in the bin.

## The Current Result

Right now we have a real pipeline.
It can:

- read the PSP archive,
- export every text table to one CSV,
- check the CSV before building (broken placeholders, shifted conversations, text too wide for its box),
- rebuild the text tables, both copies,
- patch the font,
- compress everything to fit,
- build a ready-to-test ISO,
- check the finished ISO for anything still Japanese,
- and boot it in PPSSPP.

What's still on the list:

- Dialogue. Most of it comes from the 3DS translation line by line, and some sentences read like they were translated without seeing the next line (because they were). The next pass re-translates whole conversations at once.
- Weapon and armour names from the hunter equipment tables.
- A few hundred lines that live outside the text tables, plus a handful of strings baked into the game code.
- Making names consistent (there's a Bullfango boss that currently has about four English names).

Playable enough to enjoy. Incomplete enough to keep us humble.
Perfect balance.

![Expedition](/resources/images/articles/MonHunNikki/Hunt.png)

## The Beauty

The real work of game localization is not just writing nice English.
It is getting nice English through hostile file formats, old hardware assumptions, strict archive layouts, compression limits, tiny UI boxes, a font that thinks a space is a kanji, duplicate files nobody told you about, and a build process that can betray you before lunch.

That is the job.

And when the ISO finally boots, the text appears, and the player says:

> yo, it worked

Yeah.

That part rules.

![The Game](/resources/images/articles/MonHunNikki/Banner.png)
