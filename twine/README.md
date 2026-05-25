# Tales of Visteria Twine Draft

This folder contains a Twine/Twee recreation of the current story flow.

## Files

- `Tales_of_Visteria.twee`: readable source version of the story passages.

## Notes

Twine itself may not directly import `.twee` files depending on your version/setup. If your Twine app does not import this file directly, use it as the clean source of truth for passages, or compile it with Tweego later.

This draft is meant for story planning and branch review. The Python desktop game still contains the full GUI, save system, combat engine, stats, and inventory behavior.

## Best Editing Pattern

For future changes, editing in this style is much easier for Codex to follow than Visio:

```text
:: Passage Name
Scene text goes here.

[[Choice text->Next Passage]]
```

For rolls and conditions, keep them visible in the passage:

```text
(set: $roll to (random: 1, 20))

(if: $roll <= 10)[Failure result]
(else:)[Success result]
```
