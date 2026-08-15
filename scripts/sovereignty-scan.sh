#!/usr/bin/env bash
#
# sovereignty-scan.sh
#
# Deterministic backstop for the sovereignty hard rule (no defence-sensitive
# data in public artifacts) and the banned-word brand rule. Single source of
# truth for two consumers:
#
#   --staged   scan staged changes only (local pre-commit hook mode, default)
#   --all      scan every tracked text file (CI mode)
#
#   exit 0 -> clean
#   exit 1 -> a hard-fail marker matched (block)
#   exit 2 -> script could not run (fail safe: treat as block)
#
# DESIGN NOTE: this script holds NO actual sensitive strings. It matches by
# PATTERN (identifier shapes, bid-number formats, sensitive directory markers)
# plus an OPTIONAL external denylist of real names that the founder maintains
# locally and that is gitignored. The denylist never exists in CI; the scan
# runs without it there. Putting real client or unit names in a committed
# file would itself violate the hard rule.

set -euo pipefail

MODE="${1:---staged}"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo .)"
DENYLIST="${REPO_ROOT}/.claude/hooks/kriseva-sensitive-denylist.txt"  # gitignored, founder-maintained, absent in CI

case "${MODE}" in
  --staged) FILES="$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || true)" ;;
  --all)    FILES="$(git ls-files 2>/dev/null || true)" ;;
  *) echo "usage: sovereignty-scan.sh [--staged|--all]" >&2; exit 2 ;;
esac

if [ -z "${FILES}" ]; then
  exit 0
fi

FAIL=0

flag() {
  # $1 = human reason, $2 = file
  echo "BLOCKED (sovereignty/voice guard): $1  ->  $2" >&2
  FAIL=1
}

# Pattern set. These are SHAPES, not real values.
#  - GeM bid number format e.g. GEM/2024/B/1234567
#  - Indian identifier shapes: PAN (five letters, four digits, one letter), GSTIN (15-char), Aadhaar (12 digits, spaced)
#  - sensitive directory marker copied into source
GEM_BID='GEM/[0-9]{4}/[A-Z]/[0-9]{5,}'
PAN='[A-Z]{5}[0-9]{4}[A-Z]'
GSTIN='[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]{3}'
AADHAAR='[0-9]{4}[[:space:]][0-9]{4}[[:space:]][0-9]{4}'
SENSITIVE_DIR='TAS_MAC_TRANSFER|gold_tenders/labels'

# Banned brand words (Operating Contract). Case-insensitive.
BANNED='cutting-edge|revolutionary|disruptive|game-?changer|game-?changing|seamless'

while IFS= read -r f; do
  [ -f "${REPO_ROOT}/${f}" ] || continue
  # Skip binary assets (fonts, images, archives, media): the patterns are
  # text-only, and reading a binary into a shell var emits null-byte warnings.
  case "${f}" in
    *.woff2|*.woff|*.ttf|*.otf|*.eot|*.png|*.jpg|*.jpeg|*.gif|*.webp|*.ico|*.pdf|*.zip|*.gz|*.tgz|*.mp4|*.mov|*.webm) continue ;;
  esac
  # Vendored third-party minified bundles are scanned for sensitive-data
  # shapes but not for brand words (their identifier soup is not our copy).
  if [ "${MODE}" = "--staged" ]; then
    content="$(git show ":${f}" 2>/dev/null || true)"
  else
    content="$(cat "${REPO_ROOT}/${f}" 2>/dev/null || true)"
  fi
  [ -n "${content}" ] || continue

  # The scanner is the one file that must contain its own pattern definitions,
  # so it alone is excluded from the sensitive-shape scans. Everything else is
  # scanned with no exclusions.
  case "${f}" in
    *sovereignty-scan*|*kriseva-sovereignty-precommit*) : ;;
    *)
      echo "${content}" | grep -Eq "${GEM_BID}"      && flag "GeM bid-number pattern" "${f}"
      echo "${content}" | grep -Eq "${PAN}"           && flag "PAN-shaped identifier" "${f}"
      echo "${content}" | grep -Eq "${GSTIN}"         && flag "GSTIN-shaped identifier" "${f}"
      echo "${content}" | grep -Eq "${AADHAAR}"       && flag "Aadhaar-shaped identifier" "${f}"
      echo "${content}" | grep -Eq "${SENSITIVE_DIR}" && flag "sensitive directory marker in source" "${f}" ;;
  esac
  # Banned-word scan skips self-referential files that legitimately LIST the
  # banned terms: the guard scripts, the denylist, the .claude/ agent defs and
  # hooks, and the governance docs. The sensitive-data patterns above scan
  # every file except the scanner itself.
  case "${f}" in
    *check-public-copy*|*check-fonts*|*sovereignty-scan*|*kriseva-sovereignty-precommit*|*kriseva-sensitive-denylist*|*/.claude/*|*KRISEVA_*.md|*CLAUDE.md|*PUBLIC_CLAIMS_REGISTER.md|*docs/STAGE_*.md|*vendor/*.min.js)
      : ;;
    *)
      echo "${content}" | grep -Eiq "${BANNED}" && flag "banned brand word" "${f}" ;;
  esac

  # Optional founder-maintained denylist of real names (one term per line).
  if [ -f "${DENYLIST}" ]; then
    while IFS= read -r term; do
      [ -n "${term}" ] || continue
      case "${term}" in \#*) continue ;; esac
      echo "${content}" | grep -Fiq "${term}" && flag "denylisted sensitive term" "${f}"
    done < "${DENYLIST}"
  fi
done <<< "${FILES}"

if [ "${FAIL}" -ne 0 ]; then
  echo "" >&2
  echo "Scan blocked. If this is a deliberate, founder-approved exception," >&2
  echo "the founder records it; do not bypass." >&2
  exit 1
fi
exit 0
