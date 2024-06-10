# Treat Wounds

Try it out at: https://treatwounds.netlify.app

A quick and dirty solution for Treat Wounds taking a lot of table-time in PF2E.

Supports:

- Various sources of bonuses have a static bonus field
- Rolling aid checks for another party member, and calculate that into their bonus
  - Aid checks can treat failure as a success in settings.
- Feat: Risky Surgery - bonus to your medicine roll, and damage is listed seperately, so you can see amount healed, harmed, and the net.
- Feat: Magic hands - roll d10s instead of d8s.
- Dedication: Medic - additional healing when you treat wounds based on your target dc
- A log out outputs, to help you track healing over time.
- local persistence via browser storage. (cross-device storage not supported)

![image](https://github.com/matthewoden/treat-wounds/assets/4907424/e5641849-5c20-4e14-a70a-9219c7332ad6)

## Goals

Most of the time, treat wounds is the exact same procedure, and the values are relatively static (making the process tedious).

The experience for the UI should basically allow a player to configure how they treat wounds once, and then click "roll" as
many times as needed.

## Contributing

Contributions are welcome -- I'm a dad, so I don't have a ton of free time to review changes. I won't be offended if you fork and deploy your own version.

## Not planned for support:
- any feats/abilities that are other-player-oriented. For example, if the rules say "when someone treats your wounds"? Then that player can manage their one-off bonuses.
   - Supporting these will add options will only add clutter to the UI, and add a new kind of tedium as players select the right options per player from roll to roll. (We'd need to store per-player settings or something. Out of scope for now.)
- transposable compliance/right hand blood. I could be convinced otherwise, but I'd need to know the use case where you frequently choose to hurt yourself.
