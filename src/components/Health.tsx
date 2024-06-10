import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const Attribute = ({label, value}: {label: string, value: string | number}) => {
  return (
    <>
    <Divider/>
    <Box display={'flex'} flexDirection={'row'} gap={1}>
      <Typography variant="overline" color="text.secondary" width={65}>{label}:</Typography>
      <Typography variant="overline" >{value}</Typography>
    </Box>
    </>
  )
}

export const HealthOutcome = ({outcome}: {outcome: AbilityCheckOutcome<TreatWoundsCheck> | null}) => {
  return (
    <Box display={'flex'} flexDirection={'column'} flexGrow={1} paddingLeft={2} paddingTop={3}>
      {outcome && (
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Typography variant="h4">{outcome.value.harm !== 0 ? outcome.value.net : outcome.value.healing} HP</Typography>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
            <Typography variant="overline" color="text.primary">{outcome.result}</Typography>
            {outcome.value.harm !== 0 && <Attribute label={"Heal"} value={outcome.value.healing ?? 0} />}
            {outcome.value.harm !== 0 && <Attribute label={"Harm"} value={Math.abs(outcome.value.harm)} />}
            {outcome.value.harm !== 0 && <Attribute label={"Net"} value={outcome.value.net} />}
            <Attribute label={"D20"} value={outcome.d20Result} />
            <Attribute label={"Bonus"} value={outcome.bonus} />
            <Attribute label={"Mod"} value={outcome.modifier} />
            <Attribute label={"Total"} value={outcome.total} />
          </Box>
        </Box>
      )}
      {!outcome && <Typography color={"text.secondary"} paddingRight={2} alignSelf={"center"}>Roll to see results.</Typography>}
    </Box>
  )
}
