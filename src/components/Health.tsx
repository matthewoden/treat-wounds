import Box from "@mui/material/Box";
import { AbilityCheckOutcome } from "../diceroller/checks";
import Typography from "@mui/material/Typography";


const Attribute = ({label, value}: {label: string, value: string | number}) => {
  return (
    <Box display={'flex'} flexDirection={'row'} gap={1}>
      <Typography variant="overline" color="text.secondary">{label}:</Typography>
      <Typography variant="overline" >{value}</Typography>
    </Box>
  )
}

export const HealthOutcome = ({outcome}: {outcome: AbilityCheckOutcome | null}) => {
  return (
    <Box display={'flex'} flexDirection={'column'} flexGrow={1} paddingLeft={2} paddingTop={3}>
      {outcome && (
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Typography variant="h4">{outcome.value} HP</Typography>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
            <Typography variant="overline" color="text.primary">{outcome.result}</Typography>
            <Attribute label={"Total"} value={outcome.total} />
            <Attribute label={"Roll"} value={outcome.d20Result} />
            <Attribute label={"Med"} value={outcome.modifier} />
            <Attribute label={"Aid"} value={outcome.bonus} />
          </Box>
        </Box>
      )}
      {!outcome && <Typography color={"text.secondary"} paddingRight={2} alignSelf={"center"}>Roll to see results.</Typography>}
    </Box>
  )
}
