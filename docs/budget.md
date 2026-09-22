# Runtime budget

Stated before measurement (until-100 leanness):

- **Budget:** first-load JS transfer for `/` (Next build client+shared+framework
  chunks referenced by the route) **≤ 500 KB** gzip-equivalent local
  uncompressed sum of `.next/static/chunks` entry assets for `/` **≤ 900 KB**.
- **Critical path:** `run_simulation` / paint on `/`.
- Measure after `npm run build` from route chunk listing / `.next` analyze.
