# content/projekty — project source

Projects are self-contained page series outside the 10-day timetable.
One folder per project (lowercase ASCII slug, e.g. `monitorowanie`); each
`NN-slug.mdx` inside is one page, where `NN` is the two-digit `order`.

- `00-wprowadzenie.mdx` (`part: 0`, with `projectTitle`) is the overview,
  served at `/projekty/<project>`.
- Every other page is served at `/projekty/<project>/<file name without .mdx>`,
  e.g. `/projekty/monitorowanie/01-szkielet-systemu`. External sites link these
  URLs, so don't rename a published file.
- Images live in `public/img/projekty/<project>/` as `NN.MM-name.ext`.
- Frontmatter is validated by `ProjectPageFrontmatter` in `lib/frontmatter.ts`;
  the build fails on any invalid page.
- `prerequisites` may list course lesson hrefs (`/lekcje/dzien-NN/<file-slug>`)
  and project page hrefs (`/projekty/<project>` or
  `/projekty/<project>/<file-slug>`); both become links labelled with the page
  title. When the body renders its own `<Prerequisites>` box, the frontmatter
  box is skipped.

See `../../PROJECT_BRIEF.md` §4.5 and `../../CLAUDE.md` §6a for the full contract.
