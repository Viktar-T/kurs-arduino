# content/lekcje — lesson source

One folder per training day: `dzien-01` .. `dzien-10`. Inside each, one
`NN-slug.mdx` per lesson, where `NN` is the lesson's running number in the
whole course (`01`..`29`; a lesson split into parts uses `NN.MM`, e.g.
`06.01`, `06.02`). The `order` frontmatter field is the position within the
day (1, 2, 3, …) and must follow the file-name order inside the folder.
Images for lesson `NN` live in `public/img/lekcje/` as `NN.MM-name.ext`.

The file name without `.mdx` is the URL segment (`/lekcje/dzien-NN/<file name>`);
external pages link these URLs, so don't rename a published file. The
frontmatter `slug` is only an alias: `prerequisites` may reference a lesson as
`dzien-NN/<file name>` or `dzien-NN/<slug>`.

See `../../PROJECT_BRIEF.md` §4 and `../../CLAUDE.md` §6 for the full recipe
(both still describe the older "file prefix = `order`" rule; where they
disagree, this file reflects the current content).

A reference lesson lives at `dzien-01/03-srodowisko-ide.mdx` — copy it as a
template.
