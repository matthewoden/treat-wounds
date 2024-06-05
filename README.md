# Treat Wounds

Try it out at: https://treatwounds.netlify.app

A quick and dirty solution for Treat Wounds taking a lot of table-time in PF2E.

- If someone is aiding you, aid checks are rolled and the bonus is calculated based on that output.
- If you have multiple sources of bonuses, or just a simple static bonus, or other bonus sources, you can enter those there.

![image](https://github.com/matthewoden/treat-wounds/assets/4907424/e5641849-5c20-4e14-a70a-9219c7332ad6)

## Goals

Most of the time, treat wounds is the exact same procedure, and the values are relatively static (making the process tedious). 
The experience for the UI should basically allow a player to configure how they treat wounds once, and then click "roll" as
many times as needed.

## Contributing

Contributions are welcome -- I'm a dad, so I don't have a ton of free time to review changes. I won't be offended if you fork and deploy your own version.

## Roadmap

- a static bonus box where all other bonuses can be placed from (currently a toggle with aid -- it needs to always be present.)
- a checkbox for risky surgery, and mortal healing (which largely do the same thing)
    - maybe a generic option for "treat a success as a critical success"
- damage listed in the sidebar, if applicable. Display the combined total for healing and damage, but spell out the damage below the total amount healed.
- a checkbox for magic hands (heal with d10s vs d8s)
- a checkbox for medic dedication (additional healing when you treat wounds, based on dc)
- some kind of local persistence, so folks don't lose their settings from session to session
- display the full set of selections in the metadata/log
- display a number next to the roll to aid in time keeping.  ("With ward medic, I can treat two people every 10 minutes, and we've had 4 rolls -- so 20 minutes have passed")

## Not planned for support:
- any feats/abilities that are other-player-oriented. For example, if the rules say "when someone treats your wounds"? Then that player can manage their one-off bonuses.
   - Supporting these will add options that
- transposable compliance/right hand blood. These do damage to you, and aren't something that will be done repeatedly.
